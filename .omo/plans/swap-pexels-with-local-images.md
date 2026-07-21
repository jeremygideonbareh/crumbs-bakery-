# swap-pexels-with-local-images - Work Plan

## TL;DR (For humans)

**What you'll get:** 21 of the ~28 unique Pexels placeholder photos on the Crumbs bakery site get replaced with the 21 new client-supplied photos in `public/images/raw/`. The remaining 7 low-reference Pexels IDs (1-2 refs each) stay untouched.

**Why this approach:** ~97% of all Pexels references (125 of 129) come from just 21 unique image IDs. Swapping those 21 IDs covers nearly the entire visible Pexels surface — home hero, category page heroes, product cards, gallery, menu cards, FAQ thumbs, instagram strip, marquee, About team, About story. The rendering stack already uses `object-cover` inside Tailwind aspect-ratio containers (`aspect-square`, `aspect-[4/3]`, `aspect-[16/9]`/`[21/9]`, `aspect-[3/4]`), so layout is preserved automatically — only the image bytes inside the crop change.

**What it will NOT do:**
- Will NOT change any text content, copy, prices, JSX structure, CSS classes, or component layout
- Will NOT touch the original raw client photos in `public/images/raw/`
- Will NOT replace the 7 low-reference Pexels IDs (Pexels IDs: 14969996, 7328340, 35224342, 7358362, 7358386, 34979324, 20558713 — each 1-2 refs)
- Will NOT touch the existing real menu board images already in `public/images/` (`cakes menu.jpeg`, `cheese cakes menu.jpeg`, `fruit cakes menu.jpeg`, `Japanese cheesecake.jpeg`, `Japanese cheesecake (2).jpeg`, `Lemon and blueberry muffins.jpeg`, `Banana pudding brioche.jpeg`, `Cream puffs.jpeg`, `Quiche.jpeg`, `WhatsApp Image 2026-07-15 at 3.21.53 PM (1).jpeg`)
- Will NOT touch admin placeholder text at `src/components/admin/SectionEditorModal.jsx:306`
- Will NOT modify `fix-files.mjs` (whitespace normalizer, irrelevant)

**Effort:** 8 todos in 3 waves. Wave 1: install sharp, identify each raw image, generate sized copies. Wave 2: swap references in `src/data/products.js`, `src/data/contentDefaults.js`, 3 page heroes, About story, marquee, About team. Wave 3: full build + screenshot QA + final verification. One new devDependency (`sharp`), one new script (`scripts/swap-images.mjs`).

**Risk:**
- Image-subject misclassification — the worker identifies each raw photo during execution using single-image `look_at` calls. Mitigated by recording the full mapping ledger in `.omo/artifacts/image-mapping.md` BEFORE any code edits, so misclassifications surface as wrong-slot photos and are easy to swap without rolling back code.
- Aspect mismatch for hero slots (16:9, 21:9, free-height viewport) — mitigated by sharp's `fit: 'cover', position: 'attention'` crop and per-page screenshot QA in TODO 3.1.
- Page weight if compression is wrong — mitigated by mozjpeg q80 and a < 500kb-per-file acceptance gate in TODO 1.3.
- Clobbering existing `public/images/` files — mitigated by naming convention (new files use descriptive lowercase-hyphen names distinct from existing files) and a non-`--force` abort in `scripts/swap-images.mjs`.

**Decisions (locked at approval, 2026-07-19):**
- **Fork 1:** Replace the top-21 most-referenced unique Pexels IDs (~125 of 129 refs).
- **Fork 2:** Worker identifies each raw image's subject via single-image `look_at` during execution; mapping ledger documents every assignment before code edits.
- **Fork 3:** Add `sharp` to devDependencies; sized copies written to `public/images/`; raw originals untouched in `public/images/raw/`.

**Targeted Pexels IDs (the 21 to replace):** 2067396, 2144200, 140831, 37353913, 38058461, 14105, 132694, 1793037, 5702761, 14766327, 32916204, 16402099, 20677473, 32706248, 37110821, 34155188, 29230134, 32421567, 9820, 4242130, 1055271.

**Intentionally kept Pexels IDs (the 7 NOT in scope):** 14969996, 7328340, 35224342, 7358362, 7358386, 34979324, 20558713.

## Scope

Replace the 21 most-referenced unique Pexels placeholder image IDs across the Crumbs bakery React/Vite/Tailwind site with 21 client-supplied photos already staged in `public/images/raw/`. Affects 7 source files: `src/data/products.js`, `src/data/contentDefaults.js`, `src/components/SheetCakesMarquee.jsx`, `src/pages/AboutPage.jsx`, `src/pages/CakesPage.jsx`, `src/pages/CupcakesPage.jsx`, `src/pages/DessertsPage.jsx`.

Out of scope:
- The 7 low-reference Pexels IDs (`14969996`, `7328340`, `35224342`, `7358362`, `7358386`, `34979324`, `20558713` — each 1-2 refs).
- All CSS, JSX structure, component layout, and text content.
- Existing real local images already in `public/images/` (menu boards, 6 product photos, WhatsApp July-15 image, favicon).
- `public/images/raw/` directory (read-only inputs).
- `src/components/admin/SectionEditorModal.jsx:306` (placeholder text, not a real ref).

Hard constraints (user-stated): nothing else in the website changes; each new image used once; sizes must preserve each section's look as the Pexels image rendered.

## Verification strategy

Agent-executed QA at every todo. Zero human verification.

