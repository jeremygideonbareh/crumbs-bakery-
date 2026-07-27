# Make All Pages CMS-Editable — Phased Plan

## Summary
Currently only the Home page sections are editable in the admin Content Manager. All other pages (Cakes, Cupcakes, Desserts, About, Contact, Reviews, Menu) use hardcoded data. This plan adds section keys, field schemas, admin mappings, and seeds DB rows so every page section becomes editable.

---

## Phase 0 — Deploy Current Changes (1-2 mins)

Before starting the new work, deploy the already-completed changes:

- `supabase/db push` — ✅ Already applied (bucket + seed menus)
- `npm run build` — Already built (index-D_s1Micg.js)
- `npx wrangler deploy` — **Needs to run**

### Command
```powershell
$env:CLOUDFLARE_API_TOKEN = "cfut_...token..."
Set-Location "C:\Users\cloud\OneDrive\Desktop\Hybrid_Second_Brain\clients website\crumbs"
npm run build
npx wrangler deploy
```

---

## Phase 1 — Category Pages (Cakes, Cupcakes, Desserts)

### What changes
Each page has:
1. **Hero** — title, subtitle, background image (CategoryHero component)
2. **Delivery section** — heading, 2 card headings + 2 card descriptions (inline HTML)

### Section keys needed (6 new)
| Key | Page | Section Type | Fields |
|-----|------|-------------|--------|
| `cakes_hero` | Cakes | `category_hero` | title, subtitle, image |
| `cakes_delivery` | Cakes | `delivery_compact` | heading, card1_heading, card1_desc, card2_heading, card2_desc |
| `cupcakes_hero` | Cupcakes | `category_hero` | same |
| `cupcakes_delivery` | Cupcakes | `delivery_compact` | same |
| `desserts_hero` | Desserts | `category_hero` | same |
| `desserts_delivery` | Desserts | `delivery_compact` | same |

### Files to change
- `src/components/admin/SectionEditorModal.jsx` — Add `category_hero` and `delivery_compact` field schemas
- `src/pages/CakesPage.jsx` — Use `usePageSection()` for hero + delivery data
- `src/pages/CupcakesPage.jsx` — Same
- `src/pages/DessertsPage.jsx` — Same
- `src/data/adminSectionMap.js` — Add section entries under cakes/cupcakes/desserts pages
- `supabase/migrations/20260727000001_seed_category_sections.sql` — NEW: seed all 6 rows

### SectionEditorModal field schemas
```js
category_hero: [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
  { key: 'image', label: 'Background Image', type: 'image' },
],
delivery_compact: [
  { key: 'heading', label: 'Section Heading', type: 'text' },
  { key: 'card1_heading', label: 'Card 1 Heading', type: 'text' },
  { key: 'card1_desc', label: 'Card 1 Description', type: 'textarea' },
  { key: 'card2_heading', label: 'Card 2 Heading', type: 'text' },
  { key: 'card2_desc', label: 'Card 2 Description', type: 'textarea' },
],
```

### Page component changes (example: CakesPage.jsx)
```jsx
const heroData = usePageSection('cakes_hero', { 
  title: 'CAKES', 
  subtitle: 'Amazing cakes for any occasion...', 
  image: LOCAL('bespoke-cake.jpeg') 
})
const deliveryData = usePageSection('cakes_delivery', {
  heading: 'CAKE DELIVERY IN SHILLONG',
  card1_heading: 'Hand Delivery',
  card1_desc: 'Safe, contact-free delivery anywhere in Shillong...',
  card2_heading: 'Collection',
  card2_desc: 'Pick up from our Jaiaw cafe...',
})
```

---

## Phase 2 — About Page

### Section keys needed (6 new)
| Key | Section Type | Fields |
|-----|-------------|--------|
| `about_hero` | `content_single` | subtitle, title |
| `about_story` | `content_with_image` | heading, body (textarea), image |
| `about_timeline` | `about_timeline` | array of { year, event } |
| `about_values` | `card_grid_simple` | array of { title, desc } |
| `about_team` | `about_team` | array of { name, role, image } |
| `about_cta` | `content_single` | heading, body, button1_text, button1_link, button2_text, button2_link |

