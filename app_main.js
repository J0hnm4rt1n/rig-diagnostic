// ===================== APP: state, rendering, wiring =====================
const ICONS = {
  grid: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
  thermo: '<path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/>',
  bolt: '<path d="M13 2 3 14h7l-1 8 10-12h-7z"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  disk: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20M7 15h.01M11 15h4"/>',
  wifi: '<path d="M5 13a10 10 0 0114 0M8.5 16.5a5 5 0 017 0M12 20h.01"/>',
  compare: '<path d="M6 3v14M6 17l-3-3M6 17l3-3M18 21V7M18 7l3 3M18 7l-3 3"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 4v16"/>',
  upload: '<path d="M12 16V4M6 10l6-6 6 6M4 20h16"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  alert: '<path d="M12 9v4M12 17h.01M10.3 3.86 1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L14.7 3.86a2 2 0 00-3.4 0z"/>',
  chevronUp: '<path d="M18 15l-6-6-6 6"/>',
  chevronDown: '<path d="M6 9l6 6 6-6"/>',
  file: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
  gpu: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M14 10h4M14 14h4"/>',
  ram: '<rect x="3" y="9" width="18" height="7" rx="1"/><path d="M7 9V6M11 9V6M15 9V6M19 9V6"/>',
  mobo: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.6"/><path d="M13 7h5M13 11h5M6 14h4v4H6z"/>',
  network: '<path d="M12 2v6M6 20h12M9 8h6l3 6H6l3-6zM9 20v-6M15 20v-6"/>',
  gamepad: '<rect x="2" y="7" width="20" height="11" rx="4"/><path d="M7 10v4M5 12h4"/><circle cx="16" cy="10.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="18.5" cy="13" r="1.1" fill="currentColor" stroke="none"/>',
  tag: '<path d="M20.6 12.6 12.7 20.5a2 2 0 01-2.8 0l-7.4-7.4a2 2 0 010-2.8L10.3 2.4a2 2 0 011.4-.6h6.9a2 2 0 012 2v6.9a2 2 0 01-.6 1.4z"/><circle cx="15.5" cy="8.5" r="1"/>',
  clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>',
  pencil: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
  scale: '<path d="M12 3v18M8 21h8M5 7l-3 6a3 3 0 006 0zM19 7l-3 6a3 3 0 006 0zM3 7h6M15 7h6M12 3l-4 4h8z"/>',
  star: '<path d="M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2Z" fill="currentColor" stroke="none"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>',
  sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>',
  moon: '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  github: '<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.5 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 015 0c1.9-1.33 2.74-1.05 2.74-1.05.56 1.41.21 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.5A10.03 10.03 0 0022 12.26C22 6.58 17.52 2 12 2z" fill="currentColor" stroke="none"/>',
  coffee: '<path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><path d="M6 1v3M10 1v3M14 1v3"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>',
  lightbulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 00-4 12.6c.6.5 1 1.3 1 2.4h6c0-1.1.4-1.9 1-2.4A7 7 0 0012 2z"/>',
  crop: '<path d="M6.13 1v13a2 2 0 002 2H21"/><path d="M1 6.13h13a2 2 0 012 2V21"/>',
};
function icon(name, extra) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra || ''}>${ICONS[name] || ''}</svg>`;
}

const SECTIONS = [
  { id: 'summary', label: 'Summary', icon: 'grid' },
  { id: 'thermals', label: 'Thermals', icon: 'thermo' },
  { id: 'power', label: 'Power & Voltage', icon: 'bolt' },
  { id: 'perf', label: 'Performance', icon: 'activity' },
  { id: 'gaming', label: 'Gaming', icon: 'gamepad' },
  { id: 'memory', label: 'Memory & Storage', icon: 'disk' },
  { id: 'network', label: 'Network & PCIe', icon: 'wifi' },
  { id: 'compare', label: 'Compare Logs', icon: 'compare' },
  { id: 'report', label: 'Report', icon: 'clipboard' },
  { id: 'raw', label: 'Raw Data', icon: 'table' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
];
const FILE_COLORS = ['var(--file-1)', 'var(--file-2)', 'var(--file-3)', 'var(--file-4)'];

// Edit these to point at your own repo / support link before publishing your fork.
const PROJECT_LINKS = {
  github: 'https://github.com/YOUR-USERNAME/rig-diagnostic',
  coffee: 'https://buymeacoffee.com/YOUR-USERNAME',
  version: '1.0.0-beta',
};

// Testing methodology tips — not derived from a log, just hard-won advice for getting
// a comparison you can actually trust. Shared between the Settings page (full list) and
// a compact panel on Compare Logs, so the two never drift out of sync.
const TESTING_TIPS = [
  { title: 'Match your environment', detail: 'Test at a similar time of day and room temperature, and note things like AC, open windows, or the season. Ambient swings alone can shift CPU/GPU temps by several degrees between two otherwise "identical" runs.' },
  { title: 'Change one thing at a time', detail: "If you're testing a new fan curve, don't also update GPU drivers or tweak BIOS settings in the same pass — otherwise you won't know which change actually caused the difference you see." },
  { title: 'Same workload, same length', detail: 'Use the same benchmark, save file, or game section each time, for a similar duration. A different map, area, or run length changes the numbers on its own, independent of any hardware or setting change.' },
  { title: 'Let it warm up first', detail: "Start logging a couple of minutes into the load, not from a cold boot. Comparing a cold run to a warmed-up run makes a real change look bigger (or smaller) than it actually is." },
  { title: 'Games are especially noisy', detail: "Procedurally generated or multiplayer maps, bots vs. real players, and per-match AI/physics load all vary run to run, even in \"the same\" game. Prefer a fixed benchmark mode or a scripted offline route when one exists, and treat FPS deltas from live multiplayer matches as a rough signal, not a precise measurement." },
  { title: 'Keep software state consistent', detail: 'Same Windows power plan, same GPU driver version, and the same background apps (Discord, browser tabs, overlays, Windows Update) running — or closed — the same way across every run you compare.' },
  { title: 'Label your logs', detail: 'Use the filename or the in-app label (e.g. "before-fan-curve", "after-fan-curve") to note what changed, so it is still obvious which log is which when you come back to compare weeks later.' },
  { title: 'Trim out the setup time', detail: 'Starting the logger, switching screens, and launching the game all add a few minutes of non-representative time to the start (and often the end) of a log. If you’re specifically testing a game’s performance, use the "Gameplay window" panel on the Compare Logs page to trim each log to when frames were actually being rendered, instead of comparing the full recorded session.' },
];
function tipListHtml(tips) {
  return `<div class="tip-list">${tips.map(t => `<div class="tip-item">${icon('lightbulb')}<div><b>${escapeHtml(t.title)}</b><p>${escapeHtml(t.detail)}</p></div></div>`).join('')}</div>`;
}

const STATE = {
  files: [],
  activeView: 'summary',
  nextColorIdx: 0,
  raw: { fileId: null, search: '', page: 0 },
  toasts: [],
  scoreProfile: 'balanced', // which weighting "best overall run" uses — switchable in Compare Logs
  theme: 'system', // 'system' | 'light' | 'dark' — set from localStorage at boot, see applyTheme()
  trimMode: 'full', // 'full' | 'trimmed' — Compare Logs: use each file's whole duration, or just its gameplay window
  trimRanges: {}, // fileId -> {startMs, endMs}, elapsed from that file's own start — auto-detected, user-adjustable
};

// ---------- Theme ----------
// "system" leaves data-theme unset so the page follows the OS/browser preference via
// the existing prefers-color-scheme CSS; "light"/"dark" force it via data-theme, which
// the CSS above already has full override rules for.
function loadSavedTheme() {
  try { return localStorage.getItem('rigdiag_theme') || 'system'; } catch (e) { return 'system'; }
}
function saveTheme(theme) {
  try { localStorage.setItem('rigdiag_theme', theme); } catch (e) { /* ignore — private mode etc. */ }
}
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
  else root.removeAttribute('data-theme');
}
function setTheme(theme) {
  STATE.theme = theme;
  applyTheme(theme);
  saveTheme(theme);
  render();
}
STATE.theme = loadSavedTheme();
applyTheme(STATE.theme);

function fmtBytesOrRows(f) { return `${f.nRows.toLocaleString()} samples`; }
function fmtDate(d) { if (!d) return '—'; return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }

let activeToasts = 0;
function showToast(msg, tone) {
  const slot = activeToasts++;
  const el = document.createElement('div');
  el.className = 'issue-fix';
  el.style.cssText = `position:fixed;bottom:${20 + slot * 54}px;left:50%;transform:translateX(-50%);z-index:50;box-shadow:var(--shadow-2);max-width:420px;border:1px solid var(--border-strong);background:var(--surface);transition:bottom 0.2s;`;
  if (tone === 'error') el.style.borderColor = 'var(--critical)';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.style.transition = 'opacity 0.3s'; el.style.opacity = '0'; setTimeout(() => { el.remove(); activeToasts--; }, 300); }, 3800);
}

// ---------- Copy-to-clipboard for shareable panels ----------
// Any render function can register a plain-text version of a panel here (keyed by a
// short id) right before setting innerHTML, then drop a copyButtonHtml(id) button in
// that panel's header. A single delegated listener (wired once in initShell, since
// #content itself is never replaced — only its children are) handles every copy
// button on every page without needing per-button closures, so this scales cleanly
// as more panels grow their own copy button over time.
const COPY_REGISTRY = {};
function copyButtonHtml(id, label) {
  return `<button class="btn ghost copy-btn" data-copy-id="${id}" title="Copy ${escapeHtml(label || 'this section')} as plain text — handy for pasting into a search, forum post, or AI chat">${icon('clipboard')}<span>Copy</span></button>`;
}
async function copyRegistryText(id, btn) {
  const text = COPY_REGISTRY[id];
  if (text == null) return;
  const original = btn ? btn.innerHTML : null;
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Clipboard API can be blocked in some sandboxed/embedded contexts — fall back to
    // a legacy hidden-textarea copy rather than trying to select the rendered panel's
    // HTML (which would grab icons/buttons along with the text, not just the clean
    // plain-text version this button is actually offering).
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0;';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand('copy');
      ta.remove();
    } catch (err2) {
      showToast('Clipboard access is blocked here — try copying manually.', 'error');
      return;
    }
  }
  if (btn) {
    btn.innerHTML = `${icon('check')}<span>Copied</span>`;
    btn.disabled = true;
    setTimeout(() => { if (btn.isConnected) { btn.innerHTML = original; btn.disabled = false; } }, 1400);
  }
}

// ---------- File loading ----------
// HWiNFO normally exports CSVs in the Windows system codepage (windows-1252),
// which is why degree signs etc. need explicit decoding rather than assuming
// UTF-8 — but a file re-saved by another tool may genuinely be UTF-8. Strict
// UTF-8 decoding throws on real windows-1252 bytes (e.g. a lone 0xB0 "°"), so
// try it first and fall back only if it rejects the bytes.
function decodeCsvBuffer(buf) {
  try { return new TextDecoder('utf-8', { fatal: true }).decode(buf); }
  catch (e) { return new TextDecoder('windows-1252').decode(buf); }
}

async function addFiles(fileList) {
  const incoming = Array.from(fileList).filter(f => /\.csv$/i.test(f.name));
  if (!incoming.length) { showToast('Please choose a .csv file exported from HWiNFO.', 'error'); return; }

  const room = 4 - STATE.files.length;
  if (incoming.length > room) showToast(`Only ${room} more log${room === 1 ? '' : 's'} can be loaded (4 max) — using the first ${room}.`);
  const toLoad = incoming.slice(0, Math.max(0, room));

  const parsedFiles = [];
  for (const file of toLoad) {
    try {
      const buf = await file.arrayBuffer();
      const text = decodeCsvBuffer(buf);
      const parsed = parseHWiNFOFile(file.name, text, { lastModified: file.lastModified });
      parsed.id = `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`;
      parsed.label = loadSavedLabel(parsed);
      parsedFiles.push(parsed);
    } catch (err) {
      showToast(err.message || `Could not read "${file.name}".`, 'error');
    }
  }
  for (const parsed of parsedFiles) {
    parsed.color = FILE_COLORS[STATE.nextColorIdx % 4];
    STATE.nextColorIdx++;
    STATE.files.push(parsed);
  }
  if (STATE.raw.fileId == null && STATE.files.length) STATE.raw.fileId = STATE.files[0].id;
  render();
}

function removeFile(id) {
  STATE.files = STATE.files.filter(f => f.id !== id);
  if (!STATE.files.length) { STATE.nextColorIdx = 0; STATE.raw.fileId = null; }
  render();
}
function clearAllFiles() { STATE.files = []; STATE.nextColorIdx = 0; STATE.raw.fileId = null; render(); }

// ---------- Derived data (recomputed each render — datasets are small enough) ----------
function getOrdered() { return orderFilesByPriority(STATE.files); }

// ---------- Rendering ----------
const els = {};
function initShell() {
  els.nav = document.getElementById('nav-sections');
  els.chips = document.getElementById('file-chips');
  els.content = document.getElementById('content');
  els.fileInput = document.getElementById('file-input');
  els.bannerLinks = document.getElementById('banner-links');

  els.nav.innerHTML = SECTIONS.map(s => `
    <button class="nav-item" data-view="${s.id}">${icon(s.icon)}<span>${s.label}</span><span class="count-badge" data-count-for="${s.id}" hidden></span></button>
  `).join('');

  document.getElementById('btn-add-file').addEventListener('click', () => els.fileInput.click());
  document.getElementById('btn-clear-files').addEventListener('click', clearAllFiles);
  els.fileInput.addEventListener('change', (e) => { addFiles(e.target.files); e.target.value = ''; });

  els.nav.addEventListener('click', (e) => {
    const btn = e.target.closest('.nav-item'); if (!btn) return;
    STATE.activeView = btn.dataset.view;
    render();
  });

  els.chips.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.remove');
    if (removeBtn) { removeFile(removeBtn.dataset.id); return; }
    const editBtn = e.target.closest('.edit-label');
    if (editBtn) { startEditLabel(editBtn.dataset.id); return; }
  });

  document.body.addEventListener('dragover', (e) => { e.preventDefault(); });
  document.body.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  });

  els.bannerLinks.addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-toggle'); if (!btn) return;
    const next = { system: 'light', light: 'dark', dark: 'system' }[STATE.theme] || 'system';
    setTheme(next);
  });

  els.content.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-btn'); if (!btn) return;
    copyRegistryText(btn.dataset.copyId, btn);
  });
}

const THEME_ICON = { system: 'monitor', light: 'sun', dark: 'moon' };
const THEME_NEXT_LABEL = { system: 'light', light: 'dark', dark: 'system (follow OS)' };
function renderBannerLinks() {
  els.bannerLinks.innerHTML = `
    <button class="banner-link theme-toggle" title="Theme: ${STATE.theme} — click for ${THEME_NEXT_LABEL[STATE.theme]}">${icon(THEME_ICON[STATE.theme] || 'monitor')}</button>
    <a class="banner-link" href="${PROJECT_LINKS.github}" target="_blank" rel="noopener" title="View source on GitHub">${icon('github')}</a>
    <a class="banner-link coffee-link" href="${PROJECT_LINKS.coffee}" target="_blank" rel="noopener" title="Buy me a coffee">${icon('coffee')}<span>Buy me a coffee</span></a>
  `;
}

function renderTopbar() {
  const ordered = getOrdered();
  const best = (typeof computeHolisticRanking === 'function') ? computeHolisticRanking(STATE.files, STATE.scoreProfile) : null;
  els.chips.innerHTML = STATE.files.map(f => {
    const isPriority = ordered[0] && ordered[0].id === f.id && STATE.files.length > 1;
    const isBest = best && best.id === f.id;
    return `
    <div class="file-chip ${isPriority ? 'priority' : ''}" data-id="${f.id}" title="${escapeHtml(f.fileName)}${f.label ? ' — labeled "' + f.label + '"' : ''}${isBest ? ' — best overall run (lowest temps, best frame performance among loaded logs)' : ''}">
      ${isBest ? `<span class="best-star">${icon('star')}</span>` : ''}
      <span class="dot" style="background:${f.color}"></span>
      <span class="fname">${escapeHtml(displayName(f))}</span>
      <button class="edit-label" data-id="${f.id}" title="Rename this session">${icon('pencil')}</button>
      <span class="ftime">${f.startTime ? fmtDate(f.startTime) : ''}</span>
      ${isPriority ? '<span class="priority-tag">newest</span>' : ''}
      <button class="remove" data-id="${f.id}" title="Remove this log">${icon('x')}</button>
    </div>`;
  }).join('') || '<span class="footnote">No logs loaded.</span>';
}

function renderNavBadges() {
  const ordered = getOrdered();
  let critCount = 0;
  if (ordered.length) {
    const { top } = topIssuesAcrossFiles(ordered);
    critCount = top.filter(i => i.severity === 'critical' || i.severity === 'serious').length;
  }
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === STATE.activeView);
    const badge = btn.querySelector('.count-badge');
    if (btn.dataset.view === 'summary' && critCount > 0) { badge.hidden = false; badge.textContent = critCount; }
    else badge.hidden = true;
  });
}

function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

// ---------- Session labels ----------
// A custom label for a log (e.g. "Before repaste" / "After EXPO enabled") is shown
// throughout the UI in place of the raw filename, and remembered by filename+mtime so
// re-loading the same export later still shows the label. localStorage is per-viewer and
// best-effort — a private window or blocked site data just means labels don't persist.
function labelStorageKey(f) { return `hwinfo_label::${f.fileName}::${f.lastModified || ''}`; }
function loadSavedLabel(f) { try { return localStorage.getItem(labelStorageKey(f)); } catch (e) { return null; } }
function saveLabel(f, label) { try { if (label) localStorage.setItem(labelStorageKey(f), label); else localStorage.removeItem(labelStorageKey(f)); } catch (e) { /* storage unavailable — label still works for this session */ } }
function displayName(f) { return (f && f.label) || (f && f.fileName) || ''; }

function startEditLabel(id) {
  const f = STATE.files.find(x => x.id === id);
  const chip = els.chips.querySelector(`.file-chip[data-id="${CSS.escape(id)}"]`);
  if (!f || !chip) return;
  const fnameSpan = chip.querySelector('.fname');
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'label-input';
  input.value = f.label || '';
  input.placeholder = f.fileName;
  input.maxLength = 60;
  fnameSpan.replaceWith(input);
  input.focus();
  input.select();
  let done = false;
  const commit = () => {
    if (done) return; done = true;
    const val = input.value.trim();
    f.label = val || null;
    saveLabel(f, f.label);
    render();
  };
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    else if (e.key === 'Escape') { e.preventDefault(); done = true; render(); }
  });
  input.addEventListener('blur', commit);
}

function severityIcon(sev) { return sev === 'critical' || sev === 'serious' ? 'alert' : sev === 'warning' ? 'alert' : 'check'; }

function issueCardHtml(issue, rank) {
  const filesNote = issue.occurrences
    ? (issue.fileCount > 1 ? `Seen in ${issue.fileCount} of ${issue.totalFiles} logs` : `Seen in "${issue.occurrences[0].fileName}"`)
    : `In "${issue.file}"`;
  return `
  <div class="issue-card ${issue.severity}">
    ${rank ? `<div class="issue-rank">${rank}</div>` : ''}
    <div class="issue-body">
      <div class="issue-top">
        <span class="issue-title">${escapeHtml(issue.title)}</span>
        <span class="sev-pill ${issue.severity}"><span class="sw-dot"></span>${issue.severity}</span>
        ${issue.category ? `<span class="cat-chip">${issue.category}</span>` : ''}
      </div>
      <div class="issue-meta">${filesNote}</div>
      <div class="issue-detail">${escapeHtml(issue.detail)}</div>
      <div class="issue-fix"><b>Suggested fix — </b>${escapeHtml(issue.suggestion)}</div>
    </div>
  </div>`;
}

function statTileHtml(id, def, ordered) {
  const newest = ordered[0];
  const col = resolveKeyMetrics(newest)[id];
  if (!col) return '';
  const s = col.stats;
  const headline = def.field === 'avg' ? s.avg : def.field === 'p95' ? s.p95 : s.max;
  let deltaHtml = '';
  if (ordered.length > 1) {
    const prevCol = resolveKeyMetrics(ordered[1])[id];
    if (prevCol) {
      const prevVal = def.field === 'avg' ? prevCol.stats.avg : def.field === 'p95' ? prevCol.stats.p95 : prevCol.stats.max;
      const diff = headline - prevVal;
      const dir = METRIC_DIRECTION[id] || 'neutral';
      let cls = 'neutral';
      if (dir !== 'neutral' && Math.abs(diff) > 0.01) cls = (dir === 'lower' ? diff < 0 : diff > 0) ? 'better' : 'worse';
      const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '';
      deltaHtml = `<span class="tile-delta ${cls}">${arrow} ${Math.abs(diff) < 10 ? Math.abs(diff).toFixed(1) : Math.abs(diff).toFixed(0)}</span>`;
    }
  }
  return `
  <div class="tile" data-spark-metric="${id}">
    <div class="tile-label">${def.label || KEY_METRICS.find(m => m.id === id).label}</div>
    <div class="tile-value-row"><span class="tile-value tnum">${fmtValue(headline, '')}</span><span class="tile-unit">${col.unit}</span>${deltaHtml}</div>
    <div class="spark-slot"></div>
    <div class="tile-range tnum"><span>min ${fmtValue(s.min, '')}</span><span>max ${fmtValue(s.max, '')}</span></div>
  </div>`;
}
function mountTileSparks(container, ordered) {
  container.querySelectorAll('[data-spark-metric]').forEach(tileEl => {
    const id = tileEl.dataset.sparkMetric;
    const slot = tileEl.querySelector('.spark-slot');
    const col = resolveKeyMetrics(ordered[0])[id];
    if (col) slot.appendChild(buildSparkline(elapsedPoints(ordered[0], col), ordered[0].color));
  });
}

// Groups a drive's several sensors (composite + secondary temps, life, writes)
// into one row per physical drive, keyed by the footer row's hardware label —
// several "Drive Temperature N" columns can belong to the same disk.
function groupDriveColumns(file) {
  const byLabel = new Map();
  const order = [];
  for (const col of file.columns) {
    if (!col.isNumeric || !col.stats || !col.hwLabel) continue;
    const isTemp = /^Drive Temperature\s*\d*\s*\[/i.test(col.name);
    const isLife = /^Drive Remaining Life/i.test(col.name);
    const isWrites = /^Total Host Writes/i.test(col.name);
    if (!isTemp && !isLife && !isWrites) continue;
    if (!/^drive:|^s\.m\.a\.r\.t/i.test(col.hwLabel)) continue;
    if (!byLabel.has(col.hwLabel)) { byLabel.set(col.hwLabel, { label: col.hwLabel, tempMax: null, lifeMin: null, writesLast: null }); order.push(col.hwLabel); }
    const d = byLabel.get(col.hwLabel);
    if (isTemp) d.tempMax = d.tempMax == null ? col.stats.max : Math.max(d.tempMax, col.stats.max);
    if (isLife) d.lifeMin = d.lifeMin == null ? col.stats.min : Math.min(d.lifeMin, col.stats.min);
    if (isWrites) d.writesLast = d.writesLast == null ? col.stats.last : Math.max(d.writesLast, col.stats.last);
  }
  return order.map(label => {
    const d = byLabel.get(label);
    const clean = label.replace(/^drive:\s*/i, '').replace(/^s\.m\.a\.r\.t\.?:\s*/i, '');
    d.shortLabel = clean.length > 42 ? clean.slice(0, 40) + '…' : clean;
    return d;
  });
}

function hasSystemInfo(sys) {
  return !!(sys && (sys.cpu || sys.gpus.length || sys.motherboard || sys.ram.length || sys.drives.length || sys.networks.length));
}
function buildSystemOverviewText(sys, fileLabel) {
  const lines = [`SYSTEM OVERVIEW (from ${fileLabel})`];
  if (sys.cpu) lines.push(`CPU: ${sys.cpu}`);
  if (sys.gpus.length) lines.push(`GPU: ${sys.gpus.join(', ')}`);
  if (sys.motherboard) lines.push(`Motherboard: ${sys.motherboard}`);
  if (sys.ram.length) lines.push(`Memory: ${sys.ram.join(', ')}`);
  if (sys.drives.length) lines.push(`Storage: ${sys.drives.join('; ')}`);
  if (sys.networks.length) lines.push(`Network: ${sys.networks.join(', ')}`);
  return lines.join('\n');
}
function buildHeadroomText(file) {
  if (typeof getHardwareSpecs !== 'function') return null;
  const { cpuSpec, gpuSpec } = getHardwareSpecs(file);
  if (!cpuSpec && !gpuSpec) return null;
  const km = resolveKeyMetrics(file);
  const lines = ['HARDWARE HEADROOM (vs. approximate factory-stock spec)'];
  if (cpuSpec) {
    lines.push(`${cpuSpec.name}:`);
    if (km.cpu_temp) lines.push(`  Peak temp: ${km.cpu_temp.stats.max.toFixed(1)}C (~${cpuSpec.tjMaxC}C typical throttle point)`);
    if (km.cpu_power) lines.push(`  Peak power: ${km.cpu_power.stats.max.toFixed(0)}W (~${cpuSpec.pptW}W stock power limit)`);
  }
  if (gpuSpec) {
    lines.push(`${gpuSpec.name}:`);
    if (km.gpu_temp) lines.push(`  Peak temp: ${km.gpu_temp.stats.max.toFixed(1)}C (~${gpuSpec.coreThrottleC}C typical throttle point)`);
    if (km.gpu_power) lines.push(`  Peak power: ${km.gpu_power.stats.max.toFixed(0)}W (~${gpuSpec.tbpW}W reference board power)`);
  }
  return lines.join('\n');
}
function buildIssuesText(heading, top) {
  const lines = [`${heading} (${top.length})`];
  if (!top.length) lines.push('No significant issues detected.');
  else top.forEach((t, i) => {
    lines.push(`${i + 1}. [${t.severity.toUpperCase()}] ${t.title}`);
    lines.push(`   ${t.detail}`);
    lines.push(`   Suggested fix: ${t.suggestion}`);
  });
  return lines.join('\n');
}

function buildThermalsText(ordered) {
  const newest = ordered[0];
  const km = resolveKeyMetrics(newest);
  const ids = ['cpu_temp', 'vrm_temp', 'gpu_temp', 'gpu_hotspot', 'gpu_vrm_temp', 'gpu_mem_temp', 'motherboard_temp'];
  const lines = [`THERMALS (from ${displayName(newest)})`];
  let any = false;
  for (const id of ids) {
    const col = km[id];
    if (!col) continue;
    any = true;
    const m = KEY_METRICS.find(k => k.id === id);
    lines.push(`${m.label}: min ${col.stats.min.toFixed(1)}${col.unit}, avg ${col.stats.avg.toFixed(1)}${col.unit}, max ${col.stats.max.toFixed(1)}${col.unit}`);
  }
  if (!any) lines.push('No temperature sensors were found in this log.');
  const bm = resolveBoolMetrics(newest);
  const throttleRows = [
    ['CPU thermal throttle (HTC/PROCHOT)', [...(bm.cpu_htc || []), ...(bm.cpu_prochot || [])]],
    ['GPU thermal throttle', bm.gpu_thermal_throttle],
    ['GPU power-limit throttle', bm.gpu_power_throttle],
    ['GPU reliability-voltage limit', bm.gpu_voltage_limit],
  ];
  const throttleLines = [];
  for (const [label, cols] of throttleRows) {
    if (!cols || !cols.length) continue;
    const frac = pctTrue(cols);
    if (frac <= 0) continue;
    throttleLines.push(`${label}: ${Math.round(frac * 100)}% of samples`);
  }
  lines.push('');
  lines.push('THROTTLING ACTIVITY');
  if (throttleLines.length) lines.push(...throttleLines);
  else lines.push('No throttling flags were active in this log.');
  return lines.join('\n');
}

function buildGamingText(ordered) {
  const newest = ordered[0];
  const gs = gamingSummary(newest);
  const lines = [`GAMING (from ${displayName(newest)})`];
  if (!gs.process) { lines.push('No PresentMon frame data in this log.'); return lines.join('\n'); }
  lines.push(`Capture target: ${gs.process}${gs.isGame ? '' : ' (not a game)'}`);
  if (gs.bottleneck) {
    const gpuPct = Math.round(gs.bottleneck.gpuBoundPct * 100), cpuPct = 100 - gpuPct;
    lines.push(`CPU/GPU bottleneck: GPU-bound ${gpuPct}%, CPU-bound ${cpuPct}% (based on ${gs.bottleneck.sampleCount.toLocaleString()} active frames)`);
  }
  if (gs.stutter && gs.stutter.activeCount >= 20) {
    const s = gs.stutter;
    lines.push(`Frame pacing: ${s.count} stutter events of ${s.activeCount} active frames; typical frame time ${s.medianMs.toFixed(1)}ms; worst spike ${s.worstMs.toFixed(0)}ms`);
  }
  if (gs.pacing) {
    lines.push(`Presented vs. displayed: ${gs.pacing.presentedAvg.toFixed(0)} FPS presented, ${gs.pacing.displayedAvg.toFixed(0)} FPS displayed (${fmtPct(gs.pacing.gapPct)} ${gs.pacing.gapPct >= 0 ? 'lower' : 'higher'})`);
  }
  return lines.join('\n');
}

function buildMemoryText(ordered) {
  const newest = ordered[0];
  const memCfg = checkMemoryConfig(newest);
  const lines = [`MEMORY & STORAGE (from ${displayName(newest)})`, '', 'MEMORY CONFIGURATION'];
  if (!memCfg) lines.push('No "Memory Clock" sensor was found in this log.');
  else {
    const { observedSpeed, observedCAS, rated, mismatch, gapPct } = memCfg;
    lines.push(`Observed: DDR-${observedSpeed}${observedCAS ? ` CL${observedCAS}` : ''}`);
    if (rated) {
      lines.push(`Rated (module label): DDR-${rated.ratedSpeed}${rated.ratedCAS ? ` CL${rated.ratedCAS}` : ''}`);
      lines.push(mismatch ? `Running ${fmtPct(gapPct)} slower than rated — EXPO/XMP may be off.` : 'Running at (or close to) rated speed.');
    } else {
      lines.push("Module label didn't match a recognizable rated-speed pattern.");
    }
  }
  const drives = groupDriveColumns(newest);
  lines.push('', 'DRIVE HEALTH');
  if (!drives.length) lines.push('No drive SMART sensors were found.');
  else drives.forEach(d => {
    lines.push(`${d.shortLabel}: peak temp ${d.tempMax != null ? d.tempMax.toFixed(0) + '°C' : '—'}, remaining life ${d.lifeMin != null ? d.lifeMin.toFixed(0) + '%' : '—'}, total host writes ${d.writesLast != null ? d.writesLast.toFixed(0) + 'GB' : '—'}`);
  });
  return lines.join('\n');
}

function buildNetworkText(ordered) {
  const newest = ordered[0];
  const lines = [`NETWORK & PCIE (from ${displayName(newest)})`, '', 'PCI EXPRESS ERROR COUNTERS'];
  const pcieErrPatterns = [/^Correctable Error Count/i, /^Non-Fatal Error Count/i, /^Fatal Error Count/i, /^Bad DLLP Count/i, /^Bad TLP Count/i, /^LCRC Error Count/i, /^Replay Count/i, /^Recovery Count/i, /^Receiver Errors/i, /^NAKs Sent Count/i, /^NAKs Received Count/i];
  const rows = [];
  for (const re of pcieErrPatterns) for (const col of findAllNumeric(newest, re)) rows.push([stripUnit(col.name), col.stats.max]);
  if (!rows.length) lines.push('No PCIe error counters were found in this log.');
  else rows.forEach(([n, v]) => lines.push(`${n}: ${v}`));
  return lines.join('\n');
}

function buildCompareText(chrono, cmpRows, scoreResult, newFindings, persistent, resolved, trimEnabled) {
  const lines = [];
  if (trimEnabled) lines.push('NOTE: this comparison is trimmed to each log\'s detected/adjusted gameplay window, not the full recorded log.', '');
  lines.push('RUN VERDICT');
  if (scoreResult) {
    const byId = new Map(scoreResult.perFile.map(p => [p.id, p]));
    chrono.forEach(f => {
      const s = byId.get(f.id);
      if (!s) return;
      const catStr = scoreResult.categories.map(cat => `${cat}: ${s.breakdown[cat] == null ? '—' : s.breakdown[cat]}`).join(', ');
      lines.push(`${displayName(f)}: composite ${s.composite}${scoreResult.bestId === f.id ? ' (best overall)' : ''} — ${catStr}`);
    });
    const basisNotes = scoreResult.categories
      .map(cat => (typeof categoryScoreTooltip === 'function') ? `${cat[0].toUpperCase()}${cat.slice(1)} — ${categoryScoreTooltip(cat)}` : null)
      .filter(Boolean);
    if (basisNotes.length) { lines.push('Scoring basis:'); basisNotes.forEach(n => lines.push(`  ${n}`)); }
    const durations = chrono.map(f => f.durationMs).filter(d => d > 0);
    if (durations.length) {
      const minDur = Math.min(...durations), maxDur = Math.max(...durations);
      if (minDur > 0 && (maxDur / minDur) > 1.15) {
        lines.push(`Note: these runs have noticeably different durations (${fmtDur(minDur)} vs ${fmtDur(maxDur)}) — a longer session has more chance to contain a brief spike a shorter one wouldn't see, which skews peak-based scores like Thermals.`);
      }
    }
  } else lines.push('Not enough data to compute a composite score.');

  lines.push('', 'METRIC DELTAS (oldest -> newest, session averages)');
  cmpRows.forEach(row => {
    const vals = row.perFile.map(p => p ? fmtValue(p.avg, row.unit) : '—').join(' -> ');
    const net = computeMetricDelta(row.perFile[0], row.perFile[row.perFile.length - 1], row.direction);
    const netStr = net ? ` (net ${net.diff > 0 ? '+' : ''}${fmtValue(net.diff, row.unit)}${net.pct != null ? ` / ${net.diff > 0 ? '+' : ''}${net.pct.toFixed(0)}%` : ''})` : '';
    lines.push(`${row.label}: ${vals}${netStr}`);
  });

  lines.push('', 'ISSUE TIMELINE');
  lines.push(buildIssuesText('New in latest log', newFindings));
  lines.push('', buildIssuesText('Persistent across all logs', persistent));
  lines.push('', buildIssuesText('Present earlier, not in latest log', resolved));
  return lines.join('\n');
}

