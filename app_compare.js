// ===================== COMPARE: multi-file ordering, deltas, aggregated issues =====================
const METRIC_DIRECTION = {
  cpu_temp: 'lower', vrm_temp: 'lower', gpu_vrm_temp: 'lower', gpu_temp: 'lower', gpu_hotspot: 'lower',
  gpu_mem_temp: 'lower', motherboard_temp: 'lower', ram_load: 'lower', pagefile_use: 'lower',
  cpu_power: 'neutral', gpu_power: 'neutral', vcore: 'neutral',
  cpu_usage: 'neutral', cpu_clock: 'neutral', gpu_util: 'neutral', gpu_clock: 'neutral',
  fps_avg: 'higher', fps_1low: 'higher', dram_read_bw: 'neutral', dram_write_bw: 'neutral',
  fps_displayed_avg: 'higher', fps_displayed_1low: 'higher',
  frame_time_avg: 'lower', gpu_busy: 'lower', gpu_wait: 'lower', cpu_busy: 'lower', cpu_wait: 'lower',
};

// Builds a lightweight view of `file` restricted to an elapsed-time window (ms from the
// file's own start) — used only by Compare Logs' optional "gameplay only" trim, so a
// before/after comparison can skip the setup/menu time around an actual play session.
// Every numeric/boolean column's stats, series, and boolStats are recomputed from just
// the rows inside the window (reusing the exact same computeStats() the initial parse
// uses, so the numbers are on equal footing); everything else — column identity,
// systemInfo, file id/color/label — is carried over unchanged since it doesn't depend
// on time. Downstream code (resolveKeyMetrics, detectIssues, gamingSummary, etc.) reads
// this the same way it reads a normal parsed file and needs no awareness of trimming.
function buildTrimmedFileView(file, startMs, endMs) {
  if (!file.startTime || endMs <= startMs) return file;
  const t0 = file.startTime.getTime();
  const rowIdx = [];
  for (let r = 0; r < file.nRows; r++) {
    const t = file.timestamps[r];
    if (!t) continue;
    const e = t.getTime() - t0;
    if (e >= startMs && e <= endMs) rowIdx.push(r);
  }
  if (rowIdx.length < 2) return file; // window too narrow to be useful — fall back untrimmed

  const timestamps = rowIdx.map(r => file.timestamps[r]);
  const columns = file.columns.map(col => {
    if (col.isNumeric && col.series) {
      const series = rowIdx.map(r => col.series[r]);
      const nums = series.filter(v => v != null);
      return Object.assign({}, col, { series, numData: nums, stats: computeStats(nums) });
    }
    if (col.isBoolean && col.boolSeries) {
      const boolSeries = rowIdx.map(r => col.boolSeries[r]);
      let trueCount = 0, total = 0;
      for (const b of boolSeries) { if (b == null) continue; total++; if (b) trueCount++; }
      return Object.assign({}, col, { boolSeries, boolStats: { trueCount, total, trueFraction: total ? trueCount / total : 0 } });
    }
    return col;
  });

  return Object.assign({}, file, {
    columns, timestamps, nRows: rowIdx.length,
    startTime: timestamps[0], endTime: timestamps[timestamps.length - 1],
    durationMs: timestamps[timestamps.length - 1].getTime() - timestamps[0].getTime(),
    _trimmed: true, _sourceDurationMs: file.durationMs,
  });
}

function orderFilesByPriority(files) {
  return files.slice().sort((a, b) => {
    const at = a.endTime ? a.endTime.getTime() : (a.lastModified || 0);
    const bt = b.endTime ? b.endTime.getTime() : (b.lastModified || 0);
    return bt - at;
  });
}

// Shared delta math: given an "older" and a "newer" per-file stat bundle for one metric,
// returns the raw/percent change and whether that change counts as better/worse/neutral
// for this metric (a metric with no defined direction — e.g. clock speed — is always
// reported as a neutral fact, never colored good/bad).
function computeMetricDelta(olderP, newerP, direction) {
  if (!olderP || !newerP) return null;
  const diff = newerP.avg - olderP.avg;
  const pct = olderP.avg !== 0 ? (diff / Math.abs(olderP.avg)) * 100 : null;
  let verdict = 'neutral';
  if (direction !== 'neutral' && Math.abs(pct || 0) > 2) {
    const improved = direction === 'lower' ? diff < 0 : diff > 0;
    verdict = improved ? 'better' : 'worse';
  }
  return { diff, pct, verdict };
}

