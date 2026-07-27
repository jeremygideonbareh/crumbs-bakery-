# Plan: Restore User-Uploaded Images to Page Sections

**Status:** Draft — awaiting user approval  
**Slug:** restore-user-images  
**Intent:** CLEAR — outcome known, implementation is straightforward  

## TL;DR (For humans)

When we cleared `page_sections.data` to fix the seed script, we also deleted the URL references pointing to your uploaded images. The **actual image files in Supabase Storage are safe** — we only cleared the database column that held the text references (URLs). The site now shows default images from `contentDefaults.js` because the section data is empty `{}`.

We need to restore the correct image URLs back into each section's `data` field. Since filenames are auto-generated timestamps (e.g., `1712345678-abc123.jpeg`), we can't auto-map which image goes to which section — we need your help to match them.

## Background

- **37 page_sections rows** exist, all with `data = '{}'::jsonb`
- **18 unique section_keys** that use images (hero, gallery, products, etc.)
- **User-uploaded images** are in Supabase Storage bucket `site-images` (public bucket, files intact)
- Image filenames format: `{timestamp}-{random}.{ext}` — no section identifier in filename
- Admin panel ImageUploader shows "Recently Uploaded" from this bucket via Browse button

## Dependencies

None — work is independent of any other plan.

## Approach

**Option A — Quickest: Manual re-selection via admin panel**
1. Go to `crumbsbakery.in/admin`
2. Open each section editor
3. Click **Browse** — your images appear under "Recently Uploaded"
4. Select the right image and save
5. Repeat for each section

Time estimate: ~15-30 minutes depending on how many sections need images

**Option B — Bulk script: I build a mapping tool**
1. A script lists ALL images in `site-images` bucket + ALL section_keys
2. Output: a mapping file where you tell us which image → which section
3. You edit the mapping file with the correct assignments
4. A second script uses `admin_upsert_page_section` to bulk-write the data back
5. Rebuild + redeploy

Time estimate: ~15 min setup + your input time

**Option C — Hybrid: List images, you pick, I restore specific sections**
1. I list all uploaded images and their public URLs
2. You tell me: "For section X, use image Y" (one at a time or as a list)
3. I run the RPC for each to restore the data

## Must NOT Have

- Do NOT clear or modify the `site-images` bucket — images stay as-is
- Do NOT re-run the seed script with `--force` — that would overwrite restored data
- Do NOT modify the new `admin_ensure_page_section` RPC or the seed script's safe mode

## Todo Steps

### Todo 1: List all images in site-images bucket + section_keys
- **WHERE:** Script / manual query against Supabase Storage
- **HOW:** Call Supabase Storage API to list `site-images` bucket files
- **EXPECT:** Complete list of filenames + public URLs
- **ACCEPTANCE:** Every file in bucket is visible with its public URL
- **QA:** Manually visit a public URL to confirm image loads

### Todo 2: Determine image-to-section mapping
- **WHERE:** User input (via the chosen approach)
- **HOW:** User identifies which storage image URL goes into which section_key
- **EXPECT:** A mapping JSON file: `{ "home_hero": { "background_image": "https://..." }, ... }`
- **ACCEPTANCE:** Every section that needs images has mapped URLs

### Todo 3: Write + run restore script
- **WHERE:** `scripts/restore-section-images.mjs`
- **HOW:** Read mapping file → call `admin_upsert_page_section` for each section with the correct data (full data payload from seed defaults, but with image URLs replaced by storage URLs)
- **EXPECT:** Each section's `data` contains the correct image URLs pointing to Supabase Storage
- **ACCEPTANCE:** `supabase.from('page_sections').select('section_key, data')` shows non-empty data with storage URLs

### Todo 4: Rebuild + redeploy
- **WHERE:** `npm run build` + `npx wrangler deploy`
- **HOW:** Standard build and deploy
- **EXPECT:** Build passes, deploy succeeds
- **ACCEPTANCE:** Build exits 0, wrangler shows "Published"

### Todo 5: Verify on live site
- **WHERE:** crumbsbakery.in
- **HOW:** Visit each section visually, confirm user images appear
- **EXPECT:** User-uploaded images display on the correct sections
- **ACCEPTANCE:** User confirms images are correct

## Rollback

If restore goes wrong, re-run the seed with `node scripts/seed-sections.mjs` (safe mode — re-creates empty rows if they were deleted). The images in storage are never touched by any of these steps.