function systemSpecHtml(sys) {
  const rows = [];
  if (sys.cpu) rows.push(['cpu', 'CPU', sys.cpu]);
  if (sys.gpus.length) rows.push(['gpu', sys.gpus.length > 1 ? 'GPUs' : 'GPU', sys.gpus.join(', ')]);
  if (sys.motherboard) rows.push(['mobo', 'Motherboard', sys.motherboard]);
  if (sys.ram.length) rows.push(['ram', 'Memory', sys.ram.join(', ')]);
  if (sys.drives.length) rows.push(['disk', 'Storage', sys.drives.join('; ')]);
  if (sys.networks.length) rows.push(['network', 'Network', sys.networks.join(', ')]);
  if (!rows.length) return '<div class="footnote">No hardware descriptor row found in this log — HWiNFO only appends this when logging is stopped from the app itself.</div>';
  return `<div class="spec-grid">${rows.map(([ic, label, val]) => `
    <div class="spec-item">
      <div class="spec-icon">${icon(ic)}</div>
      <div><div class="spec-label">${label}</div><div class="spec-value">${escapeHtml(val)}</div></div>
    </div>`).join('')}</div>`;
}

function headroomBarHtml(label, observed, limit, unit, tone) {
  const pct = Math.max(0, Math.min(100, Math.round((observed / limit) * 100)));
  return `<div style="margin-bottom:12px;">
    <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--ink-2);margin-bottom:4px;">
      <span>${label}</span><span class="mono tnum">${fmtValue(observed, unit)} / ${fmtValue(limit, unit)}</span>
    </div>
    <div style="height:8px;border-radius:5px;background:var(--surface-2);overflow:hidden;">
      <div style="width:${pct}%;height:100%;background:var(--${tone});"></div>
    </div>
  </div>`;
}