- **Build:** `npm run build` exits 0 with no warnings about unresolved image URLs.
- **Grep audit:** `grep -E 'images\.pexels\.com/photos/(<id1>|<id2>|...|<id21>)/' src/` returns 0 hits for the 21 targeted IDs; the 7 intentionally-kept IDs are still referenced.
- **File-size cap:** each new file in `public/images/` is < 500kb (mozjpeg q80 parity with Pexels CDN).
- **Visual QA:** Playwright or agent-browser screenshots of Home, Cakes, Cupcakes, Desserts, About, Menus pages saved to `.omo/artifacts/screenshots/<page>-post-swap.png`; eyeballed against expected layouts for aspect distortion, broken images, object-cover preservation.
- **Diff fidelity:** `git diff --stat` matches the expected file list — no spurious edits to CSS/text/JSX structure.
- **Raw untouched:** `public/images/raw/` entry count unchanged at 30.

Final verification wave runs F1 (plan compliance audit), F2 (code quality review), F3 (manual QA — 6 page screenshots), F4 (scope fidelity) in parallel and all must APPROVE.

## Execution strategy

Three waves in dependency order.

- **Wave 1 (asset prep):** install `sharp`; worker identifies each of the 21 raw images via single-image `look_at` calls; mapping ledger recorded at `.omo/artifacts/image-mapping.md`; the resize script `scripts/swap-images.mjs` produces 21 sized JPEG copies in `public/images/` with the correct aspect and width per slot. Wave 1 MUST complete before any code edits so misclassifications surface early.
- **Wave 2 (code swaps):** per-file Pexels → `LOCAL(...)` rewrites. The 4 hardcoded hero/story URLs in `CakesPage.jsx`, `CupcakesPage.jsx`, `DessertsPage.jsx`, `AboutPage.jsx` are handled separately from the `PEXELS(...)` helper call sites in `products.js`, `contentDefaults.js`, `SheetCakesMarquee.jsx`, `AboutPage.jsx` team array. Each todo's Commit line uses Conventional Commits; atomic commits per todo.
- **Wave 3 (verification):** full build, grep audit, per-page screenshots, final F1-F4 verification wave. Receipts recorded in `.omo/artifacts/final-verification.md`.

Every Conventional Commit uses prefix `feat(image-swap)`, `chore(image-swap)`, `docs(image-swap)`, or `test(image-swap)` per the action. All 21 source raw photos stay untouched in `public/images/raw/`.

## Todos

### Wave 1 — Asset prep + mapping

#### TODO 1.1 — Identify and document the image→slot mapping
- **References:**
  - Raw images: `public/images/raw/` — 21 new files (filenames in `.omo/drafts/swap-pexels-with-local-images.md`, lines 38-58)
  - Top-21 Pexels IDs by reference count (explorer report — see draft):
    | Pexels ID | Refs | Primary slot concept |
    |---|---|---|
    | 2067396 | 20 | brownie / crafted-with-love |
    | 2144200 | 18 | hero / bespoke cake |
    | 140831 | 17 | cinnamon rolls / amazing cakes |
    | 37353913 | 14 | choc chip cookie |
    | 38058461 | 14 | blueberry cheesecake |
    | 14105 | 13 | vanilla cupcake |
    | 132694 | 12 | chocolate cake |
    | 1793037 | 11 | vintage / custom orders |
    | 5702761 | 8 | delivery / about bakery |
    | 14766327 | 6 | tiramisu |
    | 32916204 | 6 | muffin / hot snack |
    | 16402099 | 4 | chocolate eclair / cream puff |
    | 20677473 | 3 | edible photo cupcake / berliners |
    | 32706248 | 3 | french macarons |
    | 37110821 | 3 | edible photo cake / carrot cake |
    | 34155188 | 3 | funfetti sheet / chocolate birthday |
    | 29230134 | 3 | raspberry ripple / hummingbird |
    | 32421567 | 3 | chocolate cupcake |
    | 9820 | 2 | lemon drizzle / lemon bars |
    | 4242130 | 2 | banana bread |
    | 1055271 | 2 | red velvet cupcake |
  - Call-site lists for each ID: see explorer report referenced in `.omo/drafts/swap-pexels-with-local-images.md`
  - Slot aspect ratios (verified end-to-end by explorer): `1:1` (ProductGrid, ProductCarousel, InstagramSection, BrowseByBake, About team avatars, marquee avatar — but marquee is 48px circle so use 1:1), `4:3` (Gallery, NewsSection, DeliverySection, About columns, About story), `16:9` mobile / `21:9` md (ImageCarousel), `16:9` mobile / `4:3` md (PromoCards), `30vh-40vh` free-height (3 page heroes + HomePage hero), `aspect-[3/4]` (MenusGallery — but already uses real menu images, not in scope).
  - Slot width Pexels used (by helper): `200` (SheetCakesMarquee line 4), `300` (AboutPage line 6 team), `400` (products.js default), `800` (contentDefaults.js default), `600` (AboutPage line 62 story, hardcoded), `1200` (3 page heroes, hardcoded), `1920` (HOME_HERO background_image, explicit).
- **Acceptance:**
  - File `.omo/artifacts/image-mapping.md` exists.
  - It contains a markdown table with EXACTLY 21 rows, columns: `raw_filename | identified_subject | assigned_pexels_id | assigned_slot_label | target_local_filename | target_aspect | target_width_px`.
  - Every `assigned_pexels_id` is one of the 21 IDs listed above (no others).
  - Every `target_local_filename` is lowercase, hyphen-separated, descriptive, ends `.jpeg`, and unique across the 21.
  - No `target_local_filename` collides with an existing file in `public/images/` (existing files: `Japanese cheesecake.jpeg`, `Japanese cheesecake (2).jpeg`, `Lemon and blueberry muffins.jpeg`, `Banana pudding brioche.jpeg`, `Cream puffs.jpeg`, `Quiche.jpeg`, `cakes menu.jpeg`, `cheese cakes menu.jpeg`, `fruit cakes menu.jpeg`, `WhatsApp Image 2026-07-15 at 3.21.53 PM (1).jpeg`, `favicon.svg`).
  - When the SAME Pexels ID is needed at multiple widths across call sites (e.g., 2144200 used at 400, 800, 1200, 1920), the row's `target_width_px` is the LARGEST width among its call sites; smaller variants are resized from this master in TODO 1.3. The mapping table documents this with a comma-separated width list in `target_width_px` (e.g., `400,800,1200,1920`).
  - `target_aspect` is one of: `1:1`, `4:3`, `16:9`, `21:9`, `free-height-hero`. Hero slots (3 page heroes + HomePage hero background) use `free-height-hero` because their containers use viewport-height, not aspect-ratio; width is `1920` for HomePage hero and `1600` for page heroes (subset of 1920 master).
