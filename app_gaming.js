// ===================== GAMING: bottleneck, stutter, frame pacing, capture-target detection =====================
// System/shell processes HWiNFO's PresentMon commonly attaches to when no game is in
// the foreground — seeing one of these means the frame data below is desktop
// compositor activity, not gameplay.
const NON_GAME_PROCESSES = new Set([
  'dwm.exe', 'explorer.exe', 'shellexperiencehost.exe', 'searchhost.exe', 'searchapp.exe',
  'applicationframehost.exe', 'lockapp.exe', 'startmenuexperiencehost.exe', 'textinputhost.exe',
  'systemsettings.exe', 'widgets.exe', 'gamebar.exe', 'gamebarftserver.exe',
]);

function getPresentMonProcess(file) {
  for (const col of file.columns) {
    const m = /^PresentMon \[(.+?)\]$/i.exec(col.hwLabel || '');
    if (m) return m[1];
  }
  return null;
}
function isNonGameProcess(procName) { return !!procName && NON_GAME_PROCESSES.has(procName.toLowerCase()); }

// Each HWiNFO row is one polling interval, and its PresentMon columns are averages over
// every frame rendered in that interval — so a row is a *sample*, not a frame. Everything
// below works per sample. Only samples whose average frame time is under this cap count
// as "active" gameplay — excludes idle desktop stalls where nothing is being rendered.
const ACTIVE_FRAME_TIME_CAP_MS = 100; // ~10 FPS floor

// Above this polling interval a single hitch is averaged in with hundreds of normal
// frames and can't show up as a spike, so stutter detection is skipped rather than
// reporting a misleadingly clean (or noisy) result.
const STUTTER_MAX_SAMPLE_INTERVAL_MS = 2000;
function stutterTooCoarse(file) { return file.sampleIntervalMs != null && file.sampleIntervalMs > STUTTER_MAX_SAMPLE_INTERVAL_MS; }

function activeFrameIndices(file) {
  const km = resolveKeyMetrics(file);
  const ft = km.frame_time_avg;
  if (!ft || !ft.series) return null;
  const idx = [];
  for (let r = 0; r < file.nRows; r++) { const v = ft.series[r]; if (v != null && v > 0 && v < ACTIVE_FRAME_TIME_CAP_MS) idx.push(r); }
  return { ft, idx };
}

// Compares average GPU Busy vs CPU Busy time (both derived from the same PresentMon
// capture) across active samples: whichever is closer to the full frame time is treated
// as that sample's bottleneck. This is a simplified heuristic, not a cycle-accurate
// profiler result, and is presented as such in the UI.
function computeBottleneck(file) {
  const active = activeFrameIndices(file);
  if (!active) return null;
  const km = resolveKeyMetrics(file);
  const gpuBusy = km.gpu_busy, cpuBusy = km.cpu_busy;
  if (!gpuBusy || !cpuBusy || !gpuBusy.series || !cpuBusy.series) return null;
  let gpuBound = 0, cpuBound = 0, counted = 0;
  for (const r of active.idx) {
    const g = gpuBusy.series[r], c = cpuBusy.series[r];
    if (g == null || c == null) continue;
    counted++;
    if (g >= c) gpuBound++; else cpuBound++;
  }
  if (counted < 20) return null; // not enough active-frame data to say anything meaningful
  return { gpuBoundPct: gpuBound / counted, cpuBoundPct: cpuBound / counted, sampleCount: counted };
}

// Flags samples whose average frame time is far above the session's own typical value.
// Returns null when the log's polling interval is too coarse for this to mean anything.
function detectStutters(file) {
  if (stutterTooCoarse(file)) return null;
  const active = activeFrameIndices(file);
  if (!active || active.idx.length < 20) return null;
  const vals = active.idx.map(r => active.ft.series[r]).sort((a, b) => a - b);
  const median = vals[Math.floor(vals.length / 2)];
  const threshold = Math.max(median * 2, median + 8);
  let count = 0, worst = 0, worstR = null;
  for (const r of active.idx) {
    const v = active.ft.series[r];
    if (v > threshold) { count++; if (v > worst) { worst = v; worstR = r; } }
  }
  const worstElapsedMs = worstR != null && file.startTime ? (file.timestamps[worstR].getTime() - file.startTime.getTime()) : null;
  return { count, medianMs: median, thresholdMs: threshold, worstMs: worst, worstElapsedMs, activeCount: active.idx.length };
}

// A large gap between "Presented" and "Displayed" framerate/1%-low means frames the
// game rendered were dropped or repeated before actually reaching the screen.
function framePacingCheck(file) {
  const km = resolveKeyMetrics(file);
  const pAvg = km.fps_avg, dAvg = km.fps_displayed_avg;
  if (!pAvg || !dAvg || pAvg.stats.avg <= 0) return null;
  const gapPct = (pAvg.stats.avg - dAvg.stats.avg) / pAvg.stats.avg;
  return { presentedAvg: pAvg.stats.avg, displayedAvg: dAvg.stats.avg, gapPct };
}

// Best-guess span of "actually playing the game" within a log, as elapsed ms from the
// file's own start — the gap between clicking "Start Logging" and the game actually
// being in the foreground (menus, alt-tabbing, a loading screen) shouldn't count
// against a before/after comparison. Reuses the same active-frame definition as the
// bottleneck/stutter analysis: first to last row where frame rendering looks real.
// Returns null when there isn't enough frame data to say anything (e.g. a non-gaming
// log, or PresentMon wasn't enabled) — Compare Logs falls back to the full log then.
function detectGameplayWindow(file) {
  const active = activeFrameIndices(file);
  if (!active || active.idx.length < 20 || !file.startTime) return null;
  const first = active.idx[0], last = active.idx[active.idx.length - 1];
  const t0 = file.startTime.getTime();
  const startMs = file.timestamps[first].getTime() - t0;
  const endMs = file.timestamps[last].getTime() - t0;
  if (endMs - startMs < 5000) return null; // too narrow to be a meaningful window
  return { startMs, endMs, activeCount: active.idx.length, totalRows: file.nRows };
}

function gamingSummary(file) {
  const proc = getPresentMonProcess(file);
  return {
    process: proc,
    isGame: proc ? !isNonGameProcess(proc) : null,
    bottleneck: computeBottleneck(file),
    stutter: detectStutters(file),
    sampleIntervalMs: file.sampleIntervalMs,
    stutterTooCoarse: stutterTooCoarse(file),
    pacing: framePacingCheck(file),
  };
}
