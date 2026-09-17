// ===================== MEMORY: EXPO/XMP-vs-JEDEC misconfiguration check =====================
// Common DDR4/DDR5 rated transfer speeds (MT/s) — used to recognize a speed number
// embedded in a module's marketing part number.
const KNOWN_MEM_SPEEDS = [2133, 2400, 2666, 2933, 3000, 3200, 3466, 3600, 3733, 4000, 4266, 4400,
  4800, 5200, 5600, 5800, 6000, 6200, 6400, 6600, 6800, 7000, 7200, 7600, 8000, 8200, 8400, 8800];

// Module part numbers encode rated speed (and often CAS latency) inconsistently across
// vendors, so this is a best-effort read of the label HWiNFO reports, not authoritative
// spec data — always presented as "inferred from the module name" in the UI.
function parseRatedMemoryFromLabel(label) {
  if (!label) return null;
  // Vendor patterns that pair a speed with a CAS code, e.g. "...6000Z30", "...3600C18",
  // "...6400C32", G.Skill-style "...6000J3038..." (first two digits after J/letter = CAS).
  const paired = label.match(/(\d{4,5})[A-Z](\d{2})/);
  let ratedSpeed = null, ratedCAS = null;
  if (paired && KNOWN_MEM_SPEEDS.includes(Number(paired[1]))) {
    ratedSpeed = Number(paired[1]);
    ratedCAS = Number(paired[2]);
  } else {
    // fall back to any 4-digit run matching a known speed bin, ignoring capacity-looking
    // numbers (a "64GB" or "32GB" nearby) by requiring the match not be directly preceded
    // by "GX" capacity/generation markers is impractical in general — just take the first hit.
    const nums = label.match(/\d{4,5}/g) || [];
    for (const n of nums) { if (KNOWN_MEM_SPEEDS.includes(Number(n))) { ratedSpeed = Number(n); break; } }
  }
  if (!ratedSpeed) return null;
  return { ratedSpeed, ratedCAS, sourceLabel: label };
}

function checkMemoryConfig(file) {
  const memClock = file.columns.find(c => /^Memory Clock \[/i.test(c.name) && c.isNumeric && c.stats);
  if (!memClock) return null;
  const tcas = file.columns.find(c => /^Tcas \[/i.test(c.name) && c.isNumeric && c.stats);
  const observedSpeed = Math.round((memClock.stats.max * 2) / 100) * 100; // effective MT/s, rounded to nearest 100
  const observedCAS = tcas ? Math.round(tcas.stats.max) : null;

  const ramLabels = (file.systemInfo && file.systemInfo.ram) || [];
  let rated = null;
  for (const label of ramLabels) { rated = parseRatedMemoryFromLabel(label); if (rated) break; }

  let mismatch = false, gapPct = null;
  if (rated) {
    gapPct = (rated.ratedSpeed - observedSpeed) / rated.ratedSpeed;
    if (gapPct > 0.08) mismatch = true;
  }
  return { observedSpeed, observedCAS, rated, mismatch, gapPct };
}
