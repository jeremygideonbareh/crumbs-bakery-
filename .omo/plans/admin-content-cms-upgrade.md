# admin-content-cms-upgrade — Work Plan

## TL;DR (For humans)

**What you'll get:** The Admin Content page is reorganized so every section clearly shows which page it belongs to (Home, Cakes, Cupcakes, Desserts, Menu, About, Reviews, Contact, Order Now). Each page tab lists only its relevant sections. Every section gets a visual breadcrumb showing its position on the live page. Every card, every photo, and every text element becomes editable through a consistent interface.

**What it will NOT do:**
- Will NOT change the Supabase schema or require a database migration
- Will NOT modify any live website component, page layout, or CSS
- Will NOT delete or restructure existing admin pages (Products, Orders, Messages remain as-is)
- Will NOT break existing saved section data

**Effort:** 5 waves, 8 TODOs. Core changes to AdminContent.jsx (page grouping), SectionEditorModal.jsx (breadcrumbs + location hints), and adding support for missing section types (team, reviews integration).

## Scope

Upgrade the Admin Content panel at `src/pages/admin/AdminContent.jsx` and `src/components/admin/SectionEditorModal.jsx` to:

1. Group all sections by website page route via tab navigation
2. Show clear page-location indicators (breadcrumbs, section preview labels)
3. Make every page's content editable — including sections currently not in the admin (team, reviews linkage)
4. Ensure every image field uses the image uploader
5. Link product categories into their respective page tabs

Out of scope:
- Creating a new backend / database schema
- Modifying any live page component in `src/pages/` or `src/components/`
- Modifying AdminProducts, AdminCategories, AdminOrders, AdminMessages, AdminSettings pages
- Changing the SectionEditorModal.jsx rendering logic — only adding page-location metadata

## Verification strategy

Agent-executed QA per todo. Zero human intervention.

- **Build:** npm run build exits 0 with no warnings
- **Visual QA:** Playwright screenshots of Admin Content page showing each tab with correct sections
- **Edit flow:** Open each page tab, edit a section, save, verify section data persists
- **Image upload:** Verify every image-type field in every section shows the ImageUploader component
- **Missing sections:** Verify team and reviews are accessible from Content Manager
- **Products link:** Verify each category page tab shows product count + link to AdminProducts

## Execution strategy

Five waves in dependency order.

- **Wave 1 (Schema definition):** Build the page→sections mapping table that defines which section_key patterns belong to which page route. Add missing section type schemas (team, contact, order_cta).
- **Wave 2 (Page grouping):** Rewrite AdminContent.jsx to use tab-based navigation with page tabs. Add location badges to section cards.
- **Wave 3 (Enhanced editing):** Add page-location breadcrumb to SectionEditorModal. Audit all image fields use uploader.
- **Wave 4 (Missing content):** Add team editor, reviews integration tab, contact/order-now section types.
- **Wave 5 (Verification):** Build, Playwright screenshots, edit-flow testing.

## Todos

### Wave 1 — Schema & mapping

1. [x] TODO 1.1 — Build page→sections mapping table + add missing section types

   **References:**
   - src/data/contentDefaults.js — all default section data
   - src/pages/admin/AdminContent.jsx — existing AdminContent
   - src/components/admin/SectionEditorModal.jsx — existing SECTION_FIELDS
   - src/pages/admin/AdminReviews.jsx — existing review management
   - src/pages/AboutPage.jsx — team section (currently hardcoded)

   **Tasks:**
   1. Create `src/data/adminSectionMap.js` with PAGE_SECTIONS mapping 9 page groups (home, cakes, cupcakes, desserts, menu, about, reviews, contact, order-now), each with page label, route, icon, description, and list of section keys
   2. Add missing section type schemas to SectionEditorModal SECTION_FIELDS:
      - `team` type: array of members with name, role, image
      - `contact` type: address, phone, email, hours, social links
      - `order_cta` type: heading, subtitle, button_text, features array, background_image
   3. Add team, contact, order_cta to typeIcons and typeColors maps in AdminContent.jsx

   **Acceptance:**
   - src/data/adminSectionMap.js exists with all 9 page groups
   - SectionEditorModal has new section types: team, contact, order_cta
   - Every image field in every schema uses type: 'image'
   - Build passes

   **QA:** Read the mapping file — verify 9 page groups. Check CDB keys match. npm run build exits 0.
   **Commit:** feat(admin-cms): add page→sections mapping table + missing section type schemas

### Wave 2 — Page grouping in AdminContent

2. [x] TODO 2.1 — Rewrite AdminContent.jsx with tab-based page navigation

   **References:**
   - src/pages/admin/AdminContent.jsx (current 212-line flat list)
   - src/data/adminSectionMap.js (from TODO 1.1)
   - src/components/ui/button.jsx
   - src/components/admin/AdminLayout.jsx — for NavLink pattern reference

   **Tasks:**
   1. Import PAGE_SECTIONS from @/data/adminSectionMap
   2. Add activeTab state initialized to 'home' + ordered pageKeys array
   3. Render horizontal pill tabs at top: one per page group, active tab teal-highlighted, each with lucide icon
   4. Filter sections list by active tab's section key patterns; uncategorized at bottom
   5. Add page description paragraph below tab bar
   6. For tabs with productCategory, show product count card with "View all in Products" link
   7. For reviews tab, show link-out card to /admin/reviews

   **Acceptance:**
   - Page tabs render with correct icons
   - Switching tabs filters section list correctly
   - Product tabs show count + link
   - Build passes

   **QA:** npm run build exits 0. Visually verify via playwright that tabs render and filter correctly.
   **Commit:** feat(admin-cms): group content sections by page tabs