// Model-aware "how much headroom is left" view — only rendered when the CPU/GPU string
// in the log's hardware descriptor row matches a known part in app_specs.js.
function specHeadroomHtml(file) {
  if (typeof getHardwareSpecs !== 'function') return null;
  const { cpuSpec, gpuSpec } = getHardwareSpecs(file);
  if (!cpuSpec && !gpuSpec) return null;
  const km = resolveKeyMetrics(file);
  const blocks = [];
  if (cpuSpec) {
    let b = `<div style="flex:1;min-width:240px;"><div style="font-weight:600;font-size:13.5px;margin-bottom:8px;">${escapeHtml(cpuSpec.name)}</div>`;
    if (km.cpu_temp) { const p = km.cpu_temp.stats.max / cpuSpec.tjMaxC; b += headroomBarHtml('Peak temp vs. throttle point', km.cpu_temp.stats.max, cpuSpec.tjMaxC, '°C', p > 0.95 ? 'critical' : p > 0.88 ? 'warning' : 'good'); }
    if (km.cpu_power) { const p = km.cpu_power.stats.max / cpuSpec.pptW; b += headroomBarHtml('Peak power vs. stock limit', km.cpu_power.stats.max, cpuSpec.pptW, 'W', p > 1.1 ? 'accent' : 'good'); }
    if (cpuSpec.note) b += `<div class="footnote">${escapeHtml(cpuSpec.note)}</div>`;
    b += `</div>`;
    blocks.push(b);
  }
  if (gpuSpec) {
    let b = `<div style="flex:1;min-width:240px;"><div style="font-weight:600;font-size:13.5px;margin-bottom:8px;">${escapeHtml(gpuSpec.name)}</div>`;
    if (km.gpu_temp) { const p = km.gpu_temp.stats.max / gpuSpec.coreThrottleC; b += headroomBarHtml('Peak temp vs. throttle point', km.gpu_temp.stats.max, gpuSpec.coreThrottleC, '°C', p > 0.95 ? 'critical' : p > 0.88 ? 'warning' : 'good'); }
    if (km.gpu_power) { const p = km.gpu_power.stats.max / gpuSpec.tbpW; b += headroomBarHtml('Peak power vs. reference board power', km.gpu_power.stats.max, gpuSpec.tbpW, 'W', p > 1.1 ? 'accent' : 'good'); }
    if (gpuSpec.note) b += `<div class="footnote">${escapeHtml(gpuSpec.note)}</div>`;
    b += `</div>`;
    blocks.push(b);
  }
  if (!blocks.length) return null;
  return `<div style="display:flex;gap:24px;flex-wrap:wrap;">${blocks.join('')}</div>
    <div class="footnote" style="margin-top:10px;">Matched from this log's hardware descriptor against a lookup table of approximate factory-stock specs — real systems vary by motherboard/AIB vendor, so treat this as context, not a hard limit.</div>`;
}

