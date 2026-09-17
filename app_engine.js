// ===================== ENGINE: CSV parsing & column modeling =====================
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  const n = text.length;
  for (let i = 0; i < n; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\r') { /* skip */ }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  while (rows.length && rows[rows.length - 1].every(v => v === '')) rows.pop();
  return rows;
}

function looksLikeDate(s) { if (!s) return false; s = s.trim(); return /^\d{1,2}[./]\d{1,2}[./]\d{2,4}$/.test(s); }
function looksLikeTime(s) { if (!s) return false; s = s.trim(); return /^\d{1,2}:\d{1,2}:\d{1,2}(\.\d+)?$/.test(s); }

function parseDateTime(dateStr, timeStr) {
  dateStr = (dateStr || '').trim(); timeStr = (timeStr || '').trim();
  let d, mo, y;
  if (dateStr.includes('.')) { const p = dateStr.split('.').map(Number); d = p[0]; mo = p[1]; y = p[2]; }
  else if (dateStr.includes('/')) { const p = dateStr.split('/').map(Number); mo = p[0]; d = p[1]; y = p[2]; }
  else return null;
  if (y < 100) y += 2000;
  const tparts = timeStr.split(':');
  const hh = Number(tparts[0]) || 0;
  const mm = Number(tparts[1]) || 0;
  const ss = parseFloat(tparts[2]) || 0;
  const wholeSec = Math.floor(ss);
  const ms = Math.round((ss - wholeSec) * 1000);
  const dt = new Date(y, mo - 1, d, hh, mm, wholeSec, ms);
  return isNaN(dt.getTime()) ? null : dt;
}

const CATEGORY_RULES = [
  { cat: 'CPU', re: /\bcpu\b|\bcore \d|\bcore(s)? (clock|usage|utility|ratio|temperature|power|vid)|tctl|tdie|ccd|prochot|\bhtc\b|package power|core c[016] residency|infinity fabric|fclk|uclk/i },
  { cat: 'GPU', re: /\bgpu\b|dgpu|igpu|vram|nvvdd|vddcr_gfx|12vhpwr|framerate|frame time/i },
  { cat: 'Memory', re: /memory|dram|\bdimm\b|page file|virtual memory/i },
  { cat: 'Storage', re: /drive|smart|s\.m\.a\.r\.t|disk|read (rate|total|activity)|write (rate|total|activity)/i },
  { cat: 'Network', re: /network|ethernet|wi-?fi|\bwlan\b|download|upload| dl | up |kb\/s/i },
  { cat: 'Motherboard', re: /motherboard|chipset|vrm|vcore|vddio|vsb|vbat|vtt|vmisc|vhif|vin\d|\+5v|\+12v|3vcc|3vsb|1\.8v|pmic|spd hub|fan|pump|rpm/i },
  { cat: 'PCIe', re: /pcie|pci express|dllp|tlp|lcrc|\bnak\b|replay|recovery count|correctable|fatal error|unsupported request/i },
  { cat: 'System', re: /^date$|^time$|whea/i },
];
function classifyColumn(name, hwLabel) {
  if (hwLabel) {
    const h = hwLabel.toLowerCase();
    if (h.startsWith('cpu') || h.includes('ryzen') || h.includes('intel core')) return 'CPU';
    if (h.startsWith('dgpu') || h.startsWith('igpu') || h.includes('geforce') || h.includes('radeon')) return 'GPU';
    if (h.includes('dimm') || h.includes('memory')) return 'Memory';
    if (h.startsWith('drive') || h.startsWith('s.m.a.r.t')) return 'Storage';
    if (h.startsWith('network')) return 'Network';
    if (h.includes('whea')) return 'System';
    if (h.includes('presentmon')) return 'GPU';
    if (h.includes('asus') || h.includes('gigabyte') || h.includes('msi') || h.includes('asrock') || h.includes('nuvoton') || h.includes('ite') || h.includes('chipset')) return 'Motherboard';
  }
  for (const rule of CATEGORY_RULES) if (rule.re.test(name)) return rule.cat;
  return 'Other';
}

function extractUnit(name) { const m = name.match(/\[([^\]]*)\]\s*$/); return m ? m[1] : ''; }

function computeStats(nums) {
  if (!nums.length) return null;
  const sorted = nums.slice().sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const avg = sum / sorted.length;
  const pct = p => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
  const variance = sorted.reduce((a, b) => a + (b - avg) * (b - avg), 0) / sorted.length;
  return {
    min: sorted[0], max: sorted[sorted.length - 1], avg,
    median: pct(0.5), p1: pct(0.01), p5: pct(0.05), p95: pct(0.95), p99: pct(0.99),
    stdev: Math.sqrt(variance), count: sorted.length, last: nums[nums.length - 1],
  };
}

