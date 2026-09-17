// ===================== CHARTS: decimation + inline SVG line charts + sparklines =====================
const SVG_NS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  if (attrs) for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

// Elapsed-time points (ms since the file's own start) — lets sessions of different
// wall-clock dates overlay meaningfully by "minutes into the run".
function elapsedPoints(file, col) {
  if (!col || !col.series || !file.startTime) return [];
  const t0 = file.startTime.getTime();
  const pts = [];
  for (let r = 0; r < file.nRows; r++) {
    const t = file.timestamps[r], v = col.series[r];
    if (t != null && v != null) pts.push({ t: t.getTime() - t0, v });
  }
  return pts;
}

// Min/max-preserving decimation: keeps visual spikes even when reducing point count.
function decimate(points, maxPoints) {
  if (points.length <= maxPoints) return points;
  const bucketSize = points.length / (maxPoints / 2);
  const out = [];
  for (let i = 0; i < points.length; i += bucketSize) {
    const end = Math.min(points.length, Math.floor(i + bucketSize));
    let lo = points[Math.floor(i)], hi = points[Math.floor(i)];
    for (let j = Math.floor(i); j < end; j++) { if (points[j].v < lo.v) lo = points[j]; if (points[j].v > hi.v) hi = points[j]; }
    if (lo.t <= hi.t) { out.push(lo, hi); } else { out.push(hi, lo); }
  }
  return out;
}

function fmtElapsed(ms) {
  const s = Math.round(ms / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), rs = s % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  if (m > 0) return `${m}m ${String(rs).padStart(2, '0')}s`;
  return `${rs}s`;
}
function fmtValue(v, unit) {
  if (v == null) return '—';
  const abs = Math.abs(v);
  const s = abs >= 100 ? v.toFixed(0) : abs >= 10 ? v.toFixed(1) : v.toFixed(2);
  return unit ? `${s} ${unit}` : s;
}