// ---- metric chart card (multi-file overlay) ----
function metricChartCard(metricId, ordered, opts) {
  const def = KEY_METRICS.find(m => m.id === metricId);
  if (!def) return null;
  const seriesData = ordered.map(f => {
    const col = resolveKeyMetrics(f)[metricId];
    return col ? { label: displayName(f), color: f.color, points: elapsedPoints(f, col), col } : null;
  }).filter(Boolean);
  if (!seriesData.length) return null;

  const card = document.createElement('div');
  card.className = 'panel chart-card';
  const newestCol = seriesData[0].col;
  const s = newestCol.stats;
  card.innerHTML = `
    <div class="panel-head">
      <div><h3>${def.label}</h3><div class="sub">min ${fmtValue(s.min, newestCol.unit)} · avg ${fmtValue(s.avg, newestCol.unit)} · max ${fmtValue(s.max, newestCol.unit)}</div></div>
      ${seriesData.length > 1 ? `<div class="chart-legend">${seriesData.map(s2 => `<span class="legend-item"><span class="legend-swatch" style="background:${s2.color}"></span>${escapeHtml(s2.label)}</span>`).join('')}</div>` : ''}
    </div>
    <div class="chart-slot"></div>`;
  card.querySelector('.chart-slot').appendChild(buildLineChart(seriesData, { unit: newestCol.unit, area: true, zeroFloor: opts && opts.zeroFloor, clipPercentile: opts && opts.clipPercentile }));
  return card;
}

function boolMetricBar(label, cols, opts) {
  if (!cols || !cols.length) return '';
  const frac = pctTrue(cols);
  if (frac <= 0) return '';
  const pct = Math.round(frac * 100);
  const benign = opts && opts.benign;
  const tone = benign ? 'accent' : (pct > 20 ? 'critical' : pct > 5 ? 'warning' : 'good');
  return `<div style="display:flex;align-items:center;gap:10px;">
    <div style="flex:1;min-width:170px;font-size:12.5px;color:var(--ink-2);">${label}${benign ? ' <span class="footnote">(often normal)</span>' : ''}</div>
    <div style="flex:2;height:8px;border-radius:6px;background:var(--surface-2);overflow:hidden;"><div style="width:${pct}%;height:100%;background:var(--${tone});"></div></div>
    <div class="mono tnum" style="width:38px;text-align:right;font-size:12px;color:var(--ink-2);">${pct}%</div>
  </div>`;
}

// ---------- Views ----------
function renderSummary(container, ordered) {
  const { top } = topIssuesAcrossFiles(ordered);
  const newest = ordered[0];

  let html = '';
  html += `<div class="page-head"><div><h1>Summary</h1><p>${ordered.length} log${ordered.length > 1 ? 's' : ''} loaded, spanning ${fmtDur(ordered.reduce((a, f) => a + f.durationMs, 0))} of recorded telemetry. Most recent capture is treated as the priority file.</p></div></div>`;

  const sysLabel = displayName(newest);
  const sysCopyable = hasSystemInfo(newest.systemInfo);
  if (sysCopyable) COPY_REGISTRY['summary-sysinfo'] = buildSystemOverviewText(newest.systemInfo, sysLabel);
  html += `<div class="panel"><div class="panel-head"><h3>System overview</h3><div style="display:flex;align-items:center;gap:10px;"><span class="sub">from ${escapeHtml(sysLabel)}</span>${sysCopyable ? copyButtonHtml('summary-sysinfo', 'system overview') : ''}</div></div>${systemSpecHtml(newest.systemInfo)}</div>`;

  const headroom = specHeadroomHtml(newest);
  if (headroom) {
    const headroomText = buildHeadroomText(newest);
    if (headroomText) COPY_REGISTRY['summary-headroom'] = headroomText;
    html += `<div class="panel"><div class="panel-head"><h3>Hardware headroom</h3><div style="display:flex;align-items:center;gap:10px;"><span class="sub">most recent log, vs. recognized part's stock spec</span>${headroomText ? copyButtonHtml('summary-headroom', 'hardware headroom') : ''}</div></div>${headroom}</div>`;
  }

  COPY_REGISTRY['summary-issues'] = buildIssuesText('TOP THINGS TO LOOK AT', top);
  html += `<div class="panel">
    <div class="panel-head"><h3>Top things to look at</h3><div style="display:flex;align-items:center;gap:10px;"><span class="sub">ranked by severity${ordered.length > 1 ? ', persistence across logs, and recency' : ''}</span>${copyButtonHtml('summary-issues', 'top things to look at')}</div></div>
    ${top.length ? `<div class="issue-list">${top.map((t, i) => issueCardHtml(t, i + 1)).join('')}</div>` :
      `<div class="empty-state">${icon('check')}<h4>No significant issues detected</h4><p>Across ${ordered.length} log${ordered.length > 1 ? 's' : ''} and ${newest.columns.filter(c => c.isNumeric).length} monitored readings, nothing crossed a concerning threshold. Your temperatures, power delivery, storage health and link stability all look normal.</p></div>`}
  </div>`;

  html += `<div class="panel"><div class="panel-head"><h3>At a glance</h3><span class="sub">most recent log, peak / avg values</span></div>
    <div class="tile-grid">
      ${statTileHtml('cpu_temp', { field: 'max', label: 'CPU Temp (peak)' }, ordered)}
      ${statTileHtml('gpu_temp', { field: 'max', label: 'GPU Temp (peak)' }, ordered)}
      ${statTileHtml('cpu_usage', { field: 'avg', label: 'CPU Usage (avg)' }, ordered)}
      ${statTileHtml('gpu_util', { field: 'avg', label: 'GPU Usage (avg)' }, ordered)}
      ${statTileHtml('ram_load', { field: 'p95', label: 'Memory Load (p95)' }, ordered)}
      ${statTileHtml('gpu_power', { field: 'avg', label: 'GPU Power (avg)' }, ordered)}
    </div>
  </div>`;

  const summaryBest = (typeof computeHolisticRanking === 'function') ? computeHolisticRanking(ordered, STATE.scoreProfile) : null;
  const profileLabel = (typeof SCORING_PROFILES !== 'undefined' && SCORING_PROFILES[STATE.scoreProfile]) ? SCORING_PROFILES[STATE.scoreProfile].label : 'Balanced';
  html += `<div class="panel"><div class="panel-head"><h3>Loaded logs</h3>${summaryBest ? `<span class="sub"><span class="best-star">${icon('star')}</span> = best overall, "${profileLabel}" scoring — see Compare Logs to change</span>` : ''}</div>
    <div class="table-scroll"><table class="data-table"><thead><tr><th></th><th>File</th><th>Start</th><th>End</th><th>Duration</th><th>Samples</th><th></th></tr></thead><tbody>
      ${ordered.map(f => `<tr><td><span class="dot" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${f.color}"></span></td><td>${summaryBest && summaryBest.id === f.id ? `<span class="best-star" title="Best overall run">${icon('star')}</span> ` : ''}${escapeHtml(displayName(f))}</td><td class="mono tnum">${fmtDate(f.startTime)}</td><td class="mono tnum">${fmtDate(f.endTime)}</td><td class="mono tnum">${fmtDur(f.durationMs)}</td><td class="mono tnum">${f.nRows.toLocaleString()}</td><td><button class="btn ghost row-remove" data-id="${f.id}" title="Remove this log">${icon('x')}</button></td></tr>`).join('')}
    </tbody></table></div>
  </div>`;

  container.innerHTML = html;
  mountTileSparks(container, ordered);
  container.querySelectorAll('.row-remove').forEach(btn => btn.addEventListener('click', () => removeFile(btn.dataset.id)));
}

function renderMetricGroup(container, ordered, ids, opts) {
  const grid = document.createElement('div');
  grid.className = 'metric-grid';
  let any = false;
  for (const id of ids) {
    const card = metricChartCard(id, ordered, opts);
    if (card) { grid.appendChild(card); any = true; }
  }
  container.appendChild(grid);
  return any;
}

function renderThermals(container, ordered) {
  COPY_REGISTRY['thermals-page'] = buildThermalsText(ordered);
  container.innerHTML = `<div class="page-head"><div><h1>Thermals</h1><p>Temperatures across CPU, GPU and VRMs, overlaid by elapsed time so separate sessions line up regardless of when they were recorded.</p></div>${copyButtonHtml('thermals-page', 'thermals')}</div>
  <div id="thermal-charts"></div>
  <div class="panel" id="throttle-panel"><div class="panel-head"><h3>Throttling activity</h3><span class="sub">share of samples where the protection was engaged</span></div><div id="throttle-body" style="display:flex;flex-direction:column;gap:10px;"></div></div>`;
  const chartsEl = container.querySelector('#thermal-charts');
  const any = renderMetricGroup(chartsEl, ordered, ['cpu_temp', 'vrm_temp', 'gpu_temp', 'gpu_hotspot', 'gpu_vrm_temp', 'gpu_mem_temp', 'motherboard_temp']);
  if (!any) chartsEl.innerHTML = '<div class="footnote">No temperature sensors were found in the loaded log(s).</div>';

  const throttleBody = container.querySelector('#throttle-body');
  const newest = ordered[0];
  const bm = resolveBoolMetrics(newest);
  const bars = [
    boolMetricBar('CPU thermal throttle (HTC/PROCHOT)', [...(bm.cpu_htc || []), ...(bm.cpu_prochot || [])]),
    boolMetricBar('GPU thermal throttle', bm.gpu_thermal_throttle),
    boolMetricBar('GPU power-limit throttle', bm.gpu_power_throttle, { benign: true }),
    boolMetricBar('GPU reliability-voltage limit', bm.gpu_voltage_limit, { benign: true }),
  ].filter(Boolean);
  throttleBody.innerHTML = bars.length ? bars.join('') : '<div class="footnote">No throttling flags were active in the most recent log.</div>';
}

function renderPower(container, ordered) {
  container.innerHTML = `<div class="page-head"><div><h1>Power & Voltage</h1><p>Package power draw and core voltage. Sudden voltage spikes or sustained high power are worth cross-checking against the Thermals tab.</p></div></div>
  <div id="power-charts"></div>
  <div id="pin-panel"></div>`;
  const chartsEl = container.querySelector('#power-charts');
  const any = renderMetricGroup(chartsEl, ordered, ['cpu_power', 'gpu_power', 'vcore'], { zeroFloor: true });
  if (!any) chartsEl.innerHTML = '<div class="footnote">No power/voltage sensors were found in the loaded log(s).</div>';

  // 12VHPWR pin current detail, newest file only (per-pin, single-file — too dense to overlay 4 files x 6 pins)
  const newest = ordered[0];
  const pinCols = findAllNumeric(newest, /12VHPWR Pin\d Current/i);
  const pinPanel = container.querySelector('#pin-panel');
  if (pinCols.length >= 2) {
    const pinColors = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#9085e9'];
    const series = pinCols.map((c, i) => ({ label: stripUnit(c.name).replace('GPU 12VHPWR ', ''), color: pinColors[i % pinColors.length], points: elapsedPoints(newest, c) }));
    const peakSpread = Math.max(...pinCols.map(c => c.stats.max)) - Math.min(...pinCols.map(c => c.stats.max));
    const panel = document.createElement('div');
    panel.className = 'panel chart-card';
    panel.innerHTML = `<div class="panel-head"><div><h3>12VHPWR / 12V-2x6 per-pin current</h3><div class="sub">peak spread across pins: ${peakSpread.toFixed(2)}A · most recent log only</div></div>
      <div class="chart-legend">${series.map(s => `<span class="legend-item"><span class="legend-swatch" style="background:${s.color}"></span>${s.label}</span>`).join('')}</div></div>
      <div class="chart-slot"></div>`;
    panel.querySelector('.chart-slot').appendChild(buildLineChart(series, { unit: 'A', zeroFloor: true }));
    pinPanel.appendChild(panel);
  }
}

function renderPerf(container, ordered) {
  container.innerHTML = `<div class="page-head"><div><h1>Performance</h1><p>Utilization and clocks. Compare against Thermals and Power to see whether performance is being left on the table by heat or power limits. Frame-rate and stutter analysis live in the Gaming tab.</p></div></div>
  <div id="perf-charts"></div>`;
  const chartsEl = container.querySelector('#perf-charts');
  const any = renderMetricGroup(chartsEl, ordered, ['cpu_usage', 'cpu_clock', 'gpu_util', 'gpu_clock'], { zeroFloor: true });
  if (!any) chartsEl.innerHTML = '<div class="footnote">No usage/clock sensors were found in the loaded log(s).</div>';
}

function captureBadgeHtml(gs) {
  if (!gs.process) return `<span class="cat-chip">No PresentMon capture in this log</span>`;
  if (gs.isGame) return `<span class="sev-pill" style="background:var(--good-wash);color:var(--good);"><span class="sw-dot"></span>Captured process: ${escapeHtml(gs.process)}</span>`;
  return `<span class="sev-pill warning"><span class="sw-dot"></span>Captured process: ${escapeHtml(gs.process)} — not a game</span>`;
}

function bottleneckPanelHtml(gs) {
  if (!gs.bottleneck) return '<div class="footnote">Not enough active-gameplay frame samples in this log to estimate a CPU/GPU bottleneck (GPU Busy/CPU Busy sensors need to be enabled in HWiNFO\'s PresentMon settings).</div>';
  const { gpuBoundPct, cpuBoundPct, sampleCount } = gs.bottleneck;
  const gpuPct = Math.round(gpuBoundPct * 100), cpuPct = 100 - gpuPct;
  let verdict;
  if (gpuPct >= 65) verdict = `Your GPU is the limiting factor on most frames — a faster GPU (or a resolution/settings drop) would likely help more than a faster CPU.`;
  else if (cpuPct >= 65) verdict = `Your CPU is the limiting factor on most frames — a faster CPU (or lowering CPU-side settings like draw distance/physics) would likely help more than a faster GPU.`;
  else verdict = `Fairly balanced — neither the CPU nor the GPU is dominating, so there's no single obvious upgrade target.`;
  return `
    <div style="display:flex;height:10px;border-radius:6px;overflow:hidden;margin-bottom:8px;">
      <div style="width:${gpuPct}%;background:var(--file-1);" title="GPU-bound ${gpuPct}%"></div>
      <div style="width:${cpuPct}%;background:var(--file-2);" title="CPU-bound ${cpuPct}%"></div>
    </div>
    <div class="chart-legend" style="margin-bottom:10px;">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--file-1)"></span>GPU-bound ${gpuPct}%</span>
      <span class="legend-item"><span class="legend-swatch" style="background:var(--file-2)"></span>CPU-bound ${cpuPct}%</span>
    </div>
    <div class="issue-detail">${verdict}</div>
    <div class="footnote" style="margin-top:6px;">Based on ${sampleCount.toLocaleString()} active frames, comparing per-frame GPU Busy vs. CPU Busy time. A simplified heuristic, not a cycle-accurate profile.</div>`;
}

