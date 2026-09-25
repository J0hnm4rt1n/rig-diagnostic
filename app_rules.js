// ===================== RULES: key metrics + issue detection =====================
const KEY_METRICS = [
  { id: 'cpu_temp', label: 'CPU Temperature', group: 'thermals', unit: '°C', patterns: [/^CPU \(Tctl\/Tdie\)/i, /^CPU Package \[/i, /^Core Max\(Tj\)/i, /^CPU Die \(average\)/i, /^CPU \[.?C\]$/i] },
  { id: 'vrm_temp', label: 'CPU VRM Temperature', group: 'thermals', unit: '°C', patterns: [/^CPU VDDCR_VDD VRM/i] },
  { id: 'gpu_vrm_temp', label: 'GPU VRM Temperature', group: 'thermals', unit: '°C', patterns: [/^GPU VRM1 Temperature/i, /^GPU VRM Temperature/i] },
  { id: 'gpu_temp', label: 'GPU Temperature', group: 'thermals', unit: '°C', patterns: [/^GPU Temperature \[/i] },
  { id: 'gpu_hotspot', label: 'GPU Hot Spot', group: 'thermals', unit: '°C', patterns: [/^GPU Hot Spot Temperature/i, /^GPU Hotspot/i] },
  { id: 'gpu_mem_temp', label: 'GPU Memory Junction Temp', group: 'thermals', unit: '°C', patterns: [/^GPU Memory Junction Temperature/i] },
  { id: 'motherboard_temp', label: 'Motherboard Temperature', group: 'thermals', unit: '°C', patterns: [/^Motherboard \[/i] },

  { id: 'cpu_power', label: 'CPU Package Power', group: 'power', unit: 'W', patterns: [/^CPU Package Power/i, /^CPU PPT \[/i] },
  { id: 'gpu_power', label: 'GPU Power', group: 'power', unit: 'W', patterns: [/^GPU Power \[/i] },
  { id: 'vcore', label: 'Vcore', group: 'power', unit: 'V', patterns: [/^Vcore \[/i, /^CPU VDDCR_VDD Voltage/i, /^CPU Core Voltage/i] },

  { id: 'cpu_usage', label: 'Total CPU Usage', group: 'perf', unit: '%', patterns: [/^Total CPU Usage/i] },
  { id: 'cpu_clock', label: 'Core Clocks (avg)', group: 'perf', unit: 'MHz', patterns: [/^Core Clocks \(avg\)/i, /^Core Average Clock/i] },
  { id: 'gpu_util', label: 'GPU Utilization', group: 'perf', unit: '%', patterns: [/^GPU Utilization/i, /^GPU Core Load/i] },
  { id: 'gpu_clock', label: 'GPU Clock', group: 'perf', unit: 'MHz', patterns: [/^GPU Clock \[/i] },
  { id: 'fps_avg', label: 'Framerate (avg)', group: 'perf', unit: 'FPS', patterns: [/^Framerate Presented \(avg\)/i] },
  { id: 'fps_1low', label: 'Framerate (1% low)', group: 'perf', unit: 'FPS', patterns: [/^Framerate Presented \(1%\)/i] },
  { id: 'fps_displayed_avg', label: 'Framerate Displayed (avg)', group: 'gaming', unit: 'FPS', patterns: [/^Framerate Displayed \(avg\)/i] },
  { id: 'fps_displayed_1low', label: 'Framerate Displayed (1% low)', group: 'gaming', unit: 'FPS', patterns: [/^Framerate Displayed \(1%\)/i] },
  { id: 'frame_time_avg', label: 'Frame Time (avg)', group: 'gaming', unit: 'ms', patterns: [/^Frame Time Presented \(avg\)/i] },
  { id: 'gpu_busy', label: 'GPU Busy', group: 'gaming', unit: 'ms', patterns: [/^GPU Busy \(avg\)/i] },
  { id: 'gpu_wait', label: 'GPU Wait', group: 'gaming', unit: 'ms', patterns: [/^GPU Wait \(avg\)/i] },
  { id: 'cpu_busy', label: 'CPU Busy', group: 'gaming', unit: 'ms', patterns: [/^CPU Busy \(avg\)/i] },
  { id: 'cpu_wait', label: 'CPU Wait', group: 'gaming', unit: 'ms', patterns: [/^CPU Wait \(avg\)/i] },

  { id: 'ram_load', label: 'Physical Memory Load', group: 'memory', unit: '%', patterns: [/^Physical Memory Load/i] },
  { id: 'pagefile_use', label: 'Page File Usage', group: 'memory', unit: '%', patterns: [/^Page File Usage/i] },
  { id: 'dram_read_bw', label: 'DRAM Read Bandwidth', group: 'memory', unit: 'GB/s', patterns: [/^DRAM Read Bandwidth/i] },
  { id: 'dram_write_bw', label: 'DRAM Write Bandwidth', group: 'memory', unit: 'GB/s', patterns: [/^DRAM Write Bandwidth/i] },
];

const BOOL_METRICS = [
  { id: 'cpu_htc', label: 'CPU Thermal Throttling (HTC)', patterns: [/^Thermal Throttling \(HTC\)/i] },
  { id: 'cpu_prochot', label: 'CPU PROCHOT Throttling', patterns: [/^Thermal Throttling \(PROCHOT CPU\)/i, /^Thermal Throttling \(PROCHOT EXT\)/i] },
  { id: 'gpu_thermal_throttle', label: 'GPU Thermal Throttling', patterns: [/^Throttle Reason - Thermal/i, /^Performance Limit - Thermal/i] },
  { id: 'gpu_power_throttle', label: 'GPU Power-Limit Throttling', patterns: [/^Throttle Reason - Power/i, /^Performance Limit - Power/i] },
  { id: 'gpu_voltage_limit', label: 'GPU Reliability-Voltage Limit', patterns: [/^Performance Limit - Reliability Voltage/i] },
  { id: 'drive_warning', label: 'Drive Warning', patterns: [/^Drive Warning/i] },
  { id: 'drive_failure', label: 'Drive Failure (SMART)', patterns: [/^Drive Failure/i] },
  { id: 'pmic_high_temp', label: 'RAM PMIC High Temperature', patterns: [/^PMIC High Temperature/i] },
];

function findColumnsByPattern(file, patterns) {
  const out = [];
  for (const re of patterns) for (const col of file.columns) if (re.test(col.name)) out.push(col);
  return out;
}
function firstMatch(file, patterns, filter) {
  // Try every pattern in priority order. Several columns can share the same
  // display name (e.g. two unrelated "GPU Clock [MHz]" sensors), and a name
  // match can also turn out to be an unpopulated legacy sensor stuck at a
  // constant value — so within and across patterns, prefer the first column
  // that actually varies, and only fall back to a flat one if nothing varies.
  let fallback = null;
  for (const re of patterns) {
    const hits = file.columns.filter(c => re.test(c.name) && (!filter || filter(c)));
    if (!hits.length) continue;
    if (!fallback) fallback = hits[0];
    const varying = hits.find(c => !(c.stats && c.stats.max === c.stats.min));
    if (varying) return varying;
  }
  return fallback;
}
function resolveKeyMetrics(file) {
  const resolved = {};
  for (const m of KEY_METRICS) resolved[m.id] = firstMatch(file, m.patterns, c => c.isNumeric && c.stats);
  return resolved;
}
function resolveBoolMetrics(file) {
  const resolved = {};
  for (const m of BOOL_METRICS) resolved[m.id] = findColumnsByPattern(file, m.patterns).filter(c => c.isBoolean && c.boolStats && c.boolStats.total > 0);
  return resolved;
}
function findAllNumeric(file, re) { return file.columns.filter(c => re.test(c.name) && c.isNumeric && c.stats && c.stats.count > 0); }

// PCIe counters that indicate an actual link fault (Recovery Count is deliberately not
// one of them — see detectIssues). Shared with the Network & PCIe table.
const PCIE_FAULT_PATTERNS = [/^Correctable Error Count/i, /^Non-Fatal Error Count/i, /^Fatal Error Count/i, /^Bad DLLP Count/i, /^Bad TLP Count/i, /^LCRC Error Count/i, /^Replay Count/i, /^Receiver Errors/i, /^NAKs Sent Count/i, /^NAKs Received Count/i];
// How much a running-total counter went up within this log.
function counterIncrease(col) { return col.stats.max - col.stats.min; }

const SEVERITY_RANK = { critical: 4, serious: 3, warning: 2, info: 1 };
function pctTrue(cols) { let t = 0, tot = 0; for (const c of cols) { t += c.boolStats.trueCount; tot += c.boolStats.total; } return tot ? t / tot : 0; }
function fmtPct(x) { return `${Math.round(x * 100)}%`; }
function fmtDur(ms) {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60), rs = s % 60;
  if (m < 60) return `${m}m ${rs}s`;
  const h = Math.floor(m / 60), rm = m % 60;
  return `${h}h ${rm}m`;
}
function stripUnit(name) { return name.replace(/\s*\[.*\]$/, ''); }
// Identifies the same physical sensor across logs (column indexes shift between logs,
// and two devices can share a column name), so per-sensor issue ids stay distinct
// within a log and still line up between logs.
function sensorKey(col) { return `${col.hwLabel || ''}|${col.name}`; }
function driveDisplayName(hwLabel) {
  const clean = stripDriveSerial((hwLabel || '').replace(/^drive:\s*/i, '').replace(/^s\.m\.a\.r\.t\.?:\s*/i, ''));
  return clean || 'Drive';
}

function detectIssues(file) {
  const km = resolveKeyMetrics(file);
  const bm = resolveBoolMetrics(file);
  const { cpuSpec, gpuSpec } = (typeof getHardwareSpecs === 'function') ? getHardwareSpecs(file) : { cpuSpec: null, gpuSpec: null };
  const issues = [];
  const add = (id, severity, title, detail, suggestion, evidenceCol, category) => {
    issues.push({ id, severity, title, detail, suggestion, category, evidenceCol: evidenceCol || null, file: file.fileName });
  };

  if (km.cpu_temp) {
    const s = km.cpu_temp.stats;
    // When the CPU model is recognized, judge it against that model's own documented
    // Tjmax/throttle point instead of a generic desktop-CPU number — Ryzen X3D parts
    // throttle several degrees below plain Ryzen/Intel parts, for example.
    const tj = cpuSpec ? cpuSpec.tjMaxC : 100;
    const critT = tj - 3, seriousT = tj - 10, warningT = tj - 15;
    const specNote = cpuSpec ? ` (identified as a ${cpuSpec.name}, which throttles around ${tj}°C)` : '';
    if (s.max >= critT) add('cpu_temp', 'critical', 'CPU running critically hot', `Peaked at ${s.max.toFixed(1)}°C (avg ${s.avg.toFixed(1)}°C)${specNote}. This is at or above the typical throttle point for ${cpuSpec ? 'this CPU' : 'modern desktop CPUs'}.`,
      'Reseat the cooler and repaste with fresh thermal compound, verify mounting pressure/backplate screws are even, confirm cooler and case fans are actually spinning at expected RPM, and check case airflow (intake/exhaust balance, dust filters). If this is a new build, some coolers ship with a protective film left on the coldplate — remove it. Also confirm the BIOS is not running an aggressive "performance" power preset beyond the CPU\'s rated limits.', km.cpu_temp, 'CPU');
    else if (s.max >= seriousT) add('cpu_temp', 'serious', 'CPU temperature is high under load', `Peaked at ${s.max.toFixed(1)}°C (avg ${s.avg.toFixed(1)}°C, 95th percentile ${s.p95.toFixed(1)}°C)${specNote}.`,
      'This can be within spec for high-core-count CPUs under sustained heavy load — some parts are designed to run near their limit and throttle gracefully. Still worth confirming cooler contact/mounting and case airflow, and checking whether a motherboard performance/PBO preset is pushing power beyond stock.', km.cpu_temp, 'CPU');
    else if (s.p95 >= warningT) add('cpu_temp', 'warning', 'CPU runs warm for extended periods', `95th-percentile temperature is ${s.p95.toFixed(1)}°C (max ${s.max.toFixed(1)}°C)${specNote}.`,
      'Worth keeping an eye on. Check dust buildup in the cooler fins/radiator, fan curve aggressiveness in BIOS, and ambient case temperature.', km.cpu_temp, 'CPU');
  }
  if (km.cpu_power && cpuSpec) {
    const s = km.cpu_power.stats;
    if (s.max >= cpuSpec.pptW * 1.15) add('cpu_power_over_spec', 'info', 'CPU power draw exceeds its stock power limit', `Peaked at ${s.max.toFixed(0)}W, above the ${cpuSpec.name}'s stock PPT/power limit of ${cpuSpec.pptW}W.`,
      `${cpuSpec.note ? cpuSpec.note + ' ' : ''}This usually means a motherboard "performance"/PBO preset or a manually raised power limit is active, not a fault. It's not inherently a problem, but it does mean the CPU is running outside AMD/Intel's own stock envelope, which affects how much of the thermal headroom above is really "spare."`, km.cpu_power, 'CPU');
  }
  const cpuThrottleCols = [...(bm.cpu_htc || []), ...(bm.cpu_prochot || [])];
  if (cpuThrottleCols.length) {
    const frac = pctTrue(cpuThrottleCols);
    if (frac > 0.01) add('cpu_throttle', frac > 0.15 ? 'critical' : (frac > 0.03 ? 'serious' : 'warning'), 'CPU hardware thermal throttling engaged',
      `The CPU's own thermal protection (HTC/PROCHOT) was active for ${fmtPct(frac)} of this session.`,
      'This is the CPU actively cutting clocks to protect itself — treat it as a cooling problem, not a tuning problem. Improve cooling (repaste, better airflow, a larger cooler) before changing any power or voltage settings.', null, 'CPU');
  }
  if (km.vcore) {
    const s = km.vcore.stats;
    if (s.max >= 1.55) add('vcore_high', 'serious', 'CPU voltage spikes are high', `Peak Vcore reached ${s.max.toFixed(3)}V (avg ${s.avg.toFixed(3)}V).`,
      "Brief transient spikes are normal on modern boards with fast voltage telemetry, but sustained voltage above roughly 1.4-1.45V raises long-term degradation risk. If a motherboard auto-overclock or performance profile is enabled, consider a more conservative preset or a manual voltage/curve-optimizer offset.", km.vcore, 'CPU');
  }
  const vrmCols = findAllNumeric(file, /VRM.*Temperature|VDDCR_VDD VRM|VDDCR_SOC VRM/i);
  for (const col of vrmCols) {
    const s = col.stats;
    if (s.max >= 100) add('vrm_temp:' + sensorKey(col), 'critical', `${stripUnit(col.name)} is very hot`, `Peaked at ${s.max.toFixed(1)}°C.`,
      'Sustained high VRM temperatures shorten regulator lifespan and can trigger unexpected shutdowns. Improve airflow directly over the VRM heatsink (a case fan or an AIO pump-mounted fan aimed at the socket area helps a lot on compact boards), and confirm the VRM heatsink is properly seated with intact thermal pads.', col, 'Motherboard');
    else if (s.max >= 90) add('vrm_temp:' + sensorKey(col), 'warning', `${stripUnit(col.name)} runs hot`, `Peaked at ${s.max.toFixed(1)}°C.`,
      'Keep an eye on this, especially in a compact case. A small fan directed at the VRM heatsink area is a cheap fix.', col, 'Motherboard');
  }
  if (km.gpu_temp) {
    const s = km.gpu_temp.stats;
    // AMD's RDNA cards are documented to run their core/junction sensor meaningfully
    // hotter than Nvidia parts as a matter of design — a flat 88C/80C bar flags healthy
    // Radeon cards as a problem and under-reacts on a genuinely hot Nvidia card.
    const throttleT = gpuSpec ? gpuSpec.coreThrottleC : 90;
    const seriousT = throttleT - 2, warningT = throttleT - 10;
    const specNote = gpuSpec ? ` (identified as a ${gpuSpec.name})` : '';
    const gpuNote = gpuSpecNoteFor(gpuSpec, !!km.gpu_hotspot);
    if (s.max >= seriousT) add('gpu_temp', 'serious', 'GPU core temperature is high', `Peaked at ${s.max.toFixed(1)}°C${specNote}.${gpuNote ? ' ' + gpuNote : ''}`,
      "Check that the case has adequate intake for the card's fans, that the fan curve isn't too passive at high load, and that the card is seated flat. Consider a more aggressive fan curve or improved case airflow.", km.gpu_temp, 'GPU');
    else if (s.max >= warningT) add('gpu_temp', 'warning', 'GPU runs warm under load', `Peaked at ${s.max.toFixed(1)}°C${specNote}.`,
      'Likely fine for most cards, but check case airflow and fan curve if you want more headroom.', km.gpu_temp, 'GPU');
  }
  if (km.gpu_power && gpuSpec) {
    const s = km.gpu_power.stats;
    if (s.max >= gpuSpec.tbpW * 1.1) add('gpu_power_over_spec', 'info', 'GPU power draw exceeds reference stock', `Peaked at ${s.max.toFixed(0)}W, above the ${gpuSpec.name}'s reference total board power of ${gpuSpec.tbpW}W.`,
      "This is typical of factory-overclocked/AIB cards with a raised power limit, or a manually raised power slider in the vendor's tuning software — not inherently a problem, just worth knowing when judging temperature headroom above.", km.gpu_power, 'GPU');
  }
  if (km.gpu_hotspot) {
    const s = km.gpu_hotspot.stats;
    const hsThrottle = (gpuSpec && gpuSpec.hotspotThrottleC) ? gpuSpec.hotspotThrottleC : DEFAULT_GPU_HOTSPOT_LIMIT_C;
    if (s.max >= hsThrottle) add('gpu_hotspot', 'critical', 'GPU hot-spot temperature is very high', `Peaked at ${s.max.toFixed(1)}°C${gpuSpec ? ` (reference throttle point for a ${gpuSpec.name} is around ${hsThrottle}°C)` : ''}.`,
      'A hot spot this high, especially alongside a much cooler core/edge reading, often points to thermal paste or pad degradation rather than a genuinely underpowered cooler. Consider a repaste/repad, and if this is a recent purchase, it may be worth raising with the vendor.', km.gpu_hotspot, 'GPU');
    else if (s.max >= 90) add('gpu_hotspot', 'warning', 'GPU hot-spot temperature runs high', `Peaked at ${s.max.toFixed(1)}°C${km.gpu_temp ? ` vs. ${km.gpu_temp.stats.max.toFixed(1)}°C core edge` : ''}.`,
      'A large gap between hot-spot and core/edge temperature is a common early sign of thermal paste wearing out. Worth monitoring over time.', km.gpu_hotspot, 'GPU');
  }
  if (bm.gpu_thermal_throttle && bm.gpu_thermal_throttle.length) {
    const frac = pctTrue(bm.gpu_thermal_throttle);
    if (frac > 0.02) add('gpu_thermal_throttle', frac > 0.2 ? 'serious' : 'warning', 'GPU thermally throttling', `Thermal throttle/limit flags were active for ${fmtPct(frac)} of the session.`,
      'The GPU is capping its own clocks to stay within temperature limits. Improve case/GPU cooling for more sustained performance.', null, 'GPU');
  }
  if (bm.gpu_power_throttle && bm.gpu_power_throttle.length) {
    const frac = pctTrue(bm.gpu_power_throttle);
    if (frac > 0.4) add('gpu_power_throttle', 'info', 'GPU frequently power-limited', `Power-limit throttling was active for ${fmtPct(frac)} of the session — expected under sustained full load.`,
      'This usually just means the GPU is using all the power headroom it is allowed. For more performance, raise the power limit in the vendor overclocking tool (if the card and PSU support it) or improve cooling so clocks can hold higher boost states for longer.', null, 'GPU');
  }
  const pinCurrentCols = findAllNumeric(file, /12VHPWR Pin\d Current/i);
  if (pinCurrentCols.length >= 2) {
    const maxes = pinCurrentCols.map(c => c.stats.max);
    const peakPin = Math.max(...maxes), minPeak = Math.min(...maxes), spread = peakPin - minPeak;
    if (peakPin >= 9.5) add('pin_current', 'critical', '12VHPWR connector pin current at unsafe level', `One or more pins peaked at ${peakPin.toFixed(2)}A, at or above the ~9.5A per-pin level associated with connector overheating risk on high-power GPUs.`,
      'Power down and physically inspect the 12VHPWR/12V-2x6 connector and cable for discoloration or deformation before continuing to use the system. Reseat the connector fully on both the PSU and GPU ends, try a different cable (a native PSU cable rather than an adapter, where possible), and avoid tight bends near the connector.', null, 'GPU');
    else if (spread >= 3) add('pin_imbalance', 'serious', '12VHPWR current is unevenly distributed across pins', `Peak per-pin current ranges from ${minPeak.toFixed(2)}A to ${peakPin.toFixed(2)}A across the connector's pins.`,
      'Uneven current sharing across the 12VHPWR/12V-2x6 pins is one of the early warning signs reported in connector-overheating cases on high-wattage cards. Make sure the connector is fully seated and not at an angle, and check it periodically for heat discoloration.', null, 'GPU');
  }
  const remainingLifeCols = findAllNumeric(file, /Drive Remaining Life/i);
  for (const col of remainingLifeCols) {
    const s = col.stats;
    const name = driveDisplayName(col.hwLabel);
    if (s.min <= 70) add('drive_life:' + sensorKey(col), 'critical', `${name}: SMART health critically low`, `Remaining life reported as low as ${s.min.toFixed(0)}%.`,
      "Back up this drive's data now and plan to replace it — SMART-reported remaining life this low means the drive's estimated endurance is largely used up.", col, 'Storage');
    else if (s.min <= 90) add('drive_life:' + sensorKey(col), 'warning', `${name}: SMART health degrading`, `Remaining life reported as low as ${s.min.toFixed(0)}%.`,
      'Not urgent, but worth including this drive in your backup rotation and watching the trend over time.', col, 'Storage');
  }
  if (bm.drive_warning && pctTrue(bm.drive_warning) > 0) add('drive_warning', 'critical', 'Drive reported a SMART warning', 'One or more drives flagged a SMART warning condition during this session.',
    "Back up important data immediately and run the manufacturer's diagnostic tool (e.g. Samsung Magician, WD Dashboard, CrystalDiskInfo) for a full health report.", null, 'Storage');
  if (bm.drive_failure && pctTrue(bm.drive_failure) > 0) add('drive_failure', 'critical', 'Drive reported an imminent failure warning', 'A drive flagged an imminent-failure SMART condition.',
    "Back up this drive immediately and replace it — this flag specifically indicates the manufacturer's own firmware expects failure soon.", null, 'Storage');
  const driveTempCols = findAllNumeric(file, /^Drive Temperature\s*\d*\s*\[/i);
  const tempByDrive = new Map();
  for (const col of driveTempCols) {
    if (!col.hwLabel) continue;
    const cur = tempByDrive.get(col.hwLabel);
    if (!cur || col.stats.max > cur.stats.max) tempByDrive.set(col.hwLabel, col);
  }
  for (const [hwLabel, col] of tempByDrive.entries()) {
    const label = driveDisplayName(hwLabel);
    if (col.stats.max >= 75) add('drive_temp:' + hwLabel, 'serious', `${label} is running very hot`, `Peaked at ${col.stats.max.toFixed(0)}°C.`,
      'NVMe SSDs throttle (and can wear out faster) when consistently this hot. Add a heatsink or improve airflow across the M.2 slot.', col, 'Storage');
    else if (col.stats.max >= 65) add('drive_temp:' + hwLabel, 'warning', `${label} runs hot under load`, `Peaked at ${col.stats.max.toFixed(0)}°C.`,
      "Consider checking or adding an M.2 heatsink, especially for sustained large file transfers.", col, 'Storage');
  }
  // Only counters that genuinely indicate a PCIe fault trigger the Warning/Serious
  // issue below. "Recovery Count" is deliberately excluded — per HWiNFO's own
  // developer, it tracks L0<->Recovery link-state transitions, which commonly fire
  // from an ordinary speed/width change (e.g. ASPM power-saving dropping the link to
  // a lower state when idle) rather than an actual error, so a nonzero, steady count
  // there is normal and not by itself a sign of a problem. It's surfaced separately
  // below at Info level instead of being lumped in with real fault counters.
  //
  // These counters are running totals, so a nonzero value can predate the log entirely.
  // A counter that rises *during* the log is the real signal; one that was already
  // nonzero but stayed flat is reported separately at a lower severity.
  const pcieSeen = [], pcieRose = [];
  let pcieRiseTotal = 0;
  for (const re of PCIE_FAULT_PATTERNS) for (const col of findAllNumeric(file, re)) {
    if (col.stats.max <= 0) continue;
    const rise = counterIncrease(col);
    pcieSeen.push(`${stripUnit(col.name)}: ${col.stats.max}`);
    if (rise > 0) { pcieRiseTotal += rise; pcieRose.push(`${stripUnit(col.name)} +${rise}`); }
  }
  const pcieFix = 'A small number of correctable errors can happen occasionally, but a growing count usually points to a seating or signal-integrity issue: reseat the GPU (and any PCIe riser cable) firmly, try a different PCIe slot or riser cable, update chipset and GPU drivers, and confirm PCIe power connectors are fully seated. If errors keep climbing, they can eventually cause driver crashes or a reduced link speed.';
  if (pcieRiseTotal > 0) add('pcie_errors', pcieRiseTotal > 50 ? 'serious' : 'warning', 'PCI Express link errors increased during this log',
    `Counters that went up while logging: ${pcieRose.join(', ')} (totals: ${pcieSeen.join(', ')}).`, pcieFix, null, 'PCIe');
  else if (pcieSeen.length) add('pcie_errors', 'info', 'PCI Express error counters were already nonzero',
    `${pcieSeen.join(', ')} — but none increased during this log, so these errors happened before logging started.`,
    `Nothing went wrong during this session. If you want to know whether the link is healthy, compare these counters across a few logs: a count that keeps growing is worth acting on. ${pcieFix}`, null, 'PCIe');
  for (const col of findAllNumeric(file, /^Recovery Count/i)) {
    if (col.stats.max > 0) add('pcie_recovery', 'info', 'PCIe link recovery events observed', `Recovery Count: ${col.stats.max} (${counterIncrease(col)} during this log).`,
      "This usually just reflects the link changing speed or width — commonly triggered by ASPM (PCIe power management) dropping the link to a lower state when idle — rather than an actual error, so a steady nonzero count here is normal on most systems. If you want to rule ASPM out, you can disable it in BIOS or set your GPU's Windows power management mode to \"Prefer maximum performance.\" Recovery events are separate from the PCIe error counters (correctable/non-fatal/fatal errors, bad TLP/DLLP, LCRC, replays, NAKs, receiver errors), which are the ones that actually indicate a fault.", col, 'PCIe');
  }
  const wheaFix = "WHEA events are logged by Windows when hardware reports a correctable or uncorrectable error. The most common cause is an unstable memory overclock — try resetting EXPO/XMP to a lower rated speed (or disabling it) and re-testing with MemTest86 or Karhu RAM Test. If it persists at JEDEC/stock memory speed, suspect the CPU's SoC/VDDIO voltages, the PCIe/GPU link, or a pending BIOS update.";
  for (const col of findAllNumeric(file, /whea/i)) {
    if (col.stats.max <= 0) continue;
    const rise = counterIncrease(col);
    if (rise > 0) add('whea:' + sensorKey(col), 'critical', 'Windows Hardware Error (WHEA) events during this log', `${stripUnit(col.name)} rose by ${rise} while logging (now ${col.stats.max}).`, wheaFix, col, 'System');
    else add('whea:' + sensorKey(col), 'warning', 'Windows Hardware Error (WHEA) events logged earlier', `${stripUnit(col.name)} was already at ${col.stats.max} when this log started and didn't increase during it.`,
      `No new errors occurred during this session, but earlier ones are still worth understanding. ${wheaFix}`, col, 'System');
  }
  const memCfg = (typeof checkMemoryConfig === 'function') ? checkMemoryConfig(file) : null;
  if (memCfg && memCfg.mismatch) {
    const r = memCfg.rated;
    add('memory_expo', memCfg.gapPct > 0.25 ? 'serious' : 'warning', 'Memory may be running below its rated speed',
      `The module label suggests DDR-${r.ratedSpeed}${r.ratedCAS ? ` CL${r.ratedCAS}` : ''}, but this log shows it running at roughly DDR-${memCfg.observedSpeed}${memCfg.observedCAS ? ` CL${memCfg.observedCAS}` : ''} — about ${fmtPct(memCfg.gapPct)} slower than rated.`,
      `This usually means EXPO (AMD) or XMP (Intel) isn't enabled in BIOS, so the memory is running near JEDEC default timings instead of its rated profile. Enabling EXPO/XMP (or setting the profile manually) is one of the highest-value free performance changes available, especially for gaming and especially on Ryzen X3D chips, which are sensitive to memory/Infinity Fabric speed. After enabling it, run a stability test (e.g. Karhu RAM Test or a few hours of TM5) since higher-speed profiles occasionally need a small SoC/VDDIO voltage nudge to be fully stable.`,
      null, 'Memory');
  }
  if (km.ram_load) {
    const s = km.ram_load.stats;
    if (s.p95 >= 92) add('ram_pressure', 'warning', 'Physical memory usage runs very high', `95th-percentile memory load was ${s.p95.toFixed(0)}% (peak ${s.max.toFixed(0)}%).`,
      'Sustained high memory pressure can cause stutter and heavy page-file paging. Consider closing background apps/browser tabs during demanding sessions, or adding more RAM if this is a regular pattern.', km.ram_load, 'Memory');
  }
  const rpmCols = file.columns.filter(c => /\[RPM\]$/i.test(c.name) && c.isNumeric && c.stats && c.stats.max > 200);
  for (const col of rpmCols) {
    if (col.stats.min === 0) add('fan_stall:' + sensorKey(col), 'warning', `${stripUnit(col.name)} reported 0 RPM at times`, `Ranged from 0 to ${col.stats.max.toFixed(0)} RPM.`,
      'This can be normal for a fan using a 0-RPM "silent" mode at low load, or it can indicate an intermittent connection or a failing fan. If this fan cools something that also ran hot in this log, check the cable seating and the fan curve in BIOS.', col, 'Motherboard');
  }
  // Gaming: capture-target sanity, stutter, and render-to-display pacing.
  const gaming = (typeof gamingSummary === 'function') ? gamingSummary(file) : null;
  if (gaming && gaming.process) {
    if (!gaming.isGame) {
      add('capture_not_game', 'info', `Frame data captured from "${gaming.process}", not a game`, `The framerate/frame-time readings in this log reflect ${gaming.process} (a system process), not gameplay.`,
        `These numbers aren't representative of in-game performance — HWiNFO wasn't attached to a foreground game during this capture. To measure real game performance, start the HWiNFO log (or leave it running) while the game is in focus and being played.`, null, 'GPU');
    } else if (gaming.stutter && gaming.stutter.activeCount >= 60) {
      const frac = gaming.stutter.count / gaming.stutter.activeCount;
      if (frac > 0.08 || gaming.stutter.worstMs > 50) {
        add('frame_stutter', frac > 0.2 || gaming.stutter.worstMs > 100 ? 'serious' : 'warning', 'Frequent frame time spikes (stutter)',
          `In ${gaming.stutter.count} of ${gaming.stutter.activeCount} active samples (${fmtPct(frac)}), the average frame time ran past ${gaming.stutter.thresholdMs.toFixed(0)}ms — well above the session's typical ${gaming.stutter.medianMs.toFixed(1)}ms. Worst sample: ${gaming.stutter.worstMs.toFixed(0)}ms.`,
          'Frame-time spikes like this are usually invisible in an average FPS number but very visible to a player. Common causes: background apps or overlays (Discord, browser, RGB software), an unstable memory overclock, CPU or GPU thermal throttling (check the Thermals tab for the same time window), an outdated GPU driver, or shader-compilation stutter in that specific game.', km.frame_time_avg, 'GPU');
      }
    }
    if (gaming.isGame && gaming.pacing && gaming.pacing.gapPct > 0.15) {
      add('frame_pacing_drop', 'warning', 'Frames dropped between render and display', `Displayed framerate (${gaming.pacing.displayedAvg.toFixed(0)} FPS) is ${fmtPct(gaming.pacing.gapPct)} lower than what was rendered (${gaming.pacing.presentedAvg.toFixed(0)} FPS).`,
        'A gap this size between "presented" and "displayed" frames usually means frames are being dropped or repeated by the display pipeline rather than a raw rendering shortfall. Check that V-Sync/G-Sync/FreeSync settings match between the game, driver, and monitor, close capture/overlay software, and make sure the game is running at (or below) your monitor\'s refresh rate.', null, 'GPU');
    }
  }

  issues.sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity]);
  return issues;
}