- **QA happy path:** Worker invokes `look_at(file_path='...raw\<file>', goal='identify subject + orientation in one line')` for each of the 21 raw files individually (single-image calls do not time out). The 21 identification lines are pasted into the mapping table. Markdown table renders; row count == 21; every assigned Pexels ID is in the in-scope set. Evidence: `.omo/artifacts/image-mapping.md` and `.omo/artifacts/look-at-log.txt` (raw `look_at` outputs).
- **QA failure path:** A row's `assigned_pexels_id` is NOT in the top-21 set → reject, re-map. A row's `target_local_filename` collides with an existing `public/images/` file → worker renames with a `-v2` suffix or a more-specific name and re-validates. `look_at` returns a non-substantive answer for a file → worker flags it as `IDENTIFICATION-LOW-CONFIDENCE` in `identified_subject` and picks the best-matching in-scope slot by elimination; logged in `.omo/artifacts/look-at-log.txt`.
- **Plan-C fallback for total multimodal outage:** If EVERY `look_at` attempt (single-image, sequential) fails or returns non-substantive answers across multiple retries, worker switches to harness-browser visual identification: opens each raw file via Playwright `file:///<absolute-path-to-raw-file>` in a local browser tab, takes a screenshot to `.omo/artifacts/raw-ids/id-<n>.png`, and writes the subject identification by visual inspection to `.omo/artifacts/look-at-log.txt` with the source cited as `manual-via-playwright`. If this ALSO proves infeasible (e.g., browser tab fails to render JPEG), worker logs `BLOCKED: look_at outage` to `.omo/artifacts/look-at-log.txt` and reports back to the user with a request for manual mapping — execution pauses, plan stays intact. This is the only escalation path that returns control to the user.
- **Commit:** `docs(image-swap): record 21-image mapping ledger`

#### TODO 1.2 — Install sharp and create the resize script
- **References:**
  - `package.json:12-45` (dependencies, devDependencies)
  - `package.json:6-11` (scripts section — no `swap-images` script yet)
  - `scripts/` directory does NOT exist (must be created)
  - Existing convention: ESM modules (`"type": "module"` at `package.json:5`), so the script uses `import sharp from 'sharp'`.
