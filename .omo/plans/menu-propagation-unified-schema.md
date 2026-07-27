# Menu Item Propagation — Single Source of Truth

## Problem

Currently menu items exist in **3 separate unlinked data stores**:

| Section | Page | Scope |
|---------|------|-------|
| `menu_categories` | MenusPage | Full menu with categories, items, prices, subcategories |
| `signature_items` | HomePage → "Signature bakes" | Featured product highlights (separate copy of data) |
| `product_carousel` | HomePage → "Featured Bakes" | Curated product carousel (separate copy of data) |

Editing an item's price/name/description in `menu_categories` does NOT update it on the Home page. The user must edit 3 places for the same item.

## Goal

Make `menu_categories` the **single source of truth** for ALL menu item data. The Home page sections (`signature_items`, `product_carousel`) derive their data from `menu_categories` by referencing item names.

---

## Changes Required

### 1. SectionEditorModal.jsx — Add fields to `menu_categories` items

Add 3 new fields to the `items` sub-array:

```js
{ key: 'highlight', label: 'Homepage badge text (e.g. "Best Seller")', type: 'text' },
{ key: 'badge', label: 'Badge CSS color (e.g. bg-amber-100 text-amber-700)', type: 'text' },
{ key: 'featured', label: 'Show on Homepage? (true/false)', type: 'text' },
```

Also change `image` type from `'text'` to `'image'` so users can pick from the image uploader.

### 2. src/data/contentDefaults.js — Update MENU_CATEGORIES_DEFAULTS

Add `featured: 'true'`, `highlight: 'Best Seller'`, and `badge` to at least one item (e.g. Cream Puffs) so the "Signature bakes" section has a visible item even before the user configures it.

### 3. src/pages/MenusPage.jsx — Preserve new fields in normalizeAdminData

In the `cat.items.map(...)` inside `normalizeAdminData`, add:
```js
highlight: item.highlight || '',
badge: item.badge || '',
featured: item.featured || '',
```

### 4. src/data/adminSectionMap.js — Mark `signature_items` as derived

Change `signature_items` section on the Home page from a CMS-editable entry to `hardcoded: true` with a note like `"(Derived from Menu Categories — edit items in the Menu tab)"`.

### 5. src/pages/HomePage.jsx — Derive signature items from menu_categories

Replace:
```jsx
const signatureItems = usePageSection('signature_items', DEFAULTS.SIGNATURE_ITEMS_DEFAULTS)
```

With:
```jsx
import { useMemo } from 'react'
const menuCategories = usePageSection('menu_categories', DEFAULTS.MENU_CATEGORIES_DEFAULTS)

const signatureItems = useMemo(() => {
  const cats = Array.isArray(menuCategories.data) ? menuCategories.data : []
  const allItems = cats.flatMap(cat => cat.items || [])
  return allItems.filter(item => item.featured === 'true')
    .map(item => ({
      name: item.name,
      desc: item.desc || '',
      highlight: item.highlight || '',
      price: item.price || '',
      image: item.image || '',
      badge: item.badge || 'bg-gray-100 text-gray-700',
    }))
}, [menuCategories.data])
```

Pass `{ data: signatureItems }` to `<SignatureItems>` instead of `signatureItems.data`.

### 6. src/components/SignatureItems.jsx — Ensure it handles empty items gracefully

The component already does `const items = propData || SIGNATURE_ITEMS_DEFAULTS`, so if signatureItems is empty, it will show defaults. But since we derive from `menu_categories` now, if there are ZERO featured items, it should show nothing:

```jsx
if (!items || items.length === 0) return null
```

---

## Not Changing (Out of Scope)

- **`product_carousel`** — This is a visual selection of featured product photos. It serves a different purpose (showing product variety, not detailed item data). Keep it as a separate curated section.
- **Menu breadcrumb** — Trivial, already de-prioritized.

---

## Migration

No new migration needed. We're only changing frontend code — the `menu_categories` row already exists in `page_sections`. The new fields (`highlight`, `badge`, `featured`) will simply be absent in existing data (defaulting to empty string), and the Home page will show nothing until the user marks items as featured.

No need to delete the `signature_items` row from the database — existing saved data there remains idle but harmless.

---

## Verification

1. Open admin → Content Manager → Menu tab → Edit a category → add `featured: "true"` and a highlight badge to an item → Save
2. Open the live site → Home page → "Signature bakes" section should show that item
3. Edit the item's price/name/image in Menu tab → Save → Home page should reflect the change
4. Set `featured` to anything other than `"true"` → item should disappear from Home page