function stutterPanelHtml(gs) {
  if (!gs.stutter || gs.stutter.activeCount < 20) return '<div class="footnote">Not enough active-gameplay samples to assess frame pacing.</div>';
  const s = gs.stutter;
  const frac = s.count / s.activeCount;
  const tone = frac > 0.2 || s.worstMs > 100 ? 'critical' : frac > 0.08 || s.worstMs > 50 ? 'warning' : 'good';
  return `<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
      <div class="tile" style="flex:1;min-width:140px;">
        <div class="tile-label">Stutter events</div>
        <div class="tile-value-row"><span class="tile-value tnum" style="color:var(--${tone});">${s.count}</span><span class="tile-unit">of ${s.activeCount}</span></div>
      </div>
      <div class="tile" style="flex:1;min-width:140px;">
        <div class="tile-label">Typical frame time</div>
        <div class="tile-value-row"><span class="tile-value tnum">${s.medianMs.toFixed(1)}</span><span class="tile-unit">ms</span></div>
      </div>
      <div class="tile" style="flex:1;min-width:140px;">
        <div class="tile-label">Worst spike</div>
        <div class="tile-value-row"><span class="tile-value tnum" style="color:var(--${tone});">${s.worstMs.toFixed(0)}</span><span class="tile-unit">ms</span></div>
        ${s.worstElapsedMs != null ? `<div class="footnote">at ${fmtElapsed(s.worstElapsedMs)} elapsed</div>` : ''}
      </div>
    </div>
    <div class="footnote" style="margin-top:10px;">A frame counts as a stutter here if it took longer than ${s.thresholdMs.toFixed(0)}ms — roughly double this session's own typical frame time.</div>`;
}

function renderGaming(container, ordered) {
  const newest = ordered[0];
  const gs = gamingSummary(newest);
  if (gs.process) COPY_REGISTRY['gaming-page'] = buildGamingText(ordered);
  container.innerHTML = `<div class="page-head"><div><h1>Gaming</h1><p>Whether frames are actually reaching the screen smoothly, and whether your CPU or GPU is the one holding performance back.</p></div>${gs.process ? copyButtonHtml('gaming-page', 'gaming summary') : ''}</div>`;

  if (!gs.process) {
    container.innerHTML += `<div class="empty-state">${icon('gamepad')}<h4>No PresentMon frame data in this log</h4><p>Enable HWiNFO's PresentMon-based sensors (framerate, frame time, GPU/CPU busy) and capture a log while a game is running to see bottleneck and stutter analysis here.</p></div>`;
    return;
  }

  container.innerHTML += `<div class="panel">
    <div class="panel-head"><h3>Capture target</h3>${captureBadgeHtml(gs)}</div>
    ${!gs.isGame ? `<div class="issue-detail">This log's frame data comes from <b>${escapeHtml(gs.process)}</b>, not a game — the analysis below (and the framerate numbers elsewhere in this tool) reflect desktop/system frame presentation, not gameplay. Load a log captured while a game is running in the foreground for meaningful results.</div>` : `<div class="issue-detail">Frame data below was captured while <b>${escapeHtml(gs.process)}</b> was the active render target.</div>`}
  </div>`;

  container.innerHTML += `<div class="panel"><div class="panel-head"><h3>CPU/GPU bottleneck</h3><span class="sub">most recent log</span></div>${bottleneckPanelHtml(gs)}</div>`;
  container.innerHTML += `<div class="panel"><div class="panel-head"><h3>Frame pacing</h3><span class="sub">most recent log</span></div>${stutterPanelHtml(gs)}</div>`;
  if (gs.pacing) {
    const flagged = gs.isGame && gs.pacing.gapPct > 0.15;
    container.innerHTML += `<div class="panel"><div class="panel-head"><h3>Presented vs. displayed</h3></div>
      <div class="issue-detail">Rendered ${gs.pacing.presentedAvg.toFixed(0)} FPS on average; ${gs.pacing.displayedAvg.toFixed(0)} FPS actually reached the screen (${fmtPct(gs.pacing.gapPct)} ${gs.pacing.gapPct >= 0 ? 'lower' : 'higher'}).</div>
      ${flagged ? '<div class="footnote" style="margin-top:6px;color:var(--warning);">This gap is large enough to suggest dropped/repeated frames — see the issue on the Summary page for suggested fixes.</div>' : '<div class="footnote" style="margin-top:6px;">This is a normal, small gap.</div>'}
    </div>`;
  }

  const fpsGrid = document.createElement('div'); fpsGrid.className = 'metric-grid';
  const gamingChartOpts = { frame_time_avg: { zeroFloor: true, clipPercentile: 0.98 }, fps_avg: { zeroFloor: true, clipPercentile: 0.98 }, fps_1low: { zeroFloor: true, clipPercentile: 0.98 } };
  for (const id of ['frame_time_avg', 'fps_avg', 'fps_1low']) { const card = metricChartCard(id, ordered, gamingChartOpts[id]); if (card) fpsGrid.appendChild(card); }
  container.appendChild(fpsGrid);

  if (ordered.length > 1) {
    const rows = ordered.map(f => ({ f, gs: gamingSummary(f) }));
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `<div class="panel-head"><h3>Across loaded logs</h3></div>
      <div class="table-scroll"><table class="data-table"><thead><tr><th>Log</th><th>Capture target</th><th>GPU-bound</th><th>Stutter events</th><th>Worst spike</th></tr></thead><tbody>
      ${rows.map(({ f, gs: g }) => `<tr>
        <td>${escapeHtml(displayName(f))}</td>
        <td>${g.process ? escapeHtml(g.process) + (g.isGame ? '' : ' (not a game)') : '—'}</td>
        <td class="mono tnum">${g.bottleneck ? Math.round(g.bottleneck.gpuBoundPct * 100) + '%' : '—'}</td>
        <td class="mono tnum">${g.stutter ? g.stutter.count : '—'}</td>
        <td class="mono tnum">${g.stutter ? g.stutter.worstMs.toFixed(0) + ' ms' : '—'}</td>
      </tr>`).join('')}
      </tbody></table></div>`;
    container.appendChild(panel);
  }
}

function memoryConfigPanelHtml(memCfg) {
  if (!memCfg) return '<div class="footnote">No "Memory Clock" sensor was found in this log, so rated-vs-running speed can\'t be checked.</div>';
  const { observedSpeed, observedCAS, rated, mismatch, gapPct } = memCfg;
  if (!rated) {
    return `<div class="issue-detail">This log's memory is running at roughly DDR-${observedSpeed}${observedCAS ? ` CL${observedCAS}` : ''}. The module's marketing label didn't match a pattern this tool can parse for a rated speed, so there's nothing to compare it against — this isn't necessarily a problem, just an unknown.</div>`;
  }
  const tone = !mismatch ? 'good' : gapPct > 0.25 ? 'critical' : 'warning';
  const toneLabel = !mismatch ? 'Running at rated speed' : 'Below rated speed — EXPO/XMP may be off';
  const pct = Math.max(0, Math.min(100, Math.round((observedSpeed / rated.ratedSpeed) * 100)));
  return `
    <div class="sev-pill ${tone === 'good' ? '' : tone}" style="${tone === 'good' ? 'background:var(--good-wash);color:var(--good);' : ''}margin-bottom:12px;"><span class="sw-dot"></span>${toneLabel}</div>
    <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:10px;">
      <div class="tile" style="flex:1;min-width:150px;">
        <div class="tile-label">Rated (module label)</div>
        <div class="tile-value-row"><span class="tile-value tnum">DDR-${rated.ratedSpeed}</span></div>
        ${rated.ratedCAS ? `<div class="footnote">CL${rated.ratedCAS}</div>` : ''}
      </div>
      <div class="tile" style="flex:1;min-width:150px;">
        <div class="tile-label">Observed (this log)</div>
        <div class="tile-value-row"><span class="tile-value tnum" style="color:var(--${tone === 'good' ? 'good' : tone});">DDR-${observedSpeed}</span></div>
        ${observedCAS ? `<div class="footnote">CL${observedCAS}</div>` : ''}
      </div>
    </div>
    <div style="height:8px;border-radius:5px;background:var(--grid);overflow:hidden;margin-bottom:10px;">
      <div style="width:${pct}%;height:100%;background:var(--${tone === 'good' ? 'good' : tone});"></div>
    </div>
    ${mismatch ? `<div class="issue-detail">Running about ${fmtPct(gapPct)} slower than the module's rated speed (inferred from the label <span class="mono">${escapeHtml(rated.sourceLabel)}</span>). This usually means EXPO (AMD) or XMP (Intel) isn't enabled in BIOS, so memory is running near JEDEC default instead of its rated profile — enabling it is one of the highest-value free performance changes available, especially on Ryzen X3D chips. After enabling, run a stability test (e.g. Karhu RAM Test or a few hours of TM5).</div>` : `<div class="issue-detail">Memory is running at (or close to) its rated speed. No action needed here.</div>`}
    <div class="footnote" style="margin-top:8px;">Rated speed/CAS is a best-effort read of the module's marketing part number, not authoritative spec data.</div>`;
}

function renderMemory(container, ordered) {
  COPY_REGISTRY['memory-page'] = buildMemoryText(ordered);
  container.innerHTML = `<div class="page-head"><div><h1>Memory & Storage</h1><p>System RAM pressure and configuration, alongside per-drive SMART health and temperature.</p></div>${copyButtonHtml('memory-page', 'memory and storage')}</div>
  <div class="panel" id="memcfg-panel"><div class="panel-head"><h3>Memory configuration</h3><span class="sub">most recent log</span></div><div id="memcfg-body"></div></div>
  <div id="mem-charts"></div>
  <div class="panel" id="drive-panel"><div class="panel-head"><h3>Drive health</h3><span class="sub">most recent log</span></div><div class="table-scroll" id="drive-table"></div></div>`;

  const newest = ordered[0];
  const memCfg = checkMemoryConfig(newest);
  container.querySelector('#memcfg-body').innerHTML = memoryConfigPanelHtml(memCfg);

  const chartsEl = container.querySelector('#mem-charts');
  const any = renderMetricGroup(chartsEl, ordered, ['ram_load', 'pagefile_use', 'dram_read_bw', 'dram_write_bw'], { zeroFloor: true });
  if (!any) chartsEl.innerHTML = '<div class="footnote">No memory sensors were found in the loaded log(s).</div>';

  const drives = groupDriveColumns(newest);
  const driveTable = container.querySelector('#drive-table');
  if (!drives.length) { driveTable.innerHTML = '<div class="footnote" style="padding:10px 0;">No drive SMART sensors were found.</div>'; }
  else {
    const rowsHtml = drives.map(d => `<tr>
        <td title="${escapeHtml(d.label)}">${escapeHtml(d.shortLabel)}</td>
        <td class="mono tnum">${d.tempMax != null ? fmtValue(d.tempMax, '°C') : '—'}</td>
        <td class="mono tnum">${d.lifeMin != null ? fmtValue(d.lifeMin, '%') : '—'}</td>
        <td class="mono tnum">${d.writesLast != null ? fmtValue(d.writesLast, 'GB') : '—'}</td>
      </tr>`).join('');
    driveTable.innerHTML = `<table class="data-table"><thead><tr><th>Drive</th><th>Peak Temp</th><th>Remaining Life</th><th>Total Host Writes</th></tr></thead><tbody>${rowsHtml}</tbody></table>`;
  }
}