function buildComparison(orderedFiles) {
  const rows = [];
  for (const m of KEY_METRICS) {
    const perFile = orderedFiles.map(f => {
      const col = resolveKeyMetrics(f)[m.id];
      return col ? { file: f.fileName, avg: col.stats.avg, max: col.stats.max, min: col.stats.min, last: col.stats.last, col } : null;
    });
    if (perFile.every(p => p === null)) continue;
    const direction = METRIC_DIRECTION[m.id] || 'neutral';

    // One delta per consecutive pair in the order the caller gave us — when that order
    // is chronological (oldest -> newest), this is a left-to-right trend arrow per hop.
    const deltas = [];
    for (let i = 1; i < perFile.length; i++) deltas.push(computeMetricDelta(perFile[i - 1], perFile[i], direction));

    // Backward-compatible single "headline" delta. Callers that only want a two-file
    // newest-vs-previous summary (e.g. the plain-text report) pass files newest-first,
    // so index 0 is newer than index 1 here regardless of what order the Compare view uses.
    const delta = orderedFiles.length >= 2 ? computeMetricDelta(perFile[1], perFile[0], direction) : null;

    rows.push({ id: m.id, label: m.label, unit: m.unit, group: m.group, direction, perFile, delta, deltas });
  }
  return rows;
}

// "Best overall run" — a composite score across three competing goals (thermals,
// power, performance), used to put a star on whichever loaded log came out on top,
// and to show a breakdown of *why* so a tradeoff (e.g. "a lot more FPS for a little
// more heat") reads as the net win it actually was.
//
// Each named profile is just a different weighting between the three categories —
// none is "correct", they're starting points for what the person is optimizing for
// (a quiet/cool build vs. chasing frames). The person can switch profiles live in
// the Compare Logs view; STATE.scoreProfile tracks the current choice.
const SCORING_PROFILES = {
  balanced: { label: 'Balanced', thermals: 0.35, power: 0.25, performance: 0.40 },
  cooler: { label: 'Cooler & quieter', thermals: 0.40, power: 0.30, performance: 0.30 },
  performance: { label: 'Performance', thermals: 0.20, power: 0.20, performance: 0.60 },
};

const SCORE_CATEGORIES = {
  thermals: [
    { id: 'cpu_temp', field: 'max', direction: 'lower' },
    { id: 'gpu_temp', field: 'max', direction: 'lower' },
    { id: 'gpu_hotspot', field: 'max', direction: 'lower' },
  ],
  power: [
    { id: 'cpu_power', field: 'avg', direction: 'lower' },
    { id: 'gpu_power', field: 'avg', direction: 'lower' },
  ],
  performance: [
    { id: 'fps_avg', field: 'avg', direction: 'higher' },
    { id: 'fps_1low', field: 'avg', direction: 'higher' },
  ],
};

// The categories deliberately don't all score off the same statistic: Thermals uses
// each run's session PEAK (max) temperature, because what actually risks throttling
// or an emergency shutdown is the worst moment, not the average — a run that spent
// most of its time cool but spiked once is still a run that spiked. Power and
// Performance score off session AVERAGES instead. This is a reasonable design choice,
// but it means the Run Verdict's Thermals score can disagree with the (always-average)
// numbers in the Metric deltas table — a run with a lower average temp can still lose
// on Thermals if it had a higher peak somewhere. These two helpers make that basis
// visible in the UI instead of leaving people to reverse-engineer it, and a longer run
// has strictly more opportunity to contain a brief spike than a shorter one, which is
// exactly the kind of run-length mismatch the "tips" panel warns about.
function categoryScoreBasis(cat) {
  const metrics = SCORE_CATEGORIES[cat] || [];
  const fields = new Set(metrics.map(m => m.field));
  if (fields.size !== 1) return 'mixed';
  const f = [...fields][0];
  return f === 'max' ? 'peak' : f === 'min' ? 'best-case' : 'avg';
}
function categoryScoreTooltip(cat) {
  const metrics = SCORE_CATEGORIES[cat] || [];
  const basis = categoryScoreBasis(cat);
  const basisPhrase = basis === 'peak' ? "each run's peak (max)" : basis === 'best-case' ? "each run's best-case (min)" : "each run's session average";
  const names = metrics.map(m => {
    const km = (typeof KEY_METRICS !== 'undefined') ? KEY_METRICS.find(k => k.id === m.id) : null;
    return km ? km.label : m.id;
  });
  if (cat === 'performance') names.push('frame-pacing / stutter rate');
  return `Based on ${basisPhrase} of: ${names.join(', ')}.`;
}

