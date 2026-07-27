# seed-script-guard - Work Plan

## TL;DR (For humans)
<!-- Fill this LAST, after the detailed plan below is written, so it summarizes the REAL plan. -->
<!-- Plain English for a non-engineer: NO file paths, NO todo numbers, NO wave/agent/tool names. -->

**What you'll get:** The seed script will be fixed so it can never overwrite your admin panel customizations again. Your current seeded data will be cleared so the site shows the default images/text, letting you re-customize via the admin panel safely.

**Why this approach:** A new database function (`admin_ensure_page_section`) is created specifically for seeding — it only creates rows if they don't exist, NEVER touching the image/text data you set in the admin panel. The seed script is rewritten to use this, and the old overwriting path is only used by the admin panel itself (its actual purpose).

**What it will NOT do:** It won't change how the admin panel works, won't modify any site components or default content, and won't delete any rows — only clears the data payload so defaults display.

**Effort:** Short
**Risk:** Low — identical pattern to proven migrations, admin panel path untouched
**Decisions to sanity-check:** The new RPC has no data parameter — seed can only create empty section rows

Your next move: Run the plan via `/start-work`.

---

> TL;DR (machine): Short, Low risk — new RPC + seed script rewrite + data clear + redeploy

## Scope
### Must have
- Create new RPC `admin_ensure_page_section(admin_token, p_key, p_label, p_type)` that inserts with `ON CONFLICT DO NOTHING` and no data column
- Create migration SQL file `supabase/migrations/20260728_seed_page_section_guard.sql`
- Rewrite `scripts/seed-sections.mjs` to use new RPC with no data payload, add `--force` flag for full reset
- Run direct UPDATE SQL to clear all `page_sections.data` to `'{}'::jsonb`
- Push migration + run seed script
- Rebuild + redeploy to Cloudflare

### Must NOT have (guardrails, anti-slop, scope boundaries)
- Do NOT modify `admin_upsert_page_section` RPC — admin panel uses it for saving edits
- Do NOT touch any front-end component or `contentDefaults.js`
- Do NOT delete `page_sections` rows — only clear the `data` column
- Do NOT modify any other RPC functions or admin pages

## Verification strategy
> Zero human intervention - all verification is agent-executed.
- Test decision: tests-after (verify RPC behavior via direct calls)
- Evidence: .omo/evidence/

## Execution strategy
### Parallel execution waves
Wave 1: New RPC migration + seed script rewrite (can be parallel)
Wave 2: Data clear + build + deploy (sequential, depends on wave 1)

### Dependency matrix
| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1. Create migration | — | 2, 3 | — |
| 2. Rewrite seed script | — | 3 | 1 |
| 3. Push + seed + clear | 1, 2 | 4 | — |
| 4. Rebuild + redeploy | 3 | — | — |

## Todos

- [ ] 1. Create migration with `admin_ensure_page_section` RPC
  What to do / Must NOT do: Create `supabase/migrations/20260728_seed_page_section_guard.sql` containing a new SECURITY DEFINER RPC `admin_ensure_page_section(admin_token TEXT, p_key TEXT, p_label TEXT, p_type TEXT)` that: (a) validates admin token via existing crypt pattern from `admin_config`, (b) inserts into `page_sections` with `section_key, section_label, section_type` ONLY (no data column), (c) uses `ON CONFLICT (section_key) DO NOTHING` so it never overwrites existing rows. Must NOT include a `p_data` parameter. Must follow the exact auth pattern from `20260716000001_fix_all_admin_rpcs.sql` lines 326-344 (DECLARE stored_hash, SELECT value INTO stored_hash, IF extensions.crypt check).

  Parallelization: Wave 1 | Blocked by: — | Blocks: 3
  References:
  - Auth pattern: `supabase/migrations/20260716000001_fix_all_admin_rpcs.sql:326-344`
  - Proven seed pattern: `supabase/migrations/20260727000001_seed_category_sections.sql:6-13` (INSERT ... ON CONFLICT DO NOTHING with no data)
  - Existing RPC: `supabase/migrations/20260709_page_sections.sql:44-60` (original admin_upsert_page_section with data parameter — DO NOT COPY the data parameter)

  Acceptance criteria (agent-executable): The migration file exists at `supabase/migrations/20260728_seed_page_section_guard.sql`, contains `CREATE OR REPLACE FUNCTION admin_ensure_page_section`, has no `p_data` parameter, uses `ON CONFLICT (section_key) DO NOTHING`, and follows the DECLARE+crypt auth pattern.

  QA scenarios (name the exact tool + invocation):
  - Happy: Read the file — `Read supabase/migrations/20260728_seed_page_section_guard.sql` — confirm RPC name, params, auth pattern, no data param
  - Failure: grep for `p_data` — `grep "p_data" supabase/migrations/20260728_seed_page_section_guard.sql` — must return 0 matches
  Evidence: `<attemptDir>/task-1-seed-script-guard.md`

  Commit: Y | feat(db): add admin_ensure_page_section RPC for safe seeding without data overwrite