function renderNetwork(container, ordered) {
  COPY_REGISTRY['network-page'] = buildNetworkText(ordered);
  container.innerHTML = `<div class="page-head"><div><h1>Network & PCIe</h1><p>Link throughput plus PCI Express link-error counters, which are a good early signal of a seating or signal-integrity problem.</p></div>${copyButtonHtml('network-page', 'network and PCIe')}</div>
  <div id="net-charts"></div>
  <div class="panel" id="pcie-panel"><div class="panel-head"><h3>PCI Express error counters</h3><span class="sub">most recent log — non-zero is worth investigating</span></div><div class="table-scroll" id="pcie-table"></div></div>`;

  const newest = ordered[0];
  const dlCols = findAllNumeric(newest, /^Current DL rate/i);
  const ulCols = findAllNumeric(newest, /^Current UP rate/i);
  const netChartsEl = container.querySelector('#net-charts');
  const active = [];
  let idleCount = 0;
  dlCols.forEach((col, i) => {
    const ul = ulCols[i];
    const hasTraffic = (col.stats && col.stats.max > 0) || (ul && ul.stats && ul.stats.max > 0);
    if (!hasTraffic) { idleCount++; return; }
    let label = (col.hwLabel || `Adapter ${i + 1}`).replace(/^network:\s*/i, '').split(' - ')[0].trim();
    active.push({ label, col, ul });
  });
  if (active.length) {
    const grid = document.createElement('div'); grid.className = 'metric-grid';
    active.forEach(a => {
      const card = document.createElement('div'); card.className = 'panel chart-card';
      const series = [{ label: 'Download', color: 'var(--file-1)', points: elapsedPoints(newest, a.col) }];
      if (a.ul) series.push({ label: 'Upload', color: 'var(--file-2)', points: elapsedPoints(newest, a.ul) });
      card.innerHTML = `<div class="panel-head"><h3>${escapeHtml(a.label)}</h3><div class="chart-legend">${series.map(s => `<span class="legend-item"><span class="legend-swatch" style="background:${s.color}"></span>${s.label}</span>`).join('')}</div></div><div class="chart-slot"></div>`;
      card.querySelector('.chart-slot').appendChild(buildLineChart(series, { unit: 'KB/s', zeroFloor: true }));
      grid.appendChild(card);
    });
    netChartsEl.appendChild(grid);
    if (idleCount) { const note = document.createElement('div'); note.className = 'footnote'; note.style.marginTop = '10px'; note.textContent = `${idleCount} additional network interface${idleCount > 1 ? 's' : ''} carried no traffic during this log and ${idleCount > 1 ? 'are' : 'is'} hidden.`; netChartsEl.appendChild(note); }
  } else netChartsEl.innerHTML = '<div class="footnote">No network throughput sensors were found in the loaded log(s).</div>';

  const pcieErrPatterns = [/^Correctable Error Count/i, /^Non-Fatal Error Count/i, /^Fatal Error Count/i, /^Bad DLLP Count/i, /^Bad TLP Count/i, /^LCRC Error Count/i, /^Replay Count/i, /^Recovery Count/i, /^Receiver Errors/i, /^NAKs Sent Count/i, /^NAKs Received Count/i];
  const pcieTable = container.querySelector('#pcie-table');
  let rows = [];
  for (const re of pcieErrPatterns) for (const col of findAllNumeric(newest, re)) rows.push([stripUnit(col.name), col.stats.max]);
  if (!rows.length) pcieTable.innerHTML = '<div class="footnote" style="padding:10px 0;">No PCIe error counters were found in this log.</div>';
  else pcieTable.innerHTML = `<table class="data-table"><thead><tr><th>Counter</th><th>Max observed</th></tr></thead><tbody>${rows.map(([n, v]) => `<tr><td>${n}</td><td class="mono tnum">${v > 0 ? `<span class="delta-tag worse">${v}</span>` : '<span class="delta-tag better">0</span>'}</td></tr>`).join('')}</tbody></table>`;
}

// Small colored ↑/↓/→ glyph shown between two adjacent value columns in the Metric
// deltas table, so a trend across 2-4 logs reads left-to-right at a glance without
// having to mentally subtract each pair of numbers.
// Metrics with no inherent "better" direction (power draw, voltage, clocks, usage %)
// intentionally get no glyph at all here, rather than a gray arrow — a colored or
// gray-but-still-arrow-shaped icon reads as a verdict even when it isn't one, which
// is exactly what made these rows look broken instead of "not applicable".
function trendArrowHtml(delta, direction) {
  if (direction === 'neutral') return `<span class="trend-dash" title="No inherent better/worse direction for this metric">–</span>`;
  if (!delta || delta.diff === 0) return `<span class="trend-arrow neutral" title="No meaningful change">→</span>`;
  const arrow = delta.diff > 0 ? '↑' : '↓';
  const pctLabel = delta.pct != null ? `${delta.diff > 0 ? '+' : ''}${delta.pct.toFixed(0)}%` : '';
  return `<span class="trend-arrow ${delta.verdict}" title="${pctLabel}">${arrow}</span>`;
}

// Per-file trim row + the "Full log" / "Gameplay only" toggle. `trimInfo` is
// [{file, detected, range}] built by renderCompare — `detected` is the auto-guess from
// detectGameplayWindow(), `range` is the current (possibly user-adjusted) window, or
// null when detection found nothing to trim for that file.
function trimPanelHtml(trimInfo, trimEnabled) {
  const anyDetected = trimInfo.some(t => t.detected);
  const rows = trimInfo.map(({ file: f, detected, range }) => {
    const dur = f.durationMs;
    if (!detected) {
      return `<div class="trim-row" data-file-id="${f.id}">
        <div class="trim-row-head">
          <span class="dot" style="background:${f.color}"></span>
          <span class="trim-filename">${escapeHtml(displayName(f))}</span>
          <span class="trim-summary footnote">No frame-render activity detected — using the full log.</span>
        </div>
      </div>`;
    }
    const r = range || { startMs: detected.startMs, endMs: detected.endMs };
    const startPct = dur > 0 ? (r.startMs / dur) * 100 : 0;
    const endPct = dur > 0 ? (r.endMs / dur) * 100 : 100;
    const trimmedDur = Math.max(0, r.endMs - r.startMs);
    return `<div class="trim-row" data-file-id="${f.id}" data-duration-ms="${dur}">
      <div class="trim-row-head">
        <span class="dot" style="background:${f.color}"></span>
        <span class="trim-filename">${escapeHtml(displayName(f))}</span>
        <span class="trim-summary footnote" data-trim-summary>${fmtDur(trimmedDur)} of ${fmtDur(dur)} (${dur > 0 ? Math.round(trimmedDur / dur * 100) : 0}%)</span>
        <button class="btn ghost trim-reset" data-id="${f.id}" title="Reset to the auto-detected window">${icon('crop')}<span>Reset</span></button>
      </div>
      <div class="trim-slider-wrap">
        <div class="trim-track"><div class="trim-fill" data-trim-fill style="left:${startPct}%;right:${100 - endPct}%;"></div></div>
        <input type="range" class="trim-range trim-range-start" data-role="start" min="0" max="${dur}" step="1000" value="${r.startMs}">
        <input type="range" class="trim-range trim-range-end" data-role="end" min="0" max="${dur}" step="1000" value="${r.endMs}">
      </div>
      <div class="trim-labels footnote"><span data-trim-start>${fmtElapsed(r.startMs)}</span><span data-trim-end>${fmtElapsed(r.endMs)}</span></div>
    </div>`;
  }).join('');

  return `<div class="panel">
    <div class="panel-head" style="flex-wrap:wrap;gap:10px;"><h3>Gameplay window</h3><div class="profile-toggle">
      <button class="profile-btn ${!trimEnabled ? 'active' : ''}" data-trim-mode="full">Full log</button>
      <button class="profile-btn ${trimEnabled ? 'active' : ''}" data-trim-mode="trimmed"${anyDetected ? '' : ' disabled title="No frame-render activity detected in any loaded log"'}>Gameplay only</button>
    </div></div>
    <p class="footnote" style="margin:-4px 0 12px;">Trims each log to when a game was actually rendering frames, detected automatically from the same frame-time data the Gaming tab uses — drag a handle below to fine-tune. Everything else in the app still uses the full recorded log; this only affects the comparison below.</p>
    ${trimEnabled ? `<div class="trim-rows">${rows}</div>` : ''}
  </div>`;
}

