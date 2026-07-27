# Seed Product Grid Section Editor from Products Table

**Problem:** Admin → Sections → Cakes → "Cakes & Products" (and Cupcakes/Desserts equivalents) shows **"No items yet"** because the editor only reads `page_sections.data` (which is NULL for these sections), while products are stored in the separate `products` table.

**Root Cause:** The `products` table and `page_sections` table are disconnected in the admin. The `AdminContent.jsx` already loads products from the `products` table into a `products` state (filtered by `productCategory`), but the `SectionEditorModal` never receives them.

**Fix:** Two changes, additive-only:

---

### File 1: `src/pages/admin/AdminContent.jsx`

**Change (line 261):** Pass the already-loaded `products` array to `SectionEditorModal` as a new prop when the section type is `product_grid`.

```diff
       {editing && (
         <SectionEditorModal
           section={editing}
           currentData={previewData[editing.id] || {}}
           onSave={handleSave}
           onClose={() => setEditing(null)}
+          productGridItems={editing.section_type === 'product_grid' ? products : undefined}
         />
       )}
```

**Why:** `AdminContent.jsx` lines 133-143 already load `api.products.list()` filtered by `category_slug` whenever the admin switches to a category tab (cakes, cupcakes, desserts). The `products` state variable holds exactly the right items — just needs to be handed to the modal.

---

### File 2: `src/components/admin/SectionEditorModal.jsx`

**Change (line 596):** Accept the new `productGridItems` prop. In the `formData` initializer (line 597-606), when the section type is `product_grid` and `currentData` is empty and `productGridItems` is provided, transform and use them as the initial data.

```diff
-export default function SectionEditorModal({ section, currentData, onSave, onClose }) {
+export default function SectionEditorModal({ section, currentData, onSave, onClose, productGridItems }) {
```

Then update the `useState` initializer (lines 597-606):

```js
const [formData, setFormData] = useState(() => {
  const raw = currentData || {}
  const isEmpty = typeof raw === 'object' && !Array.isArray(raw) && Object.keys(raw).length === 0
  if (isEmpty) {
    // product_grid sections: pre-populate from products table data
    if (section?.section_type === 'product_grid' && Array.isArray(productGridItems) && productGridItems.length > 0) {
      return productGridItems.map((p) => ({
        name: p.name || '',
        price: p.price || '',
        image: p.image || '',
        desc: p.description || p.desc || '',
        badge: p.badge || '',
        variants: Array.isArray(p.variants) ? p.variants.join(', ') : (p.variants || ''),
      }))
    }
    const defaults = SECTION_KEY_TO_DEFAULTS[section?.section_key]
    if (defaults) return JSON.parse(JSON.stringify(defaults))
  }
  return JSON.parse(JSON.stringify(raw))
})
```

**Data format mapping:**

| `products` table field | Section editor field | Transformation |
|---|---|---|
| `name` | `name` | direct |
| `price` | `price` | direct |
| `image` | `image` | direct |
| `description` | `desc` | use `description` if available, fallback to `desc` |
| `badge` | `badge` | direct |
| `variants` (JSON array `[]`) | `variants` (string) | `p.variants.join(', ')` if array, else raw string |

---

### Build & Deploy

```bash
npm run build
npx supabase db push    # no new migration needed — pure frontend change
wrangler deploy
```

**No migration needed** — all changes are frontend-only. The `products` table was already seeded by migration `20260802000001_seed_products_table.sql`.

---

### Verification

1. Navigate to Admin → Sections → Cakes → "Cakes & Products" — should show all 12 seeded cake products
2. Edit/delete/reorder items and save — changes save to `page_sections.data`
3. Hard refresh and re-open — saved data persists
4. Live site at `/#/cakes` — should still show products (precedence: `products` table > `page_sections` > fallback)
5. Repeat for Cupcakes & Products (9 items) and Desserts & Products (0 items — will show empty since no desserts were seeded)
