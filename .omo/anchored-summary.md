# Anchored Summary

## Objective
Ship and maintain the Crumbs Bakery website: image management, admin CMS, content editing, Supabase DB, Cloudflare deployment. **Current focus:** Install token efficiency plugins to reduce OpenCode token usage/cost.

## Important Details
- **Subagent `task()` delegation blocked by billing** — no payment method configured, cannot spawn subagents
- Build command: `npm run build` (exits 0)
- **Deploy target: Cloudflare Pages** (confirmed — `wrangler.toml` exists for `crumbsbakery.in`). GitHub Pages `deploy.yml` is stale/backup (still maintained, not primary).

## Work State

### Completed — Seed Script Guard (Jul 23)
1. **`seed-sections.mjs` updated** — Empty-data guard prevents re-seeding over real content
2. **`check-and-seed.mjs` created** — Safe public API to run seed logic with guard
3. **`contentDefaults.js` section map verified** — All 17 sections present
4. Supabase `sections` table data cleared + re-seeded with guard in place

### Completed — Image Ref Journal (Jul 25-26)
1. **Migration `20260730_image_ref_journal.sql`** — Helper function `extract_image_refs()`, `image_ref_journal` table, trigger with empty-data guard, `recover_images_rpc()` recovery RPC
2. **DB layer pushed to Supabase** — `npx supabase db push` successful
3. **`useAdminApi.js`** — Added `recoverImages()` API (calls `recover_images_rpc`)
4. **`AdminContent.jsx`** — "0 fields" fix: shows "Using defaults" when DB returns empty, instead of blank inputs
5. **`SectionEditorModal.jsx`** — "Restore previous images" button wired to `json_path`-aware recovery
6. **Rebuilt + deployed** — Cloudflare version `d2516688`, all tests passed
7. **Content issue (saved changes not appearing on site)** — **PAUSED** per user request

### Completed — Content System (Jul 21, commit 41cda15)
1. 49 broken LOCAL() references fixed in `contentDefaults.js`
2. Admin image upload system: ImageUploader, ImagePicker, AdminImages dashboard
3. All homepage sections editable via admin CMS

## Token Efficiency Research — Complete

Full ranked comparison by GitHub stars + real-world savings:

| Rank | Tool | ⭐ Stars | Savings | Approach |
|------|------|----------|---------|----------|
| 1 | **DCP** (Dynamic Context Pruning) | **3,770** | Indirect — keeps context 50-80% | Prunes old msgs, replaces with placeholders |
| 2 | **Token Optimizer** | **1,635** | 15-25% total | 7-signal quality scoring, delta diffs, compaction |
| 3 | **Token Savior** | **1,070** | **–80%** on tsbench | MCP server — persistent code memory |
| 4 | **RTK** (Rust Token Killer) | Active OSS | **60-90%** on CLI output | Compresses bash/git output |
| 5 | **OpenToken** | **154** | **74%** (5M tokens proven) | 42 compression layers, input+output |
| 6 | **OpenSlimedit** | **83** | 11-45% across models | Compresses tool descriptions + read output |
| 7 | **ACP** (Active Context Pruning) | **63** | ~91% cache hit rate | Model decides what to compress |

**User chose: Token Optimizer + RTK** (complementary stack: quality + CLI compression)

## Active Plan
Plan written at `.omo/plans/max-token-efficiency.md` — ready for `/start-work`:

### Token Efficiency Stack (60-75% savings, zero quality loss)
1. **Token Optimizer** (1,659⭐) → context quality, compaction, continuity
2. **RTK** (active) → CLI output compression 60-90%
3. **OpenSlimedit** (93⭐) → tool description + read output compression 11-45%

### UI Upgrade (optional)
4. `/theme catppuccin` → instant theme
5. **opencode-terminal-progress** → agent state in Windows Terminal tab
6. **@guard22/opencode-status-signals** → theme auto-changes by session state
7. **Optional:** @nelsonaguirre/oc-plugin-neo-terminal → CRT + sidebar dashboard

## Blocked
- Content issue (saved changes not appearing on production) — **paused**, user wants token tools first
- Subagent spawning unavailable (no payment method)

## Key Files
- `C:\Users\cloud\.config\opencode\opencode.jsonc` — target config for Token Optimizer plugin
- `supabase/migrations/20260730_image_ref_journal.sql` — deployed migration (ref journal + recovery)
- `src/hooks/useAdminApi.js` — recoverImages API, json_path-aware recovery
- `src/pages/admin/AdminContent.jsx` — 0-fields fix (shows "Using defaults" on empty DB)
- `src/components/admin/SectionEditorModal.jsx` — restore images button wired to json_path recovery