// Min-max normalizes one metric's values across the loaded runs to 0 (best of the
// set) .. 1 (worst of the set). Unlike a plain rank, this preserves how big the gaps
// actually were: a metric that barely moves across runs ends up with everyone
// clustered near the same normalized value and barely swings the score, while a
// metric with a wide spread swings it a lot — which is exactly what "a lot more FPS
// for a little more heat" needs in order to net out as a clear win.
//
// With 3+ runs this falls out naturally: min-max is a rank-preserving stretch across
// the whole set, so a tightly clustered metric already normalizes to values that stay
// near each other. But with exactly 2 runs, min-max degenerates — whichever value is
// smaller IS the minimum and whichever is larger IS the maximum, by definition, no
// matter how close together they actually are. A 152.0-vs-152.1 FPS "tie" and a
// 100-vs-152 FPS blowout would both collapse to the same hard 0/1 split, which is
// exactly backwards. So for the 2-run case, score off the actual relative % difference
// between the two values instead: a near-tie lands near 0.5/0.5, and the split only
// approaches the full 0/1 once the gap is big enough to call decisive.
const TWO_RUN_DECISIVE_PCT = 0.05; // relative % difference at/above which a 2-run comparison scores as a full 0/1 split
function twoRunNormalize(present, direction) {
  const out = new Map();
  const [a, b] = present;
  if (a.value === b.value) { out.set(a.id, 0.5); out.set(b.id, 0.5); return out; }
  const aIsBetter = direction === 'lower' ? a.value < b.value : a.value > b.value;
  const winner = aIsBetter ? a : b;
  const loser = aIsBetter ? b : a;
  const avgMag = Math.abs(a.value + b.value) / 2 || 1;
  const relDiff = Math.abs(a.value - b.value) / avgMag;
  const t = Math.min(1, relDiff / TWO_RUN_DECISIVE_PCT); // 0 = indistinguishable, 1 = fully decisive
  out.set(winner.id, 0.5 - 0.5 * t);
  out.set(loser.id, 0.5 + 0.5 * t);
  return out;
}
function minMaxNormalize(entries, direction) {
  const present = entries.filter(e => e.value != null && !Number.isNaN(e.value));
  const out = new Map();
  if (present.length < 2) return out;
  if (present.length === 2) return twoRunNormalize(present, direction);
  const values = present.map(e => e.value);
  const lo = Math.min(...values), hi = Math.max(...values);
  const span = hi - lo;
  for (const e of present) {
    if (span === 0) { out.set(e.id, 0); continue; }
    const frac = (e.value - lo) / span;
    out.set(e.id, direction === 'lower' ? frac : 1 - frac);
  }
  return out;
}

