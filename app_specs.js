// ===================== HARDWARE SPECS: model-aware thresholds =====================
// Approximate stock/reference specs for common current desktop CPUs/GPUs. Used to swap
// generic one-size-fits-all thermal/power thresholds for model-aware ones when the model
// can be identified from the log's hardware descriptor row (e.g. a 95C Tjmax cap on most
// Ryzen desktop parts vs. 100C on Intel — judging both against the same number is wrong
// in both directions). These are typical *factory-default* figures — real systems vary by
// motherboard vendor (many boards raise CPU power limits above AMD/Intel's own stock spec
// by default) and by AIB card, so they're always presented in the UI as approximate context
// rather than a hard pass/fail line, and unmatched hardware falls back to the generic
// thresholds untouched.
const CPU_SPECS = [
  { match: /9950X3D/i, name: 'Ryzen 9 9950X3D', pptW: 230, tjMaxC: 95 },
  { match: /9900X3D/i, name: 'Ryzen 9 9900X3D', pptW: 162, tjMaxC: 95 },
  { match: /9800X3D/i, name: 'Ryzen 7 9800X3D', pptW: 162, tjMaxC: 95 },
  { match: /9950X(?!3D)/i, name: 'Ryzen 9 9950X', pptW: 230, tjMaxC: 95 },
  { match: /9700X/i, name: 'Ryzen 7 9700X', pptW: 142, tjMaxC: 95, note: 'AMD\'s own spec is a 65W/88W PPT part, but most motherboards default to a 105W "performance mode" (142W PPT) instead — so higher power draw here is usually the board, not a problem.' },
  { match: /7950X3D/i, name: 'Ryzen 9 7950X3D', pptW: 162, tjMaxC: 89 },
  { match: /7800X3D/i, name: 'Ryzen 7 7800X3D', pptW: 162, tjMaxC: 89 },
  { match: /7950X(?!3D)/i, name: 'Ryzen 9 7950X', pptW: 230, tjMaxC: 95 },
  { match: /7600X/i, name: 'Ryzen 5 7600X', pptW: 142, tjMaxC: 95 },
  { match: /14900K/i, name: 'Core i9-14900K', pptW: 253, tjMaxC: 100 },
  { match: /14700K/i, name: 'Core i7-14700K', pptW: 253, tjMaxC: 100 },
  { match: /14600K/i, name: 'Core i5-14600K', pptW: 181, tjMaxC: 100 },
  { match: /Ultra 9 285K/i, name: 'Core Ultra 9 285K', pptW: 250, tjMaxC: 100 },
  { match: /Ultra 7 265K/i, name: 'Core Ultra 7 265K', pptW: 250, tjMaxC: 100 },
];

// Hot-spot level used when a card has no documented hot-spot throttle point of its own.
// Shared by the rule engine and the headroom panel so the two never disagree.
const DEFAULT_GPU_HOTSPOT_LIMIT_C = 100;

// Shown only when a log for one of the `mayHideHotspot` cards has no hot-spot column —
// some driver/HWiNFO combinations report one for Blackwell and some don't, so this
// can't be stated unconditionally.
const MISSING_HOTSPOT_NOTE = 'No GPU hot-spot sensor was found in this log. Blackwell (RTX 50-series) cards don\'t expose one on some driver/HWiNFO versions, so only core/edge temperature is available here.';

const GPU_SPECS = [
  { match: /RTX 5090/i, name: 'GeForce RTX 5090', tbpW: 575, coreThrottleC: 90, mayHideHotspot: true },
  { match: /RTX 5080/i, name: 'GeForce RTX 5080', tbpW: 360, coreThrottleC: 90, mayHideHotspot: true },
  { match: /RTX 5070 Ti/i, name: 'GeForce RTX 5070 Ti', tbpW: 300, coreThrottleC: 90, mayHideHotspot: true },
  { match: /RTX 5070(?! Ti)/i, name: 'GeForce RTX 5070', tbpW: 250, coreThrottleC: 90, mayHideHotspot: true },
  { match: /RTX 4090/i, name: 'GeForce RTX 4090', tbpW: 450, coreThrottleC: 90, hotspotThrottleC: 105 },
  { match: /RTX 4080/i, name: 'GeForce RTX 4080', tbpW: 320, coreThrottleC: 90, hotspotThrottleC: 105 },
  { match: /RTX 4070 Ti/i, name: 'GeForce RTX 4070 Ti', tbpW: 285, coreThrottleC: 90, hotspotThrottleC: 105 },
  { match: /RTX 4070(?! Ti)/i, name: 'GeForce RTX 4070', tbpW: 220, coreThrottleC: 90, hotspotThrottleC: 105 },
  { match: /RX 9070 XT/i, name: 'Radeon RX 9070 XT', tbpW: 304, coreThrottleC: 110, note: 'AMD documents junction/hot-spot temperatures up to ~110°C as normal for this card — noticeably higher than Nvidia\'s norms, so it shouldn\'t be judged by Nvidia-style thresholds.' },
  { match: /RX 9070(?! XT)/i, name: 'Radeon RX 9070', tbpW: 220, coreThrottleC: 110, note: 'AMD documents junction/hot-spot temperatures up to ~110°C as normal for this card — noticeably higher than Nvidia\'s norms, so it shouldn\'t be judged by Nvidia-style thresholds.' },
  { match: /RX 7900 XTX/i, name: 'Radeon RX 7900 XTX', tbpW: 355, coreThrottleC: 110, note: 'AMD documents junction/hot-spot temperatures up to ~110°C as normal for this card — noticeably higher than Nvidia\'s norms, so it shouldn\'t be judged by Nvidia-style thresholds.' },
  { match: /RX 7900 XT(?!X)/i, name: 'Radeon RX 7900 XT', tbpW: 315, coreThrottleC: 110, note: 'AMD documents junction/hot-spot temperatures up to ~110°C as normal for this card — noticeably higher than Nvidia\'s norms, so it shouldn\'t be judged by Nvidia-style thresholds.' },
  { match: /RX 7800 XT/i, name: 'Radeon RX 7800 XT', tbpW: 263, coreThrottleC: 110, note: 'AMD documents junction/hot-spot temperatures up to ~110°C as normal for this card — noticeably higher than Nvidia\'s norms, so it shouldn\'t be judged by Nvidia-style thresholds.' },
];

function matchCpuSpec(cpuLabel) {
  if (!cpuLabel) return null;
  for (const spec of CPU_SPECS) if (spec.match.test(cpuLabel)) return spec;
  return null;
}
function matchGpuSpec(gpuLabels) {
  if (!gpuLabels || !gpuLabels.length) return null;
  for (const label of gpuLabels) for (const spec of GPU_SPECS) if (spec.match.test(label)) return spec;
  return null;
}

// Convenience bundle used by both the rule engine and the UI so the two never disagree
// about which spec matched a given file.
function getHardwareSpecs(file) {
  const sys = file.systemInfo || {};
  return { cpuSpec: matchCpuSpec(sys.cpu), gpuSpec: matchGpuSpec(sys.gpus) };
}

// Context note to show alongside a GPU spec for this particular log (or null).
function gpuSpecNoteFor(gpuSpec, hasHotspotSensor) {
  if (!gpuSpec) return null;
  if (gpuSpec.mayHideHotspot && !hasHotspotSensor) return MISSING_HOTSPOT_NOTE;
  return gpuSpec.note || null;
}