- **Acceptance:**
  - `scripts/swap-images.mjs` exists in a NEW `scripts/` directory at repo root.
  - Script imports `sharp` as default in ESM: `import sharp from 'sharp'`.
  - Script reads the mapping from an embedded `IMAGE_MAP` JS array constant at the top of the script (`const IMAGE_MAP = [{raw_filename, identified_subject, assigned_pexels_id, assigned_slot_label, target_local_filename, target_aspect, target_width_px}, ...]`). Worker mirrors the table from `.omo/artifacts/image-mapping.md` (TODO 1.1) into this array so the resize script is self-contained — avoids markdown-table parsing fragility. Script comment block at the top states "Mirrored from `.omo/artifacts/image-mapping.md` on <date> by TODO 1.1."
  - For each row in the mapping, the script:
    1. Reads `public/images/raw/<raw_filename>`.
    2. Gets the source image's metadata via `sharp(rawPath).metadata()`.
    3. Resizes to `target_width_px` (the largest width in the row's comma-separated list) using `sharp().resize({ width: target_width_px, withoutEnlargement: true })`.
    4. If `target_aspect` is a fixed ratio (`1:1`, `4:3`, `16:9`, `21:9`), crops to that ratio using `sharp().resize(target_width_px, Math.round(target_width_px * aspect_h / aspect_w), { fit: 'cover', position: 'attention' })`.
    5. If `target_aspect` is `free-height-hero`, just resize to `target_width_px` width with no height constraint (let height ride).
    6. Outputs JPEG via `sharp().jpeg({ quality: 80, mozjpeg: true })` to `public/images/<target_local_filename>`.
    7. NEVER overwrites an existing `public/images/` file unless `--force` CLI flag is passed. On collision without `--force`, log `SKIP: <filename> exists (use --force to overwrite)` and continue.
    8. For rows with multiple widths in `target_width_px`, ALSO emit width-narrower variants using the `<basename>-<w>.jpeg` naming convention (e.g., `bespoke-cake-400.jpeg`, `bespoke-cake-800.jpeg`) so the swap code can reference the right variant per slot. Original full-width file keeps the bare `<basename>.jpeg` name.
  - Script logs `OK: <raw_filename> -> <target_local_filename> (<width>x<height>, <kb>kb)` for each success.
  - Script logs `FAIL: <raw_filename> — <reason>` for any failure and continues.
  - `node scripts/swap-images.mjs --dry-run` lists what WOULD happen without writing; output is a 21-line table.
  - `package.json` devDependencies includes `"sharp": "^0.33.5"` (or current stable at execution time).
  - `package.json` scripts section gains `"swap-images": "node scripts/swap-images.mjs"`.
- **QA happy path:** `npm install` succeeds; `node scripts/swap-images.mjs --dry-run` prints 21 lines, no file written; `node scripts/swap-images.mjs` writes 21+ files (21 base + variant files for multi-width rows). Evidence: terminal log saved to `.omo/artifacts/swap-script-install.log`.
- **QA failure path:** `npm install` fails on Windows (sharp has prebuilt binaries but rare build issues) → fallback to `npm install --include=optional sharp` or `npm install @img/sharp-win32-x64`. If still fails, abort and report — DO NOT swap compressed-local-images path (Fork 3 option 2 was explicitly rejected by user).
- **Commit:** `feat(image-swap): add sharp resize script and devDependency`

#### TODO 1.3 — Generate the 21 sized local copies
- **References:**
  - `scripts/swap-images.mjs` (from TODO 1.2)
  - `.omo/artifacts/image-mapping.md` (from TODO 1.1)
  - Output directory: `public/images/`
- **Acceptance:**
  - `public/images/raw/` entry count UNCHANGED (still 30 — 8 originals + 21 new + 1 July-15 WhatsApp file). Verified with `Get-ChildItem public/images/raw | Measure-Object` returning `Count: 30`.
  - `public/images/` contains the 21 base new files named per the mapping, PLUS width-narrower variants for multi-width rows.
  - Each new file is a JPEG (extension `.jpeg`), dimensions match `target_aspect` within 1px tolerance, file size < 500kb each.
  - A summary log `.omo/artifacts/swap-output.log` exists with 21 OK lines and 0 FAIL lines (or, if any FAIL occurred, a clear list of which rows failed and why, and the worker re-ran after fixing).
- **QA happy path:** `Get-ChildItem public/images/*.jpeg | Measure-Object -Property Length -Maximum` returns max < 500kb. Opening 3 random new files in `public/images/` shows correctly cropped images at the expected aspect (no squashed portraits, no elongated landscapes).
- **QA failure path:** A target file is > 500kb → re-encode that row at quality 75; if still > 500kb, re-encode at q60; if STILL > 500kb at q50, mark the raw as `EXCLUDED-COMPRESSION-FAILED` in `.omo/artifacts/swap-output.log` and the assigned slot is demoted to one of the 7 intentionally-kept Pexels IDs (slot stays Pexels — no raw substitution; this satisfies the user's "no repeats" constraint because the excluded raw is not substitute-reused elsewhere). The corresponding code swap for that Pexels ID is then SKIPPED in TODOs 2.1/2.2/2.3/2.4 (the code ref stays `PEXELS(<id>)`). Net effect: fewer than 21 swaps complete, but every constraint still holds. NO raw reshuffling across slots — pin disappears, slot demotes to Pexels. A target aspect doesn't match the source's natural aspect and `fit: 'cover'` produces ugly cropping → switch to `fit: 'contain'` with a background-color fill matching the site's `bg-primary/5` token (`#faf7f2` or similar — check `tailwind.config.js` for the exact primary color), or fall back to `position: 'centre'` instead of `'attention'`.
- **Commit:** `chore(image-swap): produce 21 sized local image copies`

### Wave 2 — Code swaps

#### TODO 2.1 — src/data/products.js: replace top-21 Pexels IDs with LOCAL
- **References:**
  - `src/data/products.js:1-2` (`PEXELS = (id, w = 400) => ...`)
  - `src/data/products.js:4` (`LOCAL = (name) => ${import.meta.env.BASE_URL}images/${encodeURIComponent(name)}` — already correct, DO NOT modify)
  - All `PEXELS(<id>)` call sites where `<id>` is in the 21-target set (43 total call sites in 4 arrays: cakes, cupcakes, cookies, extraDesserts):
    - Lines 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18 (cakes c2-c12)
    - Lines 22, 23, 24, 25, 26, 27, 28, 29, 30 (cupcakes cp1-cp9)
    - Lines 34, 35, 36 (cookies co1-co3 — note `34979324` and `20558713` are NOT in scope, only `37353913` line 34 is in scope)
    - Lines 40, 41, 42 (brownies b1-b3, all Pexels 2067396)
    - Lines 46, 47, 48, 49, 50, 51, 52, 54, 55, 56, 57, 59, 60, 62, 64, 65, 66 (extraDesserts d2-d25 — note `14969996` line 17 already covered above, `7328340` is at line 14 already counted, `35224342`/`7358362`/`7358386` at lines 25, 27, 28 are NOT in scope)
  - The mapping table at `.omo/artifacts/image-mapping.md` (which Pexels ID maps to which `target_local_filename`).
- **Acceptance:**
  - Every `PEXELS(<id>)` call in products.js where `<id>` is in the 21-target set is replaced with `LOCAL('<target_local_filename>')` using the filename from the mapping. The same Pexels ID across multiple rows maps to the SAME filename (e.g., all 3 brownie rows b1/b2/b3 use the same `brownies.jpeg` if the worker identified one brownie photo, or different filenames if the mapping assigned different raw files to those slots).
  - When the SAME Pexels ID is used at multiple widths in this file (all of products.js uses w=400 default, so this is rare), reference the bare `<basename>.jpeg`. (Width variants only matter in TODO 2.2 where contentDefaults uses w=800.)
  - No `PEXELS(<id>)` calls remain in products.js for any of the 21 IDs. Verify with:
    `Get-ChildItem -Path src/data/products.js | Select-String -Pattern 'PEXELS\((2067396|2144200|140831|37353913|38058461|14105|132694|1793037|5702761|14766327|32916204|16402099|20677473|32706248|37110821|34155188|29230134|32421567|9820|4242130|1055271)'`
    returns no matches.
  - The remaining `PEXELS(...)` calls (for the 7 out-of-scope IDs: `14969996` line 17, `7328340` line 14, `35224342` line 25, `7358362` line 27, `7358386` line 28, `34979324` line 35, `20558713` line 36) are untouched.
  - No other line of products.js is modified — product `id`, `name`, `price`, `desc`, `badge`, `variants` fields unchanged; array structure unchanged; PEXELS and LOCAL helper definitions unchanged.
- **QA happy path:** `npm run build` succeeds (exits 0). `npm run lint` passes. The grep audit command above returns no matches. Evidence: terminal log at `.omo/artifacts/todo-2-1.log`.
- **QA failure path:** Build reports `ReferenceError: LOCAL is not defined` → confirm LOCAL helper still at line 4 (not accidentally removed). Build reports "Cannot find module" for sharp — this todo doesn't involve sharp directly; if it fires, the issue is an unrelated `import` that was accidentally added; revert. A row's `LOCAL('...')` references a filename not in `public/images/` → check TODO 1.3 output and the mapping; re-run TODO 1.3 for that row or fix the filename in the swap.
- **Commit:** `feat(image-swap): products.js — replace 21 Pexels refs with LOCAL`

#### TODO 2.2 — src/data/contentDefaults.js: replace top-21 Pexels IDs with LOCAL
- **References:**
  - `src/data/contentDefaults.js:5-6` (`PEXELS = (id, w = 800) => ...`)
  - `src/data/contentDefaults.js:8` (LOCAL helper — DO NOT modify)
  - `src/data/contentDefaults.js:16` (`HOME_HERO_DEFAULTS.background_image: PEXELS(2144200, 1920)` — explicit 1920 width; this ID is in scope; the hero is rendered at `min-h-[40vh]` mobile / `min-h-screen` desktop, so the file must be wide — at least 1920px)
  - All PEXELS call sites in this file with in-scope IDs (~70 of 75 call sites will be replaced):
    - Line 16 (HOME_HERO bg, Pexels 2144200, w=1920) → hero filename
    - Lines 35, 43, 51, 59, 67 (CATEGORY_GRID_DEFAULTS, IDs 140831, 14105, 2067396, 1793037, 132694)
    - Lines 73, 80, 87 (ABOUT_DEFAULTS, IDs 140831, 1793037, 5702761)
    - Lines 97, 102, 107, 112, 117, 122 (GALLERY_DEFAULTS, IDs 140831, 32916204, 32706248, 14766327, 16402099, 38058461)
    - Lines 148, 155, 162, 169, 176, 183 (NEWS_DEFAULTS, IDs 2144200, 37353913, 14105, 5702761, 140831, 1793037)
    - Lines 196, 204, 212, 220, 228, 236 (SIGNATURE_ITEMS_DEFAULTS, IDs 14766327, 16402099, 38058461, 37353913, 32916204, 1793037)
    - Lines 247, 254, 261 (PROMO_CARDS_DEFAULTS, IDs 140831, 2144200, 37353913)
    - Lines 266, 267, 268, 269, 270, 271 (IMAGE_CAROUSEL_DEFAULTS — IDs 2144200, 132694, 2067396, 14766327, then LOCAL lines 270-271 already use local — the LOCAL ones at lines 270, 271 are untouched)
    - Lines 279, 280, 281, 282 (DELIVERY_DEFAULTS.areas, IDs 5702761, 32916204, 5702761, 5702761)
    - Lines 293, 299, 305, 311, 317, 323, 329, 335, 341 (FAQ_DEFAULTS, IDs 2144200, 2144200, 140831, 2067396, 14105, 1793037, 5702761, 38058461, 132694)
    - Lines 348, 349, 350, 351, 352 (BROWSE_BY_BAKE_DEFAULTS, IDs 140831, 14105, 37353913, 2067396, 1793037)
    - Lines 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384 (INSTAGRAM_DEFAULTS.images — 17 entries; first 12 are Pexels-in-scope IDs 140831, 2144200, 1793037, 132694, 14105, 2067396, 32421567, 32916204, 37353913, 32421567, 14766327, 38058461; last 5 at lines 380-384 are already LOCAL — untouched)
    - Lines 462, 467, 472, 477, 482, 487, 489, 493, 498, 500, 501 (PRODUCT_CAROUSEL_DEFAULTS, IDs 2144200, 1793037, 37110821, 132694, 34155188, 29230134, 7328340 [NOT in scope — line 489 untouched], 34155188 [dup of 482 — same filename], 14105, 37353913, 2067396)
- **Acceptance:**
  - Every `PEXELS(<id>)` and `PEXELS(<id>, <explicit_w>)` call in contentDefaults.js whose `<id>` is in the 21-target set is replaced with `LOCAL('<target_local_filename>')` (or `LOCAL('<basename>-<w>.jpeg')` for multi-width rows; worker's choice but documented in commit message).
  - `HOME_HERO_DEFAULTS.background_image` becomes `LOCAL('<hero_target_filename>')` where `<hero_target_filename>` is the hero slot's filename from the mapping (likely the 1920-wide variant of the bespoke-cake photo).
  - No PEXELS calls remain for the 21 IDs in this file. Grep audit:
    `Get-ChildItem -Path src/data/contentDefaults.js | Select-String -Pattern 'PEXELS\((2067396|2144200|140831|37353913|38058461|14105|132694|1793037|5702761|14766327|32916204|16402099|20677473|32706248|37110821|34155188|29230134|32421567|9820|4242130|1055271)'`
    returns no matches.
  - All TEXT content (slogans, descriptions, FAQs, footer text, contact details, prices where present, slugs, hrefs) is UNCHANGED.
  - All existing `LOCAL(...)` calls (lines 270, 271, 380-384, 416-419, 441-445, 458) are untouched.
- **QA happy path:** `npm run build` succeeds. Grep audit returns no matches. `npm run lint` passes. Evidence: `.omo/artifacts/todo-2-2.log`.
- **QA failure path:** A FAQ entry shows a broken image at runtime → verify the assigned local filename exists in `public/images/` and the mapping's row matches the FAQ slot's intended concept. Aspects for FAQ thumbs are 40×40 / 56×56 fixed circles using `object-cover` — any reasonable 1:1 source works.
- **Commit:** `feat(image-swap): contentDefaults.js — replace top-21 Pexels refs`

#### TODO 2.3 — Replace hardcoded Pexels URLs in page heroes + About story
- **References:**
  - `src/pages/CakesPage.jsx:9` — `const HERO = 'https://images.pexels.com/photos/2144200/pexels-photo-2144200.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80&fit=crop'` (Pexels ID 2144200, w=1200)
  - `src/pages/CupcakesPage.jsx:6` — `const HERO = 'https://images.pexels.com/photos/14105/pexels-photo-14105.jpeg?...w=1200...'` (Pexels ID 14105, w=1200)
  - `src/pages/DessertsPage.jsx:6` — `const HERO = 'https://images.pexels.com/photos/14766327/...w=1200...'` (Pexels ID 14766327, w=1200)
  - `src/pages/AboutPage.jsx:62` — `src="https://images.pexels.com/photos/2144200/...w=600..."` inline in JSX (Pexels ID 2144200, w=600 — different slot from CakesPage hero, but same Pexels ID; the mapping determines whether the same photo is reused or a different photo is assigned; the user's constraint "don't repeat them" applies to the 21 RAW photos, so the same `target_local_filename` CAN appear on multiple slots when the same Pexels ID was reused — this is consistent with how Pexels was used).
  - Rendering: `CategoryHero.jsx` uses `relative h-[30vh] md:h-[40vh] overflow-hidden` with `<img class="w-full h-full object-cover">` — free-height hero slot, target aspect `free-height-hero`, target width 1600 or 1920.
  - About story image: `aspect-[4/3] overflow-hidden rounded-lg`, `object-cover` — `target_aspect: 4:3`, target width 600-800.
  - LOCAL helper is currently defined in `src/data/products.js:4` as: `const LOCAL = (name) => ${import.meta.env.BASE_URL}images/${encodeURIComponent(name)}` and identically in `src/data/contentDefaults.js:8`. NOT exported.
  - **PINNED PATTERN (no worker judgment):** Each of the 3 page files (`CakesPage.jsx`, `CupcakesPage.jsx`, `DessertsPage.jsx`) and `AboutPage.jsx` re-declares a local `LOCAL` helper inline BEFORE its use, byte-identical to the existing definitions:
    ```js
    const LOCAL = (name) => `${import.meta.env.BASE_URL}images/${encodeURIComponent(name)}`
    ```
    The re-declaration is internal to the file (no cross-file imports), no naming collision with other top-level consts.
  - **HARDCODING `/images/<filename>` STRING LITERALS IS NOT ACCEPTABLE.** Reasoning: `CategoryHero.jsx:9` renders `src={image}` directly WITHOUT calling `getImageUrl()`, and the About story `<img src="..."> ` is also raw. Deployed site is under Vite base `/crumbs-bakery-/` (vite.config.js:6), so an absolute path like `/images/foo.jpeg` would resolve to `https://host/images/foo.jpeg` instead of `https://host/crumbs-bakery-/images/foo.jpeg` — broken in production. The `LOCAL()` helper prepends `import.meta.env.BASE_URL`, so the URL becomes `/crumbs-bakery-/images/foo.jpeg` correctly.
- **Acceptance:**
  - Each of the 4 hardcoded Pexels URLs is replaced with a local reference to the hero_filename (or About-story filename) from the mapping.
  - For Pexels ID `2144200` (used twice — CakesPage hero AND AboutPage story), both refs point to the SAME local file (the user's constraint about not repeating raw photos applies to the 21 source files; one Pexels ID = one assigned raw = one target file, even if used in 2 slots).
  - The 3 page heroes (Cakes, Cupcakes, Desserts) render with no broken img icon on `npm run preview` → /cakes, /cupcakes, /desserts. The About story image renders correctly at /about.
  - No other line in these 4 files is modified (imports lists, JSX structure, other consts unchanged).
- **QA happy path:** `npm run build` succeeds. Manual navigation via Playwright/agent-browser to /cakes, /cupcakes, /desserts, /about — all 4 heroes render with the new local image, no broken icons, no squashed aspect. Evidence: screenshots at `.omo/artifacts/screenshots/{cakes,cupcakes,desserts,about}-hero-post.png`.
- **QA failure path:** Hero image is squashed or cropped wrong → verify the assigned local file's aspect matches the hero slot (`free-height-hero` with width 1600+). If not, regenerate from raw with `target_aspect: 'free-height-hero'` width 1600 in TODO 1.3. About story shows wrong photo → check the mapping row for Pexels ID 2144200; if the assigned raw is a hero-style photo that doesn't suit a 4:3 slot, the worker may pick a different raw from the 21 to assign to this slot (the 21 raws are fungible across the 21 IDs — the constraint is no repeats, not specific assignments).
- **Commit:** `feat(image-swap): replace hardcoded hero URLs with LOCAL`

#### TODO 2.4 — Sheet cakes marquee + About team Pexels helpers
- **References:**
  - `src/components/SheetCakesMarquee.jsx:4` (`const PEXELS = (id) => https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=200&q=80&fit=crop`)
  - `src/components/SheetCakesMarquee.jsx:9-11` (3 marquee items: Pexels IDs 140831, 2144200, 1793037 — all in top-21)
  - `src/components/SheetCakesMarquee.jsx:49-53` (the `<img>` rendering uses `h-12 w-12 rounded-full object-cover` — 48×48 circle, so source aspect doesn't matter as long as `object-cover` is preserved)
  - `src/pages/AboutPage.jsx:6` (`const PEXELS = (id) => ...w=300...`)
  - `src/pages/AboutPage.jsx:9-12` (team members — 4 entries: 3 use Pexels ID 5702761 [Jemma, Priya, Arun] and 1 uses 32916204 [Maya]). All IDs are in scope.
  - `src/components/SheetCakesMarquee.jsx` is also one of the 11 files targeted by `fix-files.mjs` (whitespace normalizer) — but we are NOT running `fix-files.mjs`; the worker must NOT introduce changes that would conflict with it. Just edit the data array, leave the rest alone.
- **Acceptance:**
  - `SheetCakesMarquee.jsx` marquee 3 image refs (lines 9-11) become `LOCAL('<target_local_filename>')` (or hardcoded `/images/<filename>` strings; worker's choice — document in commit). The `<img class="h-12 w-12 rounded-full object-cover">` rendering is unchanged.
  - `AboutPage.jsx` team 4 image refs (lines 9-12) become `LOCAL(...)` or hardcoded `/images/...` per the mapping. The 3 refs to Pexels ID 5702761 may map to ONE target local file (if the worker identified a single team/group photo) or to THREE distinct target files (if 3 distinct person photos were identified among the 21 raws). The 1 ref to 32916204 maps to its own target file.
  - **PEXELS HELPER DEFINITIONS MUST REMAIN UNTOUCHED** in both files after the swap. Even if `PEXELS(...)` calls in that file are all in scope (e.g., `SheetCakesMarquee.jsx` has only the 3 in-scope IDs at lines 9-11), the helper declaration at line 4 stays. Rationale: the user's stated constraint is "nothing else changes," and removing a helper function is a code change beyond a photo swap. Dead but harmless code is preferable to scope creep. Applied uniformly to ALL files touched by this plan (SheetCakesMarquee.jsx, AboutPage.jsx, products.js, contentDefaults.js — all helper declarations stay).
  - No other lines change in SheetCakesMarquee.jsx — the `i % 3` cycle, JSX structure, classes, animation config unchanged. No other lines change in AboutPage.jsx except the team array (the story image at line 62 was handled in TODO 2.3).
- **QA happy path:** `npm run build` succeeds. Homepage renders the marquee with 3 distinct new images cycling via `i % 3`. /about renders all 4 team avatars with new images. Evidence: screenshots at `.omo/artifacts/screenshots/homepage-marquee-post.png` and `.omo/artifacts/screenshots/about-team-post.png`.
- **QA failure path:** Marquee cycle references a filename not in `public/images/` → grep audit + verify mapping + TODO 1.3 output. AboutPage team renders an empty avatar → check that the assigned filename exists and the swap uses `LOCAL(...)` consistently with the existing LOCAL helper definition.
- **Commit:** `feat(image-swap): replace marquee + About team Pexels refs`

### Wave 3 — Verification

#### TODO 3.1 — Final build + grep audit + per-page screenshot QA
- **References:**
  - All changed files in Waves 1-2
  - `package.json:6-11` (scripts)
  - `vite.config.js:6` (base path `/crumbs-bakery-/`)
- **Acceptance:**
  - `npm run build` exits 0 with no warnings about unresolved image URLs or missing assets.
  - `Get-ChildItem -Path src -Recurse -Include *.js,*.jsx | Select-String -Pattern 'images\.pexels\.com/photos/(2067396|2144200|140831|37353913|38058461|14105|132694|1793037|5702761|14766327|32916204|16402099|20677473|32706248|37110821|34155188|29230134|32421567|9820|4242130|1055271)/'` returns 0 hits — none of the 21 targeted IDs remain referenced anywhere in source.
  - The 7 intentionally-kept IDs ARE still referenced: `Get-ChildItem -Path src -Recurse -Include *.js,*.jsx | Select-String -Pattern 'images\.pexels\.com/photos/(14969996|7328340|35224342|7358362|7358386|34979324|20558713)/'` returns hits matching the expected call sites (1-2 each).
  - `npx vite preview` started on a free port (default 4173; if busy, use `--port 4174`).
  - Playwright or agent-browser opened 6 pages: `/`, `/cakes`, `/cupcakes`, `/desserts`, `/about`, `/menus` (base path prepended: `/crumbs-bakery-/`).
  - For each page, a screenshot saved to `.omo/artifacts/screenshots/<page>-post-swap.png`.
  - Each screenshot eyeballed against the section's expected layout: no aspect distortion, no broken image icons, no squashed/stretched photos, `object-cover` preserved. Screenshot for homepage in particular covers the marquee, gallery grid, image carousel, instagram strip, FAQ thumbs, news cards, delivery cards, browse-by-bake, signature items — all of these must show post-swap images, not Pexels.
  - `Get-ChildItem -Path public/images/raw | Measure-Object` returns `Count: 30` (raws untouched).
  - `Get-ChildItem -Path public/images/*.jpeg | Measure-Object -Property Length -Maximum` returns max < 500kb.
- **QA happy path:** All 6 screenshots render complete with new images. Grep audit returns 0 hits for the 21 IDs. 7 intentional IDs still present. Raw count still 30. Max file size < 500kb. Evidence: screenshots + terminal log at `.omo/artifacts/todo-3-1.log`.
- **QA failure path:** Any page shows a 404 image or broken aspect → check `public/images/` for missing file (TODO 1.3 issue) or wrong filename in swap (TODO 2.x issue). Fix and re-screenshot. If a hero slot shows an obviously wrong photo (e.g., a brownie photo in the hero slot), the worker may swap the mapping assignment between two raw photos and re-run TODO 1.3 + the affected TODO 2.x edit. This is the only re-mapping permitted without going back to the user.
- **Commit:** `test(image-swap): final build + grep audit + per-page visual QA`

#### TODO 3.2 — Final verification wave (F1-F4 in parallel)
- **References:**
  - The completed plan file: `.omo/plans/swap-pexels-with-local-images.md`
  - All artifacts under `.omo/artifacts/`
  - Git working tree state
- **Acceptance:**
  - **F1 plan compliance audit:** Every targeted Pexels ID is gone from `src/`; no scope creep into CSS classes, JSX text content, or copy; `public/images/raw/` untouched (count still 30); `public/images/` has 21+ new sized files each < 500kb. Verifier reads the plan, the mapping, and runs the grep audits. Verdict: APPROVE / REJECT with cited file:line.
  - **F2 code quality review:** For each file with a `PEXELS(...)` helper, the helper is REMOVED if 0 `PEXELS(...)` calls remain in the file (SheetCakesMarquee likely qualifies; products.js and contentDefaults.js do NOT qualify because the 7 out-of-scope IDs still call PEXELS). Verifier inspects each touched file. Verdict: APPROVE / REJECT with cited file:line.
  - **F3 manual QA:** 6 page screenshots in `.omo/artifacts/screenshots/` opened and eyeballed — no broken images, no aspect distortion, heroes render new local photos, gallery/marquee/FAQ thumbs look natural. Verifier opens each PNG (via `look_at` single-image call OR browser screenshot inspection by the agent). Verdict: APPROVE / REJECT with cited screenshot + issue.
  - **Fallback when multimodal is unavailable (zai/look_at return errors):** F3 degrades to non-visual verification — worker confirms (a) each of the 6 expected screenshot files exists at non-trivial size (>50kb, indicating a real render not a blank), (b) `npm run preview` returned HTTP 200 for each of the 6 routes, (c) NO `<img>` element in any screenshot's HTML has a `naturalWidth=0` (broken-image indicators via Playwright `page.$$('img').map(el => el.naturalWidth)`). Visual aspect-distortion QA is then deferred: F3 records " DEFERRED to user at start-work completion: visual aspect-distortion verification; agent confirmed no broken images and HTTP 200s only." The other three F items (F1, F2, F4) still must APPROVE; F3 with deferred-visual is APPROVE-with-deferred-note, not REJECT.
  - **F4 scope fidelity:** `git diff --stat` matches EXACTLY this file list (no more, no less):
    - `package.json` (sharp devDep + swap-images script)
    - `package-lock.json` (sharp install)
    - `scripts/swap-images.mjs` (new)
    - `src/data/products.js`
    - `src/data/contentDefaults.js`
    - `src/components/SheetCakesMarquee.jsx`
    - `src/pages/AboutPage.jsx`
    - `src/pages/CakesPage.jsx`
    - `src/pages/CupcakesPage.jsx`
    - `src/pages/DessertsPage.jsx`
    - `public/images/<21+ new files>` (binary diffs)
    - `.omo/artifacts/*` (mapping, logs, screenshots, final-verification.md)
  - A summary file `.omo/artifacts/final-verification.md` records all four verdicts with cited evidence.
- **QA happy path:** All four F items return APPROVE. Summary file exists with verdicts and evidence paths.
- **QA failure path:** Any F item returns REJECT with a cited issue → worker fixes in the same session, re-runs the rejecting F item ONLY (F1-F4 can rerun independently), appends retry summary to `.omo/drafts/swap-pexels-with-local-images.md` and to `.omo/artifacts/final-verification.md`. Repeat until all four APPROVE.
- **Commit:** `docs(image-swap): final verification wave receipts`

## Final verification wave

Runs in parallel after TODO 3.2. ALL must APPROVE.

- **F1. Plan compliance audit** — every targeted Pexels ID is gone from `src/`; no scope creep into CSS/JSX text content; `public/images/raw/` count still 30; `public/images/` new files each < 500kb.
- **F2. Code quality review** — PEXELS helper definitions removed where 0 calls remain in the file; consistent `LOCAL(...)` or hardcoded `/images/...` usage per file per existing convention.
- **F3. Real manual QA** — 6 Playwright/agent-browser screenshots at `.omo/artifacts/screenshots/{home,cakes,cupcakes,desserts,about,menus}-post-swap.png` show correct rendering: heroes, gallery, marquee, TeamPage avatars, FAQ thumbs, news cards, signature items, instagram strip all render new local images with no broken icons or aspect distortion.
- **F4. Scope fidelity** — `git diff --stat` matches exactly the file list in TODO 3.2 acceptance.

Verdicts recorded in `.omo/artifacts/final-verification.md`. All four APPROVE before handoff to the user.

## Commit strategy

- Conventional Commits per todo. Atomic commits.
- Prefixes:
  - `feat(image-swap): ` for code swaps (TODOs 2.1, 2.2, 2.3, 2.4) and the resize script addition (TODO 1.2).
  - `chore(image-swap): ` for asset production (TODO 1.3) and `package.json`/`package-lock.json` changes.
  - `docs(image-swap): ` for the mapping ledger (TODO 1.1) and the final verification receipts (TODO 3.2).
  - `test(image-swap): ` for the final build + visual QA pass (TODO 3.1).
- One commit per todo. No squashing across todos — the 8 commits walk wave-by-wave through asset prep, code swaps, and verification.
- Branch: worker creates `feat/image-swap` from `main` (or current default branch). All 8 commits land there. PR open at TODO 3.2 end if using PR workflow; otherwise direct push after F1-F4 pass.

## Success criteria

- `npm run build` exits 0 with no image-related warnings.
- Grep audit: `Get-ChildItem -Path src -Recurse -Include *.js,*.jsx | Select-String -Pattern 'images\.pexels\.com/photos/(2067396|2144200|140831|37353913|38058461|14105|132694|1793037|5702761|14766327|32916204|16402099|20677473|32706248|37110821|34155188|29230134|32421567|9820|4242130|1055271)/'` returns 0 hits.
- 7 intentionally-kept Pexels IDs (`14969996`, `7328340`, `35224342`, `7358362`, `7358386`, `34979324`, `20558713`) are still referenced and rendering.
- 6 page screenshots (`.omo/artifacts/screenshots/`) show no broken/aspect-distorted images — all swaps render `object-cover`-correct in their assigned slots.
- `public/images/raw/` count unchanged at 30.
- `public/images/` contains 21+ new files each < 500kb.
- `git diff --stat` matches the expected file list (TODO 3.2 acceptance) with NO spurious edits to CSS, JSX text, or component structure.
- `.omo/artifacts/final-verification.md` records APPROVE for all four F items.