# Rig Diagnostic

A single-file, client-side HWiNFO log analyzer. Drop in an HWiNFO CSV sensor log and get a plain-English summary of what's going on with your PC — thermals, power, performance, gaming frame pacing, memory config — plus side-by-side comparisons across up to 4 logs so you can tell whether a hardware or BIOS change actually helped.

**Status: BETA.** This is a hobby project shared for free with a small group of friends for now. Feedback and bug reports are welcome — see [Issues](../../issues).

**[Open the tool](https://YOUR-USERNAME.github.io/rig-diagnostic/)** — nothing to install, runs entirely in your browser. (If that link 404s, GitHub Pages may still be deploying — give it a minute after the repo is set up.)

## Why

HWiNFO is a fantastic free sensor-logging tool, but its raw CSV output isn't easy to read at a glance, and there's no built-in way to compare two logging sessions side by side. This tool takes that CSV and turns it into something you can actually act on: what's too hot, what's underperforming, what changed between two test runs, and what to try next.

## Dependencies & downloads — what you actually need

Short version: a browser, and HWiNFO to produce the logs. Nothing else.

| What | Do you need it? | Where to get it |
|---|---|---|
| A modern browser (Chrome, Edge, Firefox, Safari) | Yes — this is the entire runtime | Whatever you already have installed |
| [HWiNFO](https://www.hwinfo.com/download/) (free) | Yes — this is what produces the `.csv` log files the tool reads | https://www.hwinfo.com/download/ |
| An account, server, install, or license key | No | — |
| Node.js / npm | No, unless you want to edit the source and rebuild it | https://nodejs.org (only for `Development`, below) |
| An internet connection | No, once the page has loaded once (it's a static file; the one external asset is a Google Fonts stylesheet, which fails silently and falls back to a system font if you're offline) | — |

There are no npm packages, no backend, no database, and nothing to configure. `index.html` is a single, complete, offline-capable file — everything the tool needs is already inside it.

## Getting started

1. Download and install [HWiNFO](https://www.hwinfo.com/download/) if you don't already have it (it's free; grab the regular installer, not "Portable" unless you prefer that).
2. Open the tool — use the [live link](https://YOUR-USERNAME.github.io/rig-diagnostic/) above, or download `index.html` and double-click it. Either way it's the same file, running entirely in your browser: no install, no server, no build step.
3. In HWiNFO, open the Sensors window, click **Start Logging**, and save a `.csv` — ideally while doing whatever you want to diagnose (a game session, a stress test, idle).
4. Drag that `.csv` onto the page, or use the **Add log** button.
5. Start on the **Summary** page for the headline findings, then dig into Thermals / Power / Performance / Gaming / Memory / Network as needed. Most panels have a small **Copy** button in the corner — it copies that section as plain text, handy for pasting into a search engine, a forum post, or an AI chat if you want a second opinion.
6. Load a second (or third, or fourth) log and open **Compare Logs** to see what changed — trend arrows, a per-run "Run Verdict" score across thermals/power/performance, and an issue timeline showing what's new, resolved, or persistent.

There's a full walkthrough in the in-app **Settings** page.

## Tips for best results

Comparisons are only as good as the two runs you're comparing. A few things worth controlling for before you trust a "this helped" or "this didn't help" verdict — the same advice is built into the app itself, as a collapsible panel on the Compare Logs page and in full on the Settings page:

- **Match your environment.** Test at a similar time of day and room temperature, and note things like AC, open windows, or the season. Ambient swings alone can shift CPU/GPU temps by several degrees between two otherwise "identical" runs.
- **Change one thing at a time.** If you're testing a new fan curve, don't also update GPU drivers or tweak BIOS settings in the same pass — otherwise you won't know which change actually caused the difference you see.
- **Same workload, same length.** Use the same benchmark, save file, or game section each time, for a similar duration. A different map, area, or run length changes the numbers on its own, independent of any hardware or setting change.
- **Let it warm up first.** Start logging a couple of minutes into the load, not from a cold boot. Comparing a cold run to a warmed-up run makes a real change look bigger (or smaller) than it actually is.
- **Games are especially noisy.** Procedurally generated or multiplayer maps, bots vs. real players, and per-match AI/physics load all vary run to run, even in "the same" game. Prefer a fixed benchmark mode or a scripted offline route when one exists, and treat FPS deltas from live multiplayer matches as a rough signal, not a precise measurement.
- **Keep software state consistent.** Same Windows power plan, same GPU driver version, and the same background apps (Discord, browser tabs, overlays, Windows Update) running — or closed — the same way across every run you compare.
- **Label your logs.** Use the filename or the in-app label (e.g. `before-fan-curve`, `after-fan-curve`) to note what changed, so it's still obvious which log is which when you come back to compare weeks later.
- **Trim out the setup time.** Starting the logger, switching screens, and launching the game all add a few minutes of non-representative time to a log. If you're specifically testing a game's performance, use the "Gameplay window" panel on the Compare Logs page — it auto-detects (and lets you fine-tune) when frames were actually being rendered in each log, so the comparison isn't diluted by menu time or alt-tabbing.

## How results are derived (and: is any AI involved?)

**No.** There is no AI, machine learning, or LLM anywhere in this tool — not for analysis, not for the plain-English explanations, not behind the Copy buttons. Every finding, number, and suggestion you see is produced by fixed, deterministic JavaScript rules that ship inside `index.html` and run entirely in your browser. You can read every one of them yourself — there's no hidden server call to inspect, because there's no server.

Concretely:

- **The numbers** (temperatures, power draw, FPS, etc.) come straight from the columns HWiNFO already logged, summarized with plain arithmetic (min/max/average/percentile) — see `app_engine.js`.
- **"Top things to look at"** is a fixed rule engine (`detectIssues()` in `app_rules.js`) that checks each log against a set of known-bad patterns: CPU/GPU temperatures against that part's typical throttle point, memory running below its EXPO/XMP-rated speed, drive SMART health and temperature thresholds, real PCIe fault counters (as opposed to benign ASPM link-recovery events), and similar. Each hit is tagged with a severity (critical / serious / warning / info). When more than one log is loaded, `topIssuesAcrossFiles()` in `app_compare.js` merges matching issues across logs and ranks the combined list by severity first, how many of your loaded logs it shows up in second (so a recurring problem outranks a one-off blip), and whether it's present in your most recent log third. The top 5 are shown.
- **Hardware headroom** and the stock-spec comparisons come from a small lookup table of publicly known CPU/GPU specs (`app_specs.js`), matched against the CPU/GPU name HWiNFO reported — not a live database, and not guaranteed to be exact for every SKU or AIB variant.
- **"Run Verdict"** composite scores (`computeCompositeScores()` in `app_compare.js`) are a weighted, min-max-normalized blend of your loaded logs' thermals/power/performance numbers — again, plain math, no model.

If you'd like a second opinion from an actual AI, that's exactly what the Copy buttons are for: copy a section and paste it into your AI chat of choice.

## Privacy

Everything happens locally in your browser. Your CSV is parsed client-side and is never uploaded, transmitted, or stored anywhere outside your own device. This tool has no server, no accounts, and no telemetry — you can verify this yourself since it's a single readable HTML file with no external script dependencies beyond a Google Fonts stylesheet.

## Development

The source is split into several plain JavaScript files for readability, concatenated by a small build script into the single distributable HTML file:

```
app_engine.js    — HWiNFO CSV parsing and column statistics
app_specs.js     — CPU/GPU hardware spec lookup tables
app_rules.js     — issue-detection rules (thermals, power, PCIe, memory, drives)
app_gaming.js    — frame-pacing/bottleneck analysis
app_memory.js    — EXPO/XMP configuration detection
app_compare.js   — multi-file ordering, deltas, and the Run Verdict composite scoring
app_charts.js    — chart rendering
app_main.js      — state, rendering, and UI wiring
artifact.html    — page shell and CSS
build.js         — concatenates everything above into index.html
```

To build after making changes:

```
node build.js
```

This produces `index.html`, the single file you actually open or deploy. There are no npm dependencies to install.

### Hosting your own copy

Because `index.html` is the whole app, hosting it is just serving that one file. The live link above is a free [GitHub Pages](https://pages.github.com/) site built straight from this repo — GitHub Pages serves whatever is named `index.html` at the repo root automatically. To point your own fork at your own copy: **Settings → Pages → Source: Deploy from a branch → Branch: `main`, folder: `/(root)` → Save**. It'll be live at `https://<your-username>.github.io/<repo-name>/` within a minute or so.

## Limits

Up to 4 logs can be loaded and compared at once, to keep the comparison table and charts readable.

## License

MIT — see [LICENSE](LICENSE). Free to use, modify, and share.

## Support

If this saved you some troubleshooting time, you're welcome to [buy me a coffee](https://buymeacoffee.com/YOUR-USERNAME). Not required — just appreciated.