3. [x] TODO 2.2 — Add location badges + page-breadcrumb to each section card

   **References:**
   - src/pages/admin/AdminContent.jsx — section card rendering
   - src/data/adminSectionMap.js — section location information

   **Tasks:**
   1. Add getSectionLocation(section_key) helper that returns { page, section } from PAGE_SECTIONS
   2. Add "Location" line to each section card: format "Homepage → Hero Section" with teal text
   3. Add subtle visual separator between sections from different page positions

   **Acceptance:**
   - Every section card shows a <Page> → <Section> location
   - Build passes

   **QA:** Read AdminContent.jsx — location helper present. Build passes.
   **Commit:** feat(admin-cms): add page-location badges to section cards

### Wave 3 — Enhanced editing

4. [x] TODO 3.1 — Add page-location breadcrumb to SectionEditorModal header

   **References:**
   - src/components/admin/SectionEditorModal.jsx — modal header at lines 599-608
   - src/data/adminSectionMap.js — location info

   **Tasks:**
   1. Import the getSectionLocation helper into SectionEditorModal
   2. In modal header below "Type: {section.section_type}", add: "<- {Page} -> {Section}" in teal text
   3. Add "Preview on /{route}" link pointing to the correct page route

   **Acceptance:**
   - Modal header shows page breadcrumb
   - "View on site" link points to correct page route
   - Build passes

   **QA:** Open any section in editor — breadcrumb visible. Build passes.
   **Commit:** feat(admin-cms): add page breadcrumb to section editor modal

5. [x] TODO 3.2 — Ensure every image field has the image uploader

   **References:**
   - src/components/admin/SectionEditorModal.jsx — all SECTION_FIELDS schemas
   - src/components/admin/ImageUploader.jsx
   - src/components/admin/ImagePicker.jsx

   **Tasks:**
   1. Audit every SECTION_FIELDS type:image field — verify rendered with ImageUploader in SimpleField and ArrayItemEditor
   2. Fix any image field rendered as plain text input
   3. Verify the social type's images array field uses ImageUploader for each __value__ entry

   **Acceptance:**
   - Every type: 'image' field renders with ImageUploader
   - No image field is plain text input
   - Build passes

   **QA:** Grep SECTION_FIELDS for every 'image' occurrence — verify each uses uploader. Build passes.
   **Commit:** fix(admin-cms): ensure all image fields use uploader component

### Wave 4 — Missing content coverage

6. [x] TODO 4.1 — Add team section support

   **References:**
   - src/pages/AboutPage.jsx — current hardcoded team array
   - src/components/admin/SectionEditorModal.jsx — SECTION_FIELDS
   - src/data/adminSectionMap.js — already has team key

   **Tasks:**
   1. Add team type to SECTION_FIELDS (array of { name, role, image })
   2. Add team to typeIcons and typeColors in AdminContent.jsx

   **Acceptance:**
   - Team sections can be created and edited in content manager
   - Each team member has name, role, and photo
   - Build passes

   **QA:** About tab in content manager shows "Team Members" section. Edit opens modal with name/role/image fields.
   **Commit:** feat(admin-cms): add team section editing support

7. [x] TODO 4.2 — Add reviews tab integration + order-now/contact section types

   **References:**
   - src/pages/admin/AdminReviews.jsx
   - src/data/contentDefaults.js — FOOTER_DEFAULTS for contact
   - src/data/adminSectionMap.js

   **Tasks:**
   1. Reviews tab: fetch reviews count, show summary card with "Manage Reviews →" link to /admin/reviews
   2. Contact tab: ensure footer type includes hours field
   3. Order Now tab: render order_cta section type with heading, subtitle, button_text, features array, background_image

   **Acceptance:**
   - Reviews tab shows summary + link
   - Contact tab shows footer fields with hours editable
   - Order Now tab shows CTA section fields
   - Build passes

   **QA:** Visit each new tab. Build passes.
   **Commit:** feat(admin-cms): add reviews, contact, and order-now page tabs

### Wave 5 — Verification

8. [x] TODO 5.1 — Full build + Playwright screenshot QA

   **References:**
   - All changed files
   - vite.config.js (base path)

   **Acceptance:**
   - npm run build exits 0
   - Playwright opens Admin Content page and screenshots each tab
   - Screenshots saved to .omo/artifacts/screenshots/admin-content-*.png
   - Each tab shows correct sections for that page
   - Edit flow works end-to-end

   **QA:** All screenshots show correct tab content. Edit flow completes. Build passes.
   **Commit:** test(admin-cms): final build + screenshot QA

## Final verification wave

Runs after TODO 5.1. All must APPROVE.

- [x] F1. Plan compliance audit — every page tab shows correct sections; no live page components modified; no CSS changes; no database schema changes.
- [x] F2. Code quality review — consistent SECTION_FIELDS schemas; no dead code; proper error handling in API calls.
- [x] F3. Real manual QA — page tabs navigate correctly; sections render right content per tab; edit flow works; image upload works; save persists.
- [x] F4. Scope fidelity — git diff --stat matches expected file list with NO spurious edits.

Verdicts recorded in .omo/artifacts/final-verification.md. All four APPROVE before handoff.

## Commit strategy

- Conventional Commits per todo. Atomic commits.
- Prefixes: feat(admin-cms) for features, fix(admin-cms) for fixes, test(admin-cms) for QA, docs(admin-cms) for verification receipts.