function renderCompare(container, ordered) {
  // The rest of the app treats "ordered" as newest-first (priority) — the Compare
  // table specifically shows logs oldest -> newest, left to right, so the trend
  // arrows and column order read the same direction as time.
  const chronoFull = ordered.slice().reverse();
  container.innerHTML = `<div class="page-head"><div><h1>Compare Logs</h1><p>${ordered.length < 2 ? 'Load a second log to see a side-by-side differential.' : `${ordered.length} logs, oldest to newest, left to right. Arrows show the trend between each capture.`}</p></div>${ordered.length >= 2 ? copyButtonHtml('compare-page', 'comparison') : ''}</div>`;
  container.innerHTML += `<details class="tips-panel">
    <summary>${icon('lightbulb')}<span>Tips for a comparison you can trust</span></summary>
    ${tipListHtml(TESTING_TIPS)}
  </details>`;
  if (ordered.length < 2) {
    container.innerHTML += `<div class="empty-state">${icon('compare')}<h4>Nothing to compare yet</h4><p>Add up to 4 logs and this view will show which readings improved, worsened, or stayed the same between captures — plus which issues are new, resolved, or persistent.</p></div>`;
    return;
  }

  // ---- Optional gameplay-window trim: everything below this point uses `chrono` /
  // `orderedCompare`, which are either the raw loaded files or a per-file trimmed view
  // (buildTrimmedFileView), depending on STATE.trimMode. Detection is cached into
  // STATE.trimRanges per file id so a manual drag survives re-renders (profile switch,
  // removing another file, etc.) until the user hits Reset.
  const trimEnabled = STATE.trimMode === 'trimmed';
  const trimInfo = chronoFull.map(f => {
    const detected = (typeof detectGameplayWindow === 'function') ? detectGameplayWindow(f) : null;
    let range = STATE.trimRanges[f.id];
    if (!range && detected) { range = { startMs: detected.startMs, endMs: detected.endMs }; STATE.trimRanges[f.id] = range; }
    return { file: f, detected, range };
  });
  const trimPanel = trimPanelHtml(trimInfo, trimEnabled);
  function trimmedOrOriginal(f) {
    if (!trimEnabled) return f;
    const info = trimInfo.find(t => t.file.id === f.id);
    if (!info || !info.range) return f;
    return (typeof buildTrimmedFileView === 'function') ? buildTrimmedFileView(f, info.range.startMs, info.range.endMs) : f;
  }
  const chrono = chronoFull.map(trimmedOrOriginal);
  const orderedCompare = ordered.map(trimmedOrOriginal);

  const cmpRows = buildComparison(chrono);
  const { all, perFileIssues } = topIssuesAcrossFiles(orderedCompare);
  const scoreResult = (typeof computeCompositeScores === 'function') ? computeCompositeScores(orderedCompare, STATE.scoreProfile) : null;
  const cmpBest = scoreResult && scoreResult.bestId ? { id: scoreResult.bestId } : null;

  const CATEGORY_LABELS = { thermals: 'Thermals', power: 'Power', performance: 'Performance' };
  const scoreTone = (v) => v == null ? 'neutral' : v >= 70 ? 'better' : v <= 35 ? 'worse' : 'neutral';
  const durations = chrono.map(f => f.durationMs).filter(d => d > 0);
  const minDur = durations.length ? Math.min(...durations) : 0;
  const maxDur = durations.length ? Math.max(...durations) : 0;
  const durationMismatch = minDur > 0 && (maxDur / minDur) > 1.15;
  let verdictPanel = '';
  if (scoreResult) {
    const byId = new Map(scoreResult.perFile.map(p => [p.id, p]));
    const profileButtons = Object.entries(SCORING_PROFILES).map(([key, p]) =>
      `<button class="profile-btn ${STATE.scoreProfile === key ? 'active' : ''}" data-profile="${key}">${escapeHtml(p.label)}</button>`
    ).join('');
    const cards = chrono.map(f => {
      const s = byId.get(f.id);
      if (!s) return '';
      const isBest = cmpBest && cmpBest.id === f.id;
      const rows = scoreResult.categories.map(cat => {
        const basis = (typeof categoryScoreBasis === 'function') ? categoryScoreBasis(cat) : null;
        const tooltip = (typeof categoryScoreTooltip === 'function') ? categoryScoreTooltip(cat) : '';
        return `<div class="vc-row" title="${escapeHtml(tooltip)}"><span>${CATEGORY_LABELS[cat]}${basis ? ` <span class="cat-basis">${basis}</span>` : ''}</span><span class="vc-val ${scoreTone(s.breakdown[cat])}">${s.breakdown[cat] == null ? '—' : s.breakdown[cat]}</span></div>`;
      }).join('');
      return `<div class="verdict-card ${isBest ? 'is-best' : ''}">
        <div class="vc-head">${isBest ? `<span class="best-star">${icon('star')}</span>` : ''}<span>${escapeHtml(displayName(f).slice(0, 22))}</span></div>
        <div class="vc-score ${scoreTone(s.composite)}">${s.composite}</div>
        ${rows}
      </div>`;
    }).join('');
    verdictPanel = `<div class="panel">
      <div class="panel-head" style="flex-wrap:wrap;gap:10px;"><h3>Run Verdict</h3><div class="profile-toggle">${profileButtons}</div></div>
      <p class="footnote" style="margin:-4px 0 12px;">Composite score per run (100 = best of the loaded logs), weighted by the profile above. Scores are relative to just these logs, not an absolute grade. <b>Thermals</b> is scored on each run's <b>peak</b> temperature (worst-case risk); <b>Power</b> and <b>Performance</b> are scored on session <b>averages</b> — hover a row for exactly what feeds it. A run can have a cooler average and still lose on Thermals if it had one brief hotter spike.${chrono.length === 2 ? ` With exactly two logs loaded, each metric is scored on how big the gap actually is (a near-tie lands near 50/50; only a difference of ${Math.round(TWO_RUN_DECISIVE_PCT * 100)}% or more scores as a full win/loss) rather than always giving the smaller value all the credit.` : ''}</p>
      ${durationMismatch ? `<div class="duration-warn">${icon('alert')}<div>These runs have noticeably different durations (${fmtDur(minDur)} vs ${fmtDur(maxDur)}) — a longer session has more opportunity to contain a brief spike a shorter one wouldn't see, which skews peak-based scores like Thermals. See the tips above for a closer apples-to-apples comparison.</div></div>` : ''}
      <div class="verdict-cards">${cards}</div>
    </div>`;
  }

  const colHeaders = chrono.map((f, i) => {
    const isBest = cmpBest && cmpBest.id === f.id;
    const th = `<th>
      <div style="display:flex;align-items:center;gap:5px;white-space:nowrap;">
        ${isBest ? `<span class="best-star" title="Best overall run">${icon('star')}</span>` : ''}
        <span>${escapeHtml(displayName(f).slice(0, 22))} <span class="footnote">(${fmtDur(f.durationMs)})</span></span>
        <button class="btn ghost col-remove" data-id="${f.id}" title="Remove this log from the comparison" style="padding:2px;margin-left:2px;">${icon('x')}</button>
      </div>
    </th>`;
    return i > 0 ? `<th class="delta-arrow-col"></th>${th}` : th;
  }).join('');
  const bestNote = cmpBest ? ` · <span class="best-star">${icon('star')}</span> = best overall` : '';
  let table = `<div class="panel"><div class="panel-head"><h3>Metric deltas</h3><span class="sub">avg value per log, oldest → newest${bestNote} · <span class="trend-dash">–</span> = no better/worse direction for that metric</span></div><div class="table-scroll"><table class="data-table"><thead><tr><th>Metric</th>${colHeaders}<th>Net change</th></tr></thead><tbody>`;
  for (const row of cmpRows) {
    table += `<tr><td>${row.label}</td>`;
    row.perFile.forEach((p, i) => {
      if (i > 0) table += `<td class="delta-arrow-col">${trendArrowHtml(row.deltas[i - 1], row.direction)}</td>`;
      table += `<td class="mono tnum">${p ? fmtValue(p.avg, row.unit) : '—'}</td>`;
    });
    const net = computeMetricDelta(row.perFile[0], row.perFile[row.perFile.length - 1], row.direction);
    if (net) {
      const sign = net.diff > 0 ? '+' : '';
      const valueStr = `${sign}${fmtValue(net.diff, row.unit)}${net.pct != null ? ` (${sign}${net.pct.toFixed(0)}%)` : ''}`;
      table += row.direction === 'neutral'
        ? `<td class="mono tnum trend-dash-cell">${valueStr}</td>`
        : `<td><span class="delta-tag ${net.verdict}">${valueStr}</span></td>`;
    } else table += '<td>—</td>';
    table += '</tr>';
  }
  table += '</tbody></table></div></div>';

  const newFindings = all.filter(a => a.inNewest && a.fileCount === 1);
  const persistent = all.filter(a => a.fileCount === ordered.length && ordered.length > 1);
  const resolved = all.filter(a => !a.inNewest);
  let issueDiff = `<div class="panel"><div class="panel-head"><h3>Issue timeline</h3></div>
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div><div class="tile-label" style="margin-bottom:8px;">New in latest log (${newFindings.length})</div>${newFindings.length ? `<div class="issue-list">${newFindings.map(f => issueCardHtml(f)).join('')}</div>` : '<div class="footnote">None.</div>'}</div>
      <div><div class="tile-label" style="margin-bottom:8px;">Persistent across all logs (${persistent.length})</div>${persistent.length ? `<div class="issue-list">${persistent.map(f => issueCardHtml(f)).join('')}</div>` : '<div class="footnote">None.</div>'}</div>
      <div><div class="tile-label" style="margin-bottom:8px;">Present earlier, not in latest log (${resolved.length})</div>${resolved.length ? `<div class="issue-list">${resolved.map(f => issueCardHtml(f)).join('')}</div>` : '<div class="footnote">None.</div>'}</div>
    </div>
  </div>`;

  COPY_REGISTRY['compare-page'] = buildCompareText(chrono, cmpRows, scoreResult, newFindings, persistent, resolved, trimEnabled);
  container.innerHTML += trimPanel + verdictPanel + table + issueDiff;
  container.querySelectorAll('.col-remove').forEach(btn => btn.addEventListener('click', () => removeFile(btn.dataset.id)));
  container.querySelectorAll('.profile-btn').forEach(btn => btn.addEventListener('click', () => {
    if (btn.disabled) return;
    if (btn.dataset.profile) STATE.scoreProfile = btn.dataset.profile;
    else if (btn.dataset.trimMode) STATE.trimMode = btn.dataset.trimMode;
    render();
  }));
  container.querySelectorAll('.trim-reset').forEach(btn => btn.addEventListener('click', () => {
    delete STATE.trimRanges[btn.dataset.id];
    render();
  }));
  // Sliders update their own row live on `input` (dragging) without a full re-render —
  // re-rendering the whole page mid-drag would destroy the handle the user is holding.
  // The expensive recompute (deltas/verdict/issues) only happens on `change`, once the
  // user releases the handle.
  container.querySelectorAll('.trim-row[data-duration-ms]').forEach(row => {
    const fileId = row.dataset.fileId;
    const durMs = Number(row.dataset.durationMs);
    const startInput = row.querySelector('.trim-range-start');
    const endInput = row.querySelector('.trim-range-end');
    const fill = row.querySelector('[data-trim-fill]');
    const startLabel = row.querySelector('[data-trim-start]');
    const endLabel = row.querySelector('[data-trim-end]');
    const summary = row.querySelector('[data-trim-summary]');
    const MIN_GAP_MS = 5000;
    const syncLocal = () => {
      let s = Number(startInput.value), e = Number(endInput.value);
      if (s > e - MIN_GAP_MS) {
        // keep a minimum gap by pushing back whichever handle the user isn't holding
        if (document.activeElement === startInput) e = Math.min(durMs, s + MIN_GAP_MS);
        else s = Math.max(0, e - MIN_GAP_MS);
        startInput.value = s; endInput.value = e;
      }
      const startPct = durMs > 0 ? (s / durMs) * 100 : 0;
      const endPct = durMs > 0 ? (e / durMs) * 100 : 100;
      fill.style.left = `${startPct}%`; fill.style.right = `${100 - endPct}%`;
      startLabel.textContent = fmtElapsed(s); endLabel.textContent = fmtElapsed(e);
      if (summary) summary.textContent = `${fmtDur(e - s)} of ${fmtDur(durMs)} (${durMs > 0 ? Math.round((e - s) / durMs * 100) : 0}%)`;
      return { s, e };
    };
    [startInput, endInput].forEach(inp => {
      inp.addEventListener('input', syncLocal);
      inp.addEventListener('change', () => {
        const { s, e } = syncLocal();
        STATE.trimRanges[fileId] = { startMs: s, endMs: e };
        render();
      });
    });
  });
}

const RAW_PAGE_SIZE = 40;
function renderRaw(container, ordered) {
  if (!STATE.raw.fileId || !ordered.find(f => f.id === STATE.raw.fileId)) STATE.raw.fileId = ordered[0].id;
  const file = STATE.files.find(f => f.id === STATE.raw.fileId);
  container.innerHTML = `<div class="page-head"><div><h1>Raw Data</h1><p>Browse the parsed columns directly — useful for metrics this tool doesn't chart yet.</p></div></div>
  <div class="panel">
    <div class="search-row" style="margin-bottom:14px;">
      <select id="raw-file-select">${STATE.files.map(f => `<option value="${f.id}" ${f.id === file.id ? 'selected' : ''}>${escapeHtml(displayName(f))}</option>`).join('')}</select>
      <input type="search" id="raw-search" placeholder="Search columns…" value="${escapeHtml(STATE.raw.search)}" style="min-width:220px;">
      <span class="footnote">${file.columns.length} columns · ${file.nRows.toLocaleString()} rows</span>
    </div>
    <div id="raw-table-slot"></div>
    <div class="search-row" style="margin-top:12px;justify-content:flex-end;" id="raw-pager"></div>
  </div>`;

  const q = STATE.raw.search.trim().toLowerCase();
  const matchCols = file.columns.filter(c => c.index > 1 && (!q || c.name.toLowerCase().includes(q))).slice(0, 14);
  const totalPages = Math.max(1, Math.ceil(file.nRows / RAW_PAGE_SIZE));
  STATE.raw.page = Math.min(STATE.raw.page, totalPages - 1);
  const startRow = STATE.raw.page * RAW_PAGE_SIZE;
  const endRow = Math.min(file.nRows, startRow + RAW_PAGE_SIZE);

  const tableSlot = container.querySelector('#raw-table-slot');
  if (!matchCols.length) {
    tableSlot.innerHTML = '<div class="footnote" style="padding:16px 0;">No columns match that search.</div>';
  } else {
    let html = `<div class="table-scroll"><table class="data-table"><thead><tr><th>Time</th>${matchCols.map(c => `<th title="${escapeHtml(c.name)}">${escapeHtml(stripUnit(c.name))}${c.unit ? ` <span style="opacity:.6;font-weight:400;">[${escapeHtml(c.unit)}]</span>` : ''}</th>`).join('')}</tr></thead><tbody>`;
    for (let r = startRow; r < endRow; r++) {
      const t = file.timestamps[r];
      html += `<tr><td class="mono tnum">${t ? t.toLocaleTimeString() : '—'}</td>${matchCols.map(c => `<td class="mono tnum">${c.isNumeric ? (c.series[r] == null ? '—' : fmtValue(c.series[r], '')) : (c.isBoolean ? '—' : '')}</td>`).join('')}</tr>`;
    }
    html += '</tbody></table></div>';
    tableSlot.innerHTML = html;
  }
  container.querySelector('#raw-pager').innerHTML = `
    <button class="btn ghost" id="raw-prev" ${STATE.raw.page === 0 ? 'disabled' : ''}>Prev</button>
    <span class="footnote mono tnum">Rows ${startRow + 1}–${endRow} of ${file.nRows.toLocaleString()}</span>
    <button class="btn ghost" id="raw-next" ${STATE.raw.page >= totalPages - 1 ? 'disabled' : ''}>Next</button>`;

  container.querySelector('#raw-file-select').addEventListener('change', (e) => { STATE.raw.fileId = e.target.value; STATE.raw.page = 0; renderRaw(container, ordered); });
  container.querySelector('#raw-search').addEventListener('input', (e) => { STATE.raw.search = e.target.value; STATE.raw.page = 0; renderRaw(container, ordered); });
  container.querySelector('#raw-prev').addEventListener('click', () => { STATE.raw.page--; renderRaw(container, ordered); });
  container.querySelector('#raw-next').addEventListener('click', () => { STATE.raw.page++; renderRaw(container, ordered); });
}

// Plain-text summary of the current session — meant to be pasted into a forum post,
// a support ticket, or a chat with a friend. The artifact-hosting sandbox blocks
// script-driven file downloads, so this is copy-to-clipboard rather than a .txt export.
function buildReportText(ordered) {
  const newest = ordered[0];
  const km = resolveKeyMetrics(newest);
  const lines = [];
  lines.push('HWiNFO DIAGNOSTIC REPORT');
  lines.push(`Generated ${new Date().toLocaleString()}`);
  lines.push('');

  lines.push('LOGS LOADED' + (ordered.length > 1 ? ' (newest first)' : ''));
  for (const f of ordered) {
    lines.push(`- ${displayName(f)}: ${fmtDate(f.startTime)} to ${fmtDate(f.endTime)} (${fmtDur(f.durationMs)}, ${f.nRows.toLocaleString()} samples)`);
  }
  lines.push('');

  const sys = newest.systemInfo || {};
  if (sys.cpu || sys.gpus.length || sys.motherboard || sys.ram.length) {
    lines.push('SYSTEM (from ' + displayName(newest) + ')');
    if (sys.cpu) lines.push(`CPU: ${sys.cpu}`);
    if (sys.gpus.length) lines.push(`GPU: ${sys.gpus.join(', ')}`);
    if (sys.motherboard) lines.push(`Motherboard: ${sys.motherboard}`);
    if (sys.ram.length) lines.push(`Memory: ${sys.ram.join(', ')}`);
    if (sys.drives.length) lines.push(`Storage: ${sys.drives.join('; ')}`);
    lines.push('');
  }

  const { cpuSpec, gpuSpec } = (typeof getHardwareSpecs === 'function') ? getHardwareSpecs(newest) : {};
  if (cpuSpec || gpuSpec) {
    lines.push('HARDWARE HEADROOM (vs. approximate factory-stock spec)');
    if (cpuSpec) {
      lines.push(`${cpuSpec.name}:`);
      if (km.cpu_temp) lines.push(`  Peak temp: ${km.cpu_temp.stats.max.toFixed(1)}C  (~${cpuSpec.tjMaxC}C typical throttle point)`);
      if (km.cpu_power) lines.push(`  Peak power: ${km.cpu_power.stats.max.toFixed(0)}W  (~${cpuSpec.pptW}W stock power limit)`);
    }
    if (gpuSpec) {
      lines.push(`${gpuSpec.name}:`);
      if (km.gpu_temp) lines.push(`  Peak temp: ${km.gpu_temp.stats.max.toFixed(1)}C  (~${gpuSpec.coreThrottleC}C typical throttle point)`);
      if (km.gpu_power) lines.push(`  Peak power: ${km.gpu_power.stats.max.toFixed(0)}W  (~${gpuSpec.tbpW}W reference board power)`);
    }
    lines.push('');
  }

  const { top } = topIssuesAcrossFiles(ordered);
  lines.push(`TOP ISSUES (${top.length})`);
  if (!top.length) lines.push('No significant issues detected across the loaded log(s).');
  else top.forEach((t, i) => {
    lines.push(`${i + 1}. [${t.severity.toUpperCase()}] ${t.title}`);
    lines.push(`   ${t.detail}`);
    lines.push(`   Suggested fix: ${t.suggestion}`);
  });
  lines.push('');

  const gs = (typeof gamingSummary === 'function') ? gamingSummary(newest) : null;
  if (gs && gs.process) {
    lines.push('GAMING (most recent log)');
    lines.push(`Capture target: ${gs.process}${gs.isGame ? '' : ' (not a game — desktop/system capture)'}`);
    if (gs.bottleneck) lines.push(`Bottleneck: GPU-bound ${Math.round(gs.bottleneck.gpuBoundPct * 100)}% / CPU-bound ${Math.round((1 - gs.bottleneck.gpuBoundPct) * 100)}% of active frames`);
    if (gs.stutter) lines.push(`Stutters: ${gs.stutter.count} of ${gs.stutter.activeCount} active frames exceeded ${gs.stutter.thresholdMs.toFixed(0)}ms (worst ${gs.stutter.worstMs.toFixed(0)}ms)`);
    if (gs.pacing) lines.push(`Presented ${gs.pacing.presentedAvg.toFixed(0)} FPS vs. displayed ${gs.pacing.displayedAvg.toFixed(0)} FPS (${fmtPct(gs.pacing.gapPct)} gap)`);
    lines.push('');
  }

  const memCfg = (typeof checkMemoryConfig === 'function') ? checkMemoryConfig(newest) : null;
  if (memCfg && memCfg.rated) {
    lines.push('MEMORY CONFIGURATION (most recent log)');
    lines.push(`Rated (from module label "${memCfg.rated.sourceLabel}"): DDR-${memCfg.rated.ratedSpeed}${memCfg.rated.ratedCAS ? ' CL' + memCfg.rated.ratedCAS : ''}`);
    lines.push(`Observed in this log: DDR-${memCfg.observedSpeed}${memCfg.observedCAS ? ' CL' + memCfg.observedCAS : ''}`);
    lines.push(memCfg.mismatch ? `Likely EXPO/XMP not enabled — running ${fmtPct(memCfg.gapPct)} below rated speed.` : 'Running at or near its rated speed.');
    lines.push('');
  }

  if (ordered.length > 1) {
    const cmpRows = buildComparison(ordered).filter(r => r.delta);
    if (cmpRows.length) {
      lines.push(`METRIC CHANGES (${displayName(ordered[0])} vs. ${displayName(ordered[1])}, avg values)`);
      for (const r of cmpRows) {
        const newer = r.perFile[0], older = r.perFile[1];
        lines.push(`${r.label}: ${fmtValue(newer.avg, r.unit)} (was ${fmtValue(older.avg, r.unit)}) — ${r.delta.verdict}`);
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push('Generated by the HWiNFO Diagnostic tool. All parsing and analysis happens locally in the browser; log files are never uploaded anywhere.');
  return lines.join('\n');
}

function renderReport(container, ordered) {
  const text = buildReportText(ordered);
  container.innerHTML = `<div class="page-head">
      <div><h1>Report</h1><p>A plain-text summary of this session — system spec, top issues, and key findings — ready to paste into a forum post, support ticket, or chat.</p></div>
      <button class="btn primary" id="btn-copy-report">${icon('clipboard')}<span>Copy to clipboard</span></button>
    </div>
    <div class="panel"><pre class="report-pre" id="report-pre"></pre></div>`;
  container.querySelector('#report-pre').textContent = text;
  container.querySelector('#btn-copy-report').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Report copied to clipboard.');
    } catch (err) {
      // Clipboard API can be blocked in some sandboxed/embedded contexts — fall back to
      // selecting the text so the user can copy it themselves with Ctrl/Cmd+C.
      const pre = container.querySelector('#report-pre');
      const range = document.createRange();
      range.selectNodeContents(pre);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      showToast('Clipboard access is blocked here — the text is selected, press Ctrl/Cmd+C to copy.', 'error');
    }
  });
}

function renderEmptyShell() {
  els.content.innerHTML = `<div class="page-head"><div><h1>Rig Diagnostic</h1><p>Upload up to 4 HWiNFO CSV logs to get a health check, threshold-based issue detection, and a differential comparison across sessions.</p></div></div>
  <div class="dropzone" id="dropzone">
    ${icon('upload')}
    <h4>Drop HWiNFO CSV logs here</h4>
    <p>or click to browse — up to 4 files, newest is treated as priority</p>
  </div>`;
  const dz = document.getElementById('dropzone');
  dz.addEventListener('click', () => els.fileInput.click());
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('drag'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag'));
  dz.addEventListener('drop', () => dz.classList.remove('drag'));
}

function renderSettings(container) {
  const themeOptions = [
    { key: 'system', label: 'System', hint: 'Follow your OS setting' },
    { key: 'light', label: 'Light', hint: '' },
    { key: 'dark', label: 'Dark', hint: '' },
  ];
  const profileEntries = (typeof SCORING_PROFILES !== 'undefined') ? Object.entries(SCORING_PROFILES) : [];

  container.innerHTML = `
    <div class="page-head"><div><h1>Settings</h1><p>Preferences, links, and a quick guide to the tool.</p></div></div>

    <div class="panel">
      <div class="panel-head"><h3>Appearance</h3></div>
      <div class="tile-label" style="margin-bottom:8px;">Theme</div>
      <div class="profile-toggle" id="settings-theme-toggle">
        ${themeOptions.map(t => `<button class="profile-btn ${STATE.theme === t.key ? 'active' : ''}" data-theme-opt="${t.key}">${t.label}</button>`).join('')}
      </div>
      <p class="footnote" style="margin:10px 0 0;">"System" follows your browser/OS light-dark setting automatically. This choice is remembered on this device only.</p>

      ${profileEntries.length ? `
      <div class="tile-label" style="margin:18px 0 8px;">Default "best run" scoring profile</div>
      <div class="profile-toggle" id="settings-score-toggle">
        ${profileEntries.map(([key, p]) => `<button class="profile-btn ${STATE.scoreProfile === key ? 'active' : ''}" data-score-opt="${key}">${escapeHtml(p.label)}</button>`).join('')}
      </div>
      <p class="footnote" style="margin:10px 0 0;">Used to pick the ★ best-overall run in Compare Logs. You can also switch it per-session from the Compare Logs page itself.</p>
      ` : ''}
    </div>

    <div class="panel">
      <div class="panel-head"><h3>Limits</h3></div>
      <p class="footnote" style="margin:0;">Up to 4 logs can be loaded and compared at once, to keep the comparison table and charts readable. This is currently fixed, not configurable.</p>
    </div>

    <div class="panel">
      <div class="panel-head"><h3>How to use this tool</h3></div>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div><div class="tile-label" style="margin-bottom:4px;">1. Capture a log in HWiNFO</div><p class="footnote" style="margin:0;">Open HWiNFO's Sensors window, click "Start Logging," and save a .csv — ideally while doing whatever you want to diagnose (a game session, a stress test, idle). Longer logs give more reliable averages.</p></div>
        <div><div class="tile-label" style="margin-bottom:4px;">2. Load it here</div><p class="footnote" style="margin:0;">Drag the .csv onto this page, or use "Add log" in the top bar. Everything is parsed locally in your browser — the file is never uploaded anywhere.</p></div>
        <div><div class="tile-label" style="margin-bottom:4px;">3. Read the Summary</div><p class="footnote" style="margin:0;">Start on the Summary page — it surfaces your top issues, hardware headroom vs. stock spec, and at-a-glance stats. The other pages (Thermals, Power, Performance, Gaming, Memory, Network) go deeper on one topic each.</p></div>
        <div><div class="tile-label" style="margin-bottom:4px;">4. Compare runs</div><p class="footnote" style="margin:0;">Load up to 4 logs (e.g. before/after a config change) and open Compare Logs for a side-by-side metric table, trend arrows, and a Run Verdict score so you can tell whether a change actually helped. If you're testing a game, the "Gameplay window" panel there can trim each log to just when frames were actually rendering, so menu time and alt-tabbing before/after the session don't skew the comparison.</p></div>
        <div><div class="tile-label" style="margin-bottom:4px;">5. Share a Report</div><p class="footnote" style="margin:0;">The Report page turns your findings into plain text you can paste into a forum post or support thread.</p></div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head"><h3>Tips for best results</h3><span class="sub">getting a before/after comparison you can trust</span></div>
      ${tipListHtml(TESTING_TIPS)}
    </div>

    <div class="panel">
      <div class="panel-head"><h3>About</h3></div>
      <p class="footnote" style="margin:0 0 10px;">Rig Diagnostic — BETA · v${escapeHtml(PROJECT_LINKS.version)}</p>
      <p class="footnote" style="margin:0 0 10px;">Free and open source, licensed under the MIT License. Everything runs client-side in your browser — no server, no accounts, no telemetry, and your log files are never uploaded anywhere.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <a class="btn ghost" href="${PROJECT_LINKS.github}" target="_blank" rel="noopener">${icon('github')}<span>Source on GitHub</span></a>
        <a class="btn ghost" href="${PROJECT_LINKS.coffee}" target="_blank" rel="noopener">${icon('coffee')}<span>Buy me a coffee</span></a>
      </div>
    </div>
  `;

  container.querySelector('#settings-theme-toggle').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-opt]'); if (!btn) return;
    setTheme(btn.dataset.themeOpt);
  });
  const scoreToggle = container.querySelector('#settings-score-toggle');
  if (scoreToggle) scoreToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-score-opt]'); if (!btn) return;
    STATE.scoreProfile = btn.dataset.scoreOpt;
    render();
  });
}

function render() {
  renderBannerLinks();
  renderTopbar();
  document.querySelectorAll('.view').forEach(v => v.remove());
  if (!STATE.files.length) { renderEmptyShell(); renderNavBadges(); return; }
  const ordered = getOrdered();
  const view = document.createElement('div');
  view.className = 'view active';
  els.content.innerHTML = '';
  els.content.appendChild(view);
  ({
    summary: renderSummary, thermals: renderThermals, power: renderPower, perf: renderPerf, gaming: renderGaming,
    memory: renderMemory, network: renderNetwork, compare: renderCompare, report: renderReport, raw: renderRaw,
    settings: renderSettings,
  })[STATE.activeView](view, ordered);
  renderNavBadges();
}

initShell();
render();