- [ ] 2. Rewrite seed-sections.mjs to use new RPC with --force flag
  What to do / Must NOT do: Rewrite `scripts/seed-sections.mjs` to: (a) call `admin_ensure_page_section` instead of `admin_upsert_page_section`, (b) remove ALL data payloads — sections are seeded with only `{ p_key, p_label, p_type }`, no `p_data`, (c) add a `--force` flag that when passed, calls `admin_upsert_page_section` with the full data payload for full reset, (d) print clear "⏭️ skipping (use --force to overwrite)" vs "✅ created" messages. Must NOT import or reference `contentDefaults.js` for data. Must NOT change the `local()` helper or `BASE_URL` — they're only used in `--force` mode. Must NOT break the existing `.env` loading and RPC helper.

  The seed script should by default only ensure empty section rows exist. With `--force`, it seeds data AND overwrites existing.

  Parallelization: Wave 1 | Blocked by: — | Blocks: 3
  References:
  - Current seed script: `scripts/seed-sections.mjs:1-309` (full file — remove all data payloads from sections array)
  - New RPC name: `admin_ensure_page_section` (takes `p_key, p_label, p_type` only)
  - Existing upsert RPC (for --force mode): `admin_upsert_page_section` (takes `p_key, p_label, p_type, p_data`)

  Acceptance criteria (agent-executable):
  1. Read the file — confirm default path calls `admin_ensure_page_section` without `p_data`
  2. Confirm `--force` path calls `admin_upsert_page_section` with `p_data`
  3. Confirm sections array still has all 18 sections with key/label/type
  4. Confirm local() helper and BASE_URL preserved for --force mode

  QA scenarios:
  - Happy: Read the file, verify default flow calls `rpc('admin_ensure_page_section', { p_key, p_label, p_type })` — no `p_data`
  - Failure: Check no section entry passes `data:` to the default RPC call
  Evidence: `<attemptDir>/task-2-seed-script-guard.md`

  Commit: Y | refactor(scripts): rewrite seed-sections.mjs to use admin_ensure_page_section with --force guard

- [ ] 3. Push migration, clear page_sections data, run seed
  What to do / Must NOT do: (a) Push the new migration to Supabase: `cd "C:\Users\cloud\OneDrive\Desktop\Hybrid_Second_Brain\clients website\crumbs" && npx supabase db push`, (b) Run direct SQL to clear all page_sections data: `UPDATE public.page_sections SET data = '{}'::jsonb, updated_at = now();`, (c) Run the seed script without --force: `node scripts/seed-sections.mjs`. Must NOT delete rows — only clear data. Must NOT touch other tables.

  Parallelization: Wave 2 | Blocked by: 1, 2 | Blocks: 4
  References:
  - Supabase project ref in `.env` and `.supabase/.temp/project-ref`
  - Migration file from Todo 1
  - Seed script from Todo 2
  - `public_read_page_section` RPC for verification

  Acceptance criteria (agent-executable):
  1. `npx supabase db push` exits 0
  2. Run SQL `SELECT section_key, data FROM page_sections WHERE data != '{}'::jsonb` — returns 0 rows
  3. `node scripts/seed-sections.mjs` exits 0 with all sections showing "⏭️" or "✅"
  4. Run SQL `SELECT count(*) FROM page_sections` — row count unchanged (should be 42)

  QA scenarios:
  - Happy: All three commands succeed, verify with SQL queries
  - Failure: If `npx supabase db push` fails, check migration syntax; if seed fails, check RPC exists
  Evidence: `<attemptDir>/task-3-seed-script-guard.md`

  Commit: Y | feat(db): add admin_ensure_page_section RPC and clear seeded data

- [ ] 4. Rebuild + redeploy to Cloudflare
  What to do / Must NOT do: Run `npm run build && wrangler deploy` from the project root. Must NOT skip build errors. Must NOT deploy if build fails.

  Parallelization: Wave 2 | Blocked by: 3 | Blocks: —

  Acceptance criteria (agent-executable):
  1. `npm run build` exits 0 (verify with echo $?)
  2. `wrangler deploy` exits 0
  3. `webfetch https://crumbsbakery.in` returns 200 with `<div id="root">`
  4. `webfetch https://crumbsbakery.in/images/bespoke-cake.jpeg` returns 200 (image accessible)

  QA scenarios:
  - Happy: Build + deploy succeed, site loads, image loads
  - Failure: If build fails, check error output and fix; if deploy fails, check wrangler.toml and token
  Evidence: `<attemptDir>/task-4-seed-script-guard.md`

  Commit: Y | chore: rebuild and redeploy after seed script guard

## Final verification wave
> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.
- [ ] F1. Plan compliance audit — every todo completed, acceptance criteria met
- [ ] F2. Code quality review — seed script, migration, no dead code
- [ ] F3. Real manual QA — visit crumbsbakery.in/admin/content, confirm sections show defaults, edit one, save, confirm no seed can overwrite
- [ ] F4. Scope fidelity — no admin panel changes, no component changes, no data deletion

## Commit strategy
One commit per todo:
1. `feat(db): add admin_ensure_page_section RPC for safe seeding without data overwrite`
2. `refactor(scripts): rewrite seed-sections.mjs to use admin_ensure_page_section with --force guard`
3. `feat(db): add admin_ensure_page_section RPC and clear seeded data`
4. `chore: rebuild and redeploy after seed script guard`

## Success criteria
1. Seed script can be run 100 times without ever overwriting admin panel data
2. `--force` flag still allows full reset when explicitly desired
3. Site at crumbsbakery.in shows default content from contentDefaults.js
4. Admin panel at /admin/content works identically to before
5. Users can customize sections via admin panel without fear of seed script bulldozing them
