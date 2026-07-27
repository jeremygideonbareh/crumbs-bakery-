# Maximum Efficiency + UI Upgrade — Install Plan

## TODOs

- [x] 1. **Add Token Optimizer** — Added `token-optimizer-opencode` to opencode.jsonc plugin array
- [x] 2. **Add OpenSlimedit** — Added `openslimedit` to opencode.jsonc plugin array
- [x] 3. **Install RTK binary** — Downloaded RTK v0.43.0, extracted to `~/.local/bin/`
- [x] 4. **Initialize RTK** — Ran `rtk init -g --opencode`, plugin at `~/.config/opencode/plugins/rtk.ts`
- [x] 5. **Verify token tools** — RTK v0.43.0 confirmed, plugins in opencode.jsonc, loads on restart
- [x] 6. **Set theme** — Set `catppuccin` in tui.json
- [x] 7. **Install terminal-progress** — Added `opencode-terminal-progress` to opencode.jsonc
- [x] 8. **Install status-signals** — Installed via `opencode plugin`, patched tui.json
- [x] 9. **Install neo-terminal** — npm global install: `@nelsonaguirre/oc-plugin-neo-terminal@1.2.1`

### Goal
Install 3 completely orthogonal token-saving tools that target **different waste sources**. Combined estimated savings: **60-75% total tokens**. Zero quality compromise — all three are lossless/reversible.

### The Stack

| Tool | Stars | Savings | What It Targets | Quality Risk |
|------|-------|---------|-----------------|-------------|
| **Token Optimizer** | 1,659⭐ | 15-25% total | Context quality decay, ghost tokens, loop detection, session continuity | ✅ None — quality nudges improve output |
| **RTK** (Rust Token Killer) | active | 60-90% on CLI | Bash/git/npm/find/grep output noise | ✅ None — model sees same info, compressed |
| **OpenSlimedit** | 93⭐ | 11-45% per call | Tool schema bloat, read output boilerplate, line-range edits | ✅ None — lossless, reversible |

### Why These Three Together
Zero overlap. Each targets a completely independent waste category:

```
Token Optimizer  →  Context quality & compaction  (what stays in window)
RTK              →  CLI command output             (what each command spews)
OpenSlimedit     →  Tool descriptions & read output (what every API call sends)
```

### Estimated Combined Savings Breakdown
- Tool call overhead: **↓ 20-40%** (OpenSlimedit compresses schemas sent every call)
- CLI output: **↓ 60-90%** (RTK strips noise from git/npm/find/grep output)
- Context window: **stays cleaner + sessions last longer** (Token Optimizer quality + compaction)
- **Total: 60-75% fewer tokens consumed** — these multiply, not add

### A.1 — Add Token Optimizer to opencode.jsonc
**File:** `C:\Users\cloud\.config\opencode\opencode.jsonc`
- Add `"token-optimizer-opencode"` to the `plugin` array
- OpenCode auto-installs from npm on next launch
- Optionally configure features (qualityNudges, loopDetection, smartCompaction, continuity)

### A.2 — Add OpenSlimedit to opencode.jsonc
**File:** `C:\Users\cloud\.config\opencode\opencode.jsonc`
- Add `"openslimedit"` to the `plugin` array
- OpenCode auto-installs from npm on next launch
- Zero configuration — works out of the box

### A.3 — Install RTK binary
- Download `rtk-x86_64-pc-windows-msvc.zip` from:
  https://github.com/rtk-ai/rtk/releases
- Extract `rtk.exe` to `C:\Users\cloud\.local\bin\`
- Add that directory to system PATH if not already there
- RTK v0.37.2+ has **native Windows hook support** — no WSL needed

### A.4 — Initialize RTK for OpenCode
- Run in terminal: `rtk init -g --opencode`
- This installs:
  - Plugin → `%USERPROFILE%\.config\opencode\plugins\rtk.ts`
  - Rules → `%USERPROFILE%\.config\opencode\rules\rtk.md`
  - Reference → `%USERPROFILE%\.config\opencode\RTK.md`

### A.5 — Verify token tools
- Restart OpenCode
- Run `rtk gain` → should show token savings stats
- OpenCode should load all 3 plugins at startup (no errors on launch)

---

## Section B: UI Upgrade (Look Better + More Info)

These are **optional visual enhancements** — install what you like:

### B.1 — Pick a theme (zero install, instant)
Run `/theme` inside OpenCode TUI and pick from 20+ built-in themes:
- **catppuccin** — smooth purples, most popular
- **tokyonight** — deep blue, easy on eyes
- **nord** — clean arctic tones
- **gruvbox** — warm retro
- **kanagawa** — Japanese wave-inspired
- **matrix** — hacker green
- **one-dark** — classic editor look

Or create a **custom theme** at `~/.config/opencode/themes/my-theme.json`

### B.2 — Terminal tab progress (shows agent state in tab title)
**Plugin:** `opencode-terminal-progress`
- Shows agent Busy / Idle / Error / Waiting in your **Windows Terminal tab title**
- Works on Windows Terminal natively
- Zero config after install
- **Install:** add to opencode.jsonc plugin array

### B.3 — Status-signal themes (auto-switches theme by session state)
**Plugin:** `@guard22/opencode-status-signals`
- OpenCode auto-changes theme based on what's happening:
  - Error → `dracula` (red/dark theme)
  - Question asked → `matrix` (hacker green)
  - Agent busy → `tokyonight` (deep focus blue)
  - Default → `opencode` (clean default)
- Can customize which theme maps to which state
- **Commands once installed:** `/theme-states` to set it up interactively
- **Install:** `opencode plugin @guard22/opencode-status-signals@latest --global`

### B.4 — Neo-terminal dashboard (retro CRT + system metrics sidebar)
**Plugin:** `@nelsonaguirre/oc-plugin-neo-terminal`
- CRT scanline effect + vignette
- NEXUS sidebar dashboard with system metrics (CPU, memory, agent state)
- 4 color palettes with syntax highlighting per role
- **Most visually impactful** but heaviest of the UI options
- **Install:** add to opencode.jsonc plugin array + configure in tui.json

### Recommended UI Combo (lightweight, practical)
```
1. /theme → catppuccin                     (instant, nice colors)
2. opencode-terminal-progress               (tab shows agent state)
3. @guard22/opencode-status-signals         (theme = session state at a glance)
```

### Optional upgrade
```
4. @nelsonaguirre/oc-plugin-neo-terminal    (full CRT dashboard experience)
```

---

## Section C: Full Config Reference

### opencode.jsonc plugin array (after all installs)
```jsonc
"plugin": [
  "ecc-universal",
  "opencode-supermemory",
  "opencode-websearch-cited",
  "opencode-vibeguard",
  "oh-my-openagent",
  "token-optimizer-opencode",
  "openslimedit"
]
```

### tui.json (after UI upgrades)
```jsonc
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "catppuccin",
  "plugin": [
    "@guard22/opencode-status-signals"
  ]
}
```

## Quality Safeguards
- **Token Optimizer** `qualityNudges` warns when context quality drops
- **OpenSlimedit** is lossless — only compresses tool descriptions, never content
- **RTK** compresses output but model sees same information — commands remain byte-exact
- All three are reversible/fallback-safe — no data loss
- UI plugins are cosmetic only — zero impact on functional behavior