// series: [{label, color, points:[{t,v}]}]  (t = ms elapsed, v = value)
function buildLineChart(series, opts) {
  opts = opts || {};
  const W = opts.width || 600, H = opts.height || 190;
  const padL = 40, padR = 12, padT = 12, padB = 24;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const unit = opts.unit || '';

  const wrap = document.createElement('div');
  wrap.className = 'chart-wrap';

  const allPts = series.flatMap(s => s.points);
  if (!allPts.length) {
    wrap.innerHTML = '<div class="footnote" style="padding:24px 0;text-align:center;">No data for this metric.</div>';
    return wrap;
  }
  let minV = Math.min(...allPts.map(p => p.v)), trueMaxV = Math.max(...allPts.map(p => p.v));
  let maxV = trueMaxV;
  let clipped = false;
  // A handful of extreme outliers (a single huge stutter spike, say) can flatten
  // the rest of an otherwise-readable chart. When asked, cap the visible axis at a
  // percentile and let outlier points draw pinned to the top edge instead.
  if (opts.clipPercentile && allPts.length > 20) {
    const sorted = allPts.map(p => p.v).sort((a, b) => a - b);
    const capV = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * opts.clipPercentile))];
    if (capV > 0 && capV < trueMaxV * 0.6) { maxV = capV; clipped = true; }
  }
  if (minV === maxV) { minV -= 1; maxV += 1; }
  const pad = (maxV - minV) * 0.08;
  minV -= pad; maxV += pad * (clipped ? 2.2 : 1);
  if (opts.zeroFloor && minV < 0 && Math.min(...allPts.map(p => p.v)) >= 0) minV = 0;
  const maxT = Math.max(...allPts.map(p => p.t));
  const minT = 0;

  const x = t => padL + (maxT === minT ? 0 : ((t - minT) / (maxT - minT)) * plotW);
  const yRaw = v => padT + plotH - ((v - minV) / (maxV - minV)) * plotH;
  const y = v => clipped ? Math.max(padT + 1.5, yRaw(v)) : yRaw(v);

  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: H, preserveAspectRatio: 'none' });
  svg.style.display = 'block';
  svg.style.overflow = clipped ? 'hidden' : 'visible';

  // gridlines (3 horizontal bands)
  const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--grid').trim() || '#e1e0d9';
  const mutedColor = getComputedStyle(document.documentElement).getPropertyValue('--ink-muted').trim() || '#898781';
  const nGrid = 3;
  for (let i = 0; i <= nGrid; i++) {
    const v = minV + ((maxV - minV) * i) / nGrid;
    const yy = y(v);
    svg.appendChild(svgEl('line', { x1: padL, x2: W - padR, y1: yy, y2: yy, stroke: gridColor, 'stroke-width': 1 }));
    const label = svgEl('text', { x: padL - 6, y: yy + 3, 'text-anchor': 'end', 'font-size': 9.5, fill: mutedColor, 'font-family': 'IBM Plex Mono, monospace' });
    label.textContent = fmtValue(v, '');
    svg.appendChild(label);
  }
  // x-axis labels (start / mid / end elapsed time)
  for (const frac of [0, 0.5, 1]) {
    const t = minT + (maxT - minT) * frac;
    const xx = x(t);
    const anchor = frac === 0 ? 'start' : frac === 1 ? 'end' : 'middle';
    const label = svgEl('text', { x: xx, y: H - 6, 'text-anchor': anchor, 'font-size': 9.5, fill: mutedColor, 'font-family': 'IBM Plex Mono, monospace' });
    label.textContent = fmtElapsed(t);
    svg.appendChild(label);
  }

  const seriesRendered = series.filter(s => s.points.length);
  for (const s of seriesRendered) {
    const dec = decimate(s.points, 700);
    if (opts.area && seriesRendered.length === 1) {
      const areaPts = [`${x(dec[0].t)},${y(minV)}`, ...dec.map(p => `${x(p.t)},${y(p.v)}`), `${x(dec[dec.length - 1].t)},${y(minV)}`].join(' ');
      svg.appendChild(svgEl('polygon', { points: areaPts, fill: s.color, opacity: 0.12, stroke: 'none' }));
    }
    const d = dec.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
    svg.appendChild(svgEl('path', { d, fill: 'none', stroke: s.color, 'stroke-width': 1.75, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
    // emphasize endpoint
    const last = dec[dec.length - 1];
    svg.appendChild(svgEl('circle', { cx: x(last.t), cy: y(last.v), r: 2.6, fill: s.color }));
  }

  // hover layer
  const hoverLine = svgEl('line', { x1: 0, x2: 0, y1: padT, y2: padT + plotH, stroke: mutedColor, 'stroke-width': 1, opacity: 0 });
  svg.appendChild(hoverLine);
  const hoverDots = seriesRendered.map(s => { const c = svgEl('circle', { r: 3.4, fill: s.color, stroke: 'var(--surface)', 'stroke-width': 1.5, opacity: 0 }); svg.appendChild(c); return c; });
  const hitRect = svgEl('rect', { x: padL, y: padT, width: plotW, height: plotH, fill: 'transparent' });
  svg.appendChild(hitRect);

  const tooltip = document.createElement('div');
  tooltip.className = 'chart-tooltip';
  wrap.appendChild(svg);
  wrap.appendChild(tooltip);
  if (clipped) {
    const note = document.createElement('div');
    note.className = 'footnote';
    note.style.marginTop = '2px';
    note.textContent = `Y-axis capped near the typical range so occasional spikes (up to ${fmtValue(trueMaxV, unit)}) don't flatten the rest of the chart — hover to see exact values.`;
    wrap.appendChild(note);
  }

  function nearestIndex(points, t) {
    let lo = 0, hi = points.length - 1;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (points[mid].t < t) lo = mid + 1; else hi = mid; }
    return lo;
  }

  hitRect.addEventListener('mousemove', (e) => {
    const rect = svg.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const frac = Math.min(1, Math.max(0, (px - (padL * rect.width / W)) / ((plotW) * rect.width / W)));
    const t = minT + frac * (maxT - minT);
    let html = `<div class="tt-time">${fmtElapsed(t)} elapsed</div>`;
    let anyX = null, anyY = null;
    seriesRendered.forEach((s, i) => {
      const idx = nearestIndex(s.points, t);
      const p = s.points[Math.max(0, Math.min(s.points.length - 1, idx))];
      if (!p) { hoverDots[i].setAttribute('opacity', 0); return; }
      hoverDots[i].setAttribute('cx', x(p.t)); hoverDots[i].setAttribute('cy', y(p.v)); hoverDots[i].setAttribute('opacity', 1);
      if (anyX == null) { anyX = x(p.t); anyY = y(p.v); }
      html += `<div class="tt-row"><span class="sw" style="background:${s.color}"></span>${seriesRendered.length > 1 ? s.label + ': ' : ''}<b>${fmtValue(p.v, unit)}</b></div>`;
    });
    hoverLine.setAttribute('x1', anyX); hoverLine.setAttribute('x2', anyX); hoverLine.setAttribute('opacity', 1);
    tooltip.innerHTML = html;
    tooltip.style.opacity = 1;
    const leftPct = (anyX / W) * 100;
    tooltip.style.left = `${leftPct}%`;
    tooltip.style.top = `${(anyY / H) * 100}%`;
  });
  hitRect.addEventListener('mouseleave', () => {
    hoverLine.setAttribute('opacity', 0);
    hoverDots.forEach(d => d.setAttribute('opacity', 0));
    tooltip.style.opacity = 0;
  });

  return wrap;
}

// Compact sparkline for stat tiles — single series, no axes.
function buildSparkline(points, color) {
  const W = 200, H = 32;
  if (!points.length) return svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'spark' });
  const dec = decimate(points, 80);
  const vs = dec.map(p => p.v);
  let minV = Math.min(...vs), maxV = Math.max(...vs);
  if (minV === maxV) { minV -= 1; maxV += 1; }
  const x = i => (i / (dec.length - 1 || 1)) * W;
  const y = v => H - 3 - ((v - minV) / (maxV - minV)) * (H - 6);
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'spark', preserveAspectRatio: 'none' });
  const linePts = dec.map((p, i) => `${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  const areaPts = `0,${H} ${linePts} ${W},${H}`;
  svg.appendChild(svgEl('polygon', { points: areaPts, fill: color, opacity: 0.14, stroke: 'none' }));
  svg.appendChild(svgEl('polyline', { points: linePts, fill: 'none', stroke: color, 'stroke-width': 1.6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
  const lastI = dec.length - 1;
  svg.appendChild(svgEl('circle', { cx: x(lastI), cy: y(dec[lastI].v), r: 2.2, fill: color }));
  return svg;
}