// Computes a 0-100 composite score per file (100 = best of the loaded runs), plus a
// per-category (thermals/power/performance) breakdown, using the given scoring
// profile. Categories with no usable sensor data across the loaded logs are dropped
// and the remaining weights renormalized, so e.g. a log with no power sensors doesn't
// get skewed by a missing category.
function computeCompositeScores(files, profileKey) {
  if (!files || files.length < 2) return null;
  const profile = SCORING_PROFILES[profileKey] || SCORING_PROFILES.balanced;
  const categoryScores = {};
  const categoryHasData = {};

  for (const [cat, metrics] of Object.entries(SCORE_CATEGORIES)) {
    const totals = new Map(files.map(f => [f.id, { sum: 0, count: 0 }]));
    for (const def of metrics) {
      const entries = files.map(f => {
        const col = resolveKeyMetrics(f)[def.id];
        return { id: f.id, value: col && col.stats ? col.stats[def.field] : null };
      });
      for (const [id, val] of minMaxNormalize(entries, def.direction).entries()) {
        const t = totals.get(id); t.sum += val; t.count++;
      }
    }
    // Frame-pacing smoothness (stutter rate) folds into "performance" alongside FPS,
    // sourced from the same gaming analysis shown on the Gaming tab.
    if (cat === 'performance' && typeof gamingSummary === 'function') {
      const entries = files.map(f => {
        const gs = gamingSummary(f);
        const rate = gs && gs.stutter && gs.stutter.activeCount >= 20 ? gs.stutter.count / gs.stutter.activeCount : null;
        return { id: f.id, value: rate };
      });
      for (const [id, val] of minMaxNormalize(entries, 'lower').entries()) {
        const t = totals.get(id); t.sum += val; t.count++;
      }
    }
    const scores = new Map();
    let any = false;
    for (const f of files) {
      const t = totals.get(f.id);
      if (t.count > 0) { scores.set(f.id, t.sum / t.count); any = true; }
    }
    categoryScores[cat] = scores;
    categoryHasData[cat] = any;
  }

  const activeCats = Object.keys(SCORE_CATEGORIES).filter(c => categoryHasData[c]);
  if (!activeCats.length) return null;
  const weightSum = activeCats.reduce((s, c) => s + profile[c], 0) || 1;

  const perFile = files.map(f => {
    const breakdown = {};
    let composite = 0;
    for (const c of activeCats) {
      const raw = categoryScores[c].has(f.id) ? categoryScores[c].get(f.id) : null; // 0 = best, 1 = worst
      breakdown[c] = raw == null ? null : Math.round((1 - raw) * 100);
      if (raw != null) composite += (profile[c] / weightSum) * raw;
    }
    return { id: f.id, fileName: f.fileName, composite: Math.round((1 - composite) * 100), breakdown };
  });
  perFile.sort((a, b) => b.composite - a.composite);
  return { profile: profileKey, categories: activeCats, perFile, bestId: perFile[0] ? perFile[0].id : null };
}

// Backward-compatible wrapper for the older single-"best file" call sites (topbar
// chip, Summary table) — same composite scoring underneath, just the winner's id.
function computeHolisticRanking(files, profileKey) {
  const result = computeCompositeScores(files, profileKey);
  return result && result.bestId ? { id: result.bestId } : null;
}

function topIssuesAcrossFiles(orderedFiles) {
  const perFileIssues = orderedFiles.map(f => ({ file: f, issues: detectIssues(f) }));
  const byKey = new Map();
  orderedFiles.forEach((f, fileIdx) => {
    for (const issue of perFileIssues[fileIdx].issues) {
      const key = issue.id.replace(/_\d+$/, '');
      if (!byKey.has(key)) byKey.set(key, []);
      byKey.get(key).push(Object.assign({}, issue, { fileIdx, fileName: f.fileName }));
    }
  });
  const merged = [];
  for (const [key, occurrences] of byKey.entries()) {
    occurrences.sort((a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity] || a.fileIdx - b.fileIdx);
    const worst = occurrences[0];
    const fileCount = new Set(occurrences.map(o => o.fileIdx)).size;
    const inNewest = occurrences.some(o => o.fileIdx === 0);
    const score = SEVERITY_RANK[worst.severity] * 1000 + fileCount * 50 + (inNewest ? 25 : 0);
    merged.push({ key, severity: worst.severity, title: worst.title, detail: worst.detail, suggestion: worst.suggestion, category: worst.category, occurrences, fileCount, totalFiles: orderedFiles.length, inNewest, score });
  }
  merged.sort((a, b) => b.score - a.score);
  return { top: merged.slice(0, 5), all: merged, perFileIssues };
}