### Files to change
- `SectionEditorModal.jsx` — Add 6 new section type schemas
- `src/pages/AboutPage.jsx` — Replace all hardcoded data with usePageSection()
- `adminSectionMap.js` — Update About page sections
- Migration file for seeding

---

## Phase 3 — Contact Page

### Section keys needed (4 new)
| Key | Section Type | Fields |
|-----|-------------|--------|
| `contact_hero` | `content_single` | subtitle, title, description |
| `contact_info` | `contact_cards` | array of { label, value, href } |
| `contact_map` | `map_embed` | iframe_url |
| `contact_faq` | `faq_simple` | array of { question, answer } |

### Files to change
- `SectionEditorModal.jsx` — Add 4 new schemas
- `src/pages/ContactPage.jsx` — Use usePageSection() for all data
- `adminSectionMap.js` — Update Contact page
- Migration file for seeding

---

## Phase 4 — Reviews Page

### Section keys needed (3 new)
| Key | Section Type | Fields |
|-----|-------------|--------|
| `reviews_hero` | `content_single` | subtitle, title, rating_text |
| `reviews_cta` | `content_single` | heading, body, google_link, zomato_link |

### Notes
- Review cards already managed via `/admin/reviews` — no change needed
- Only hero + CTA sections need to be made editable
- The hardcoded review array in `ReviewsPage.jsx` stays as fallback

### Files to change
- `SectionEditorModal.jsx` — Add schemas
- `src/pages/ReviewsPage.jsx` — Use usePageSection() for hero + CTA
- `adminSectionMap.js` — Update Reviews page
- Migration file for seeding

---

## Phase 5 — Menu Page

### Currently
- Breadcrumb is hardcoded (trivial)
- `menu_categories` is already editable ✅

### Remaining
- Breadcrumb text could be seeded with defaults — low priority, skip

---

## Migration Strategy

Create ONE combined migration file per phase:

```
phase1: 20260727000001_seed_category_sections.sql
phase2: 20260727000002_seed_about_sections.sql
phase3: 20260727000003_seed_contact_sections.sql
phase4: 20260727000004_seed_reviews_sections.sql
```

Each migration uses the same pattern:
```sql
INSERT INTO page_sections (section_key, section_label, section_type) VALUES
  ('cakes_hero', 'Cakes Hero', 'category_hero'),
  ('cakes_delivery', 'Cakes Delivery', 'delivery_compact'),
  ...
ON CONFLICT (section_key) DO NOTHING;
```

---

## Summary of All New Section Keys

| Page | Section Keys | Type |
|------|-------------|------|
| Cakes | cakes_hero, cakes_delivery | category_hero, delivery_compact |
| Cupcakes | cupcakes_hero, cupcakes_delivery | category_hero, delivery_compact |
| Desserts | desserts_hero, desserts_delivery | category_hero, delivery_compact |
| About | about_hero, about_story, about_timeline, about_values, about_team, about_cta | content_single, content_with_image, about_timeline, card_grid_simple, about_team, content_single |
| Contact | contact_hero, contact_info, contact_map, contact_faq | content_single, contact_cards, map_embed, faq_simple |
| Reviews | reviews_hero, reviews_cta | content_single, content_single |
| **Total** | **19 new section keys** | |

---

## Verification

After each phase:
1. `supabase db push` — apply migration
2. `npm run build` — verify exit 0
3. `npx wrangler deploy` — deploy to Workers
4. Open admin → Content Manager → click the page tab → verify sections appear with Edit buttons
5. Change some content → Save → refresh the live page to verify

## Rollout Order

Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5

Can be done in parallel within a phase but phases should be sequential (each phase depends on prior deployments working).