function extractSystemInfo(hwRow) {
  const info = { motherboard: null, cpu: null, gpus: [], ram: [], drives: [], networks: [] };
  if (!hwRow) return info;
  const seen = new Set();
  for (const v of hwRow) {
    const s = (v || '').trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    const low = s.toLowerCase();
    if (low.startsWith('cpu [') && !info.cpu) info.cpu = s.replace(/^cpu \[#\d+\]:\s*/i, '');
    else if ((low.startsWith('dgpu') || low.startsWith('igpu'))) {
      const clean = s.replace(/^(dgpu|igpu) \[#\d+\]:\s*/i, '');
      const base = clean.split(':')[0].trim();
      if (base && !info.gpus.includes(base)) info.gpus.push(base);
    }
    else if (low.includes('dimm')) {
      const m = s.match(/DDR\d?\s*DIMM.*?:\s*(.+?)\s*\(/i);
      const label = m ? m[1] : s;
      if (!info.ram.includes(label)) info.ram.push(label);
    }
    else if (low.startsWith('drive:')) {
      const clean = s.replace(/^drive:\s*/i, '');
      if (!info.drives.includes(clean)) info.drives.push(clean);
    }
    else if (low.startsWith('network:')) {
      const clean = s.replace(/^network:\s*/i, '').split(' - ')[0].trim();
      if (!info.networks.includes(clean)) info.networks.push(clean);
    }
    else if (/gaming|strix|aorus|tomahawk|prime|taichi|carbon|hero|extreme|apex|pro art|unify|ace\b/i.test(s) && !/dimm|drive|cpu|gpu/i.test(low)) {
      if (!info.motherboard) info.motherboard = s;
    }
  }
  return info;
}

function parseHWiNFOFile(fileName, text, meta) {
  const rows = parseCSV(text);
  if (!rows.length || rows.length < 2) throw new Error(`"${fileName}" does not look like an HWiNFO CSV log (no data rows found).`);

  const header0 = rows[0];
  if (!(/^date$/i.test(header0[0] || '') && /^time$/i.test(header0[1] || ''))) {
    throw new Error(`"${fileName}" does not look like an HWiNFO CSV log (expected "Date,Time,..." header).`);
  }

  let dataEnd = rows.length;
  for (let i = rows.length - 1; i >= 1; i--) {
    if (looksLikeDate(rows[i][0]) && looksLikeTime(rows[i][1])) { dataEnd = i + 1; break; }
  }
  const footerRows = rows.slice(dataEnd);
  const dataRows = rows.slice(1, dataEnd);
  if (!dataRows.length) throw new Error(`"${fileName}" has a header but no readable data rows.`);

  let canonHeader = header0;
  let hwRow = null;
  for (const fr of footerRows) {
    if (fr[0] === 'Date' && fr[1] === 'Time') { if (fr.length > canonHeader.length) canonHeader = fr; }
    else {
      const nonEmpty = fr.filter(v => v && v.trim()).length;
      if (nonEmpty > fr.length * 0.3) hwRow = fr;
    }
  }
  const numCols = canonHeader.length;
  const columns = canonHeader.map((name, i) => ({
    index: i, name: name || `Column ${i}`, unit: extractUnit(name || ''), hwLabel: hwRow ? (hwRow[i] || '') : '',
  }));
  columns.forEach(c => { c.category = classifyColumn(c.name, c.hwLabel); });

  const nRows = dataRows.length;
  const timestamps = new Array(nRows);
  const isNumericCol = new Array(numCols).fill(true);
  const isBooleanCol = new Array(numCols).fill(true);
  const raw = columns.map(() => new Array(nRows));

  for (let r = 0; r < nRows; r++) {
    const row = dataRows[r];
    timestamps[r] = parseDateTime(row[0], row[1]);
    for (let c = 0; c < numCols; c++) {
      const cell = c < row.length ? row[c] : '';
      const v = cell == null ? '' : cell.trim();
      raw[c][r] = v;
      if (v !== '' && v !== '-') {
        const low = v.toLowerCase();
        if (low !== 'yes' && low !== 'no' && isNaN(parseFloat(v))) isNumericCol[c] = false;
        if (low !== 'yes' && low !== 'no') isBooleanCol[c] = false;
      }
    }
  }
  isNumericCol[0] = false; isNumericCol[1] = false; isBooleanCol[0] = false; isBooleanCol[1] = false;

  columns.forEach((col, c) => {
    col.isNumeric = isNumericCol[c] && !isBooleanCol[c];
    col.isBoolean = isBooleanCol[c];
    if (col.isNumeric) {
      const nums = [];
      const series = new Array(nRows);
      for (let r = 0; r < nRows; r++) {
        const v = raw[c][r];
        if (v !== '' && v !== '-') { const f = parseFloat(v); if (!isNaN(f)) { nums.push(f); series[r] = f; } else series[r] = null; }
        else series[r] = null;
      }
      col.numData = nums;
      col.series = series; // aligned with file.timestamps, null = missing
      col.stats = computeStats(nums);
    } else if (col.isBoolean) {
      // boolSeries mirrors col.series (row-aligned, null = missing) so a trimmed
      // comparison window (see buildTrimmedFileView in app_compare.js) can recompute
      // throttle/warning-flag percentages for just that window instead of the whole file.
      let trueCount = 0, total = 0;
      const boolSeries = new Array(nRows);
      for (let r = 0; r < nRows; r++) {
        const v = raw[c][r];
        if (v === '') { boolSeries[r] = null; continue; }
        const isTrue = v.toLowerCase() === 'yes';
        boolSeries[r] = isTrue;
        total++; if (isTrue) trueCount++;
      }
      col.boolSeries = boolSeries;
      col.boolStats = { trueCount, total, trueFraction: total ? trueCount / total : 0 };
    }
  });

  let startTime = null, endTime = null;
  for (const t of timestamps) { if (t) { if (!startTime || t < startTime) startTime = t; if (!endTime || t > endTime) endTime = t; } }

  return {
    fileName, columns, timestamps, nRows,
    startTime, endTime, durationMs: (startTime && endTime) ? (endTime - startTime) : 0,
    systemInfo: extractSystemInfo(hwRow),
    lastModified: (meta && meta.lastModified) || null,
    isDemo: !!(meta && meta.isDemo),
  };
}

// Build [{t,v}] points for a numeric column, skipping rows with no timestamp or no value.
function pointsFor(file, col) {
  if (!col || !col.series) return [];
  const pts = [];
  for (let r = 0; r < file.nRows; r++) {
    const t = file.timestamps[r];
    const v = col.series[r];
    if (t != null && v != null) pts.push({ t: t.getTime(), v });
  }
  return pts;
}
