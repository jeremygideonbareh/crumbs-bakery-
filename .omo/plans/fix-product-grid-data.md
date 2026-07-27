# Fix: Connect Products Admin → Category Pages

> **For agentic workers:** Modify 3 frontend files + add 1 migration, then rebuild + redeploy. No destructive operations.

**Goal:** Make Cakes, Cupcakes, and Desserts pages show products from the `products` table (managed via Admin → Products) instead of relying solely on hardcoded fallback data from `src/data/products.js`.

**Problem:** Currently the `products` table is completely disconnected from the public-facing category pages. Products added via Admin → Products save to the `products` table, but:
- `CakesPage.jsx` reads from `page_sections` table → falls back to hardcoded `products.js`
- `CupcakesPage.jsx` same pattern
- `DessertsPage.jsx` same pattern

**Data safety guarantee:** This change is **additive only**. No existing data is deleted or overwritten.
- The `products` table is untouched (new migration only inserts DEFAULT data if table is empty)
- All existing `page_sections` data preserved (used as second fallback)
- The `product_grid` section in admin Content Manager will still show "Using defaults" — that's fine, products should be managed via Admin → Products from now on
- Any products user already entered via Admin → Products will show up immediately

---

### Task 1: Seed `products` table with default products (if empty)

**File:** `supabase/migrations/20260802000001_seed_products_table.sql`

Create a migration that inserts the hardcoded products from `products.js` into the `products` table.
Uses `ON CONFLICT DO NOTHING` so it only inserts if the table is empty.

```sql
-- Seed the products table with defaults from products.js.
-- Only inserts if the table is empty (respects existing admin data).
BEGIN;

DO $$
BEGIN
  IF (SELECT count(*) FROM products) = 0 THEN
    INSERT INTO products (name, slug, price, image, description, variants, badge, category_slug, active, sort_order) VALUES
      -- Cakes
      ('Japanese cheesecake', 'japanese-cheesecake', '₹1,100', '/images/japanese-cheesecake.jpeg', 'The classic jiggly Japanese cheesecake, soft and airy', '[]'::jsonb, '', 'cakes', true, 1),
      ('BESPOKE CAKE', 'bespoke-cake', '₹2,500', '/images/bespoke-cake.jpeg', 'Design your own — choose flavours, fillings, and decorations', '[]'::jsonb, '', 'cakes', true, 2),
      ('VINTAGE CAKE — SINGLE COLOUR', 'vintage-cake-single-colour', '₹1,500', '/images/vintage-custom.jpeg', 'Classic vintage style in your choice of colour', '["Ivory","Blue","Peach","Lilac","Green","Pink","Yellow"]'::jsonb, '', 'cakes', true, 3),
      ('EDIBLE IMAGE PHOTO CAKE', 'edible-image-photo-cake', '₹1,800', '/images/edible-photo-cake.jpeg', 'Personalised edible photo printed on your cake', '["Pink","Ivory","Yellow","Blue","Green","Peach","Lilac"]'::jsonb, '', 'cakes', true, 4),
      ('CLASSIC CHOCOLATE CAKE', 'classic-chocolate-cake', '₹1,000', '/images/chocolate-cake.jpeg', 'Four rich layers with smooth chocolate buttercream', '[]'::jsonb, '', 'cakes', true, 5),
      ('FUNFETTI SPRINKLE SHEET CAKE', 'funfetti-sprinkle-sheet-cake', '₹1,400', '/images/funfetti-sheet.jpeg', 'White frosting with colourful sprinkles — perfect for parties', '[]'::jsonb, '', 'cakes', true, 6),
      ('RASPBERRY RIPPLE CAKE', 'raspberry-ripple-cake', '₹1,600', '/images/raspberry-ripple.jpeg', 'Vanilla sponge swirled with raspberry and creamy frosting', '[]'::jsonb, '', 'cakes', true, 7),
      ('BIRTHDAY CAKE', 'birthday-cake', '₹1,200', '/images/cakes-menu.jpeg', 'Classic birthday cake with confetti sponge and buttercream', '["Pink Skirt","Turquoise Skirt","Yellow Skirt"]'::jsonb, '', 'cakes', true, 8),
      ('CHOCOLATE BIRTHDAY CAKE', 'chocolate-birthday-cake', '₹1,300', '/images/funfetti-sheet.jpeg', 'Chocolate drip cake with piped icing and sprinkles', '[]'::jsonb, '', 'cakes', true, 9),
      ('CLASSIC LEMON DRIZZLE CAKE', 'classic-lemon-drizzle-cake', '₹1,100', '/images/lemon-drizzle.jpeg', 'Four layers with lemon meringue buttercream', '[]'::jsonb, '', 'cakes', true, 10),
      ('CLASSIC RED VELVET CAKE', 'classic-red-velvet-cake', '₹1,200', '/images/red-velvet-cake.jpeg', 'Smooth cream cheese frosting on moist red velvet layers', '[]'::jsonb, '', 'cakes', true, 11),
      ('CLASSIC CARROT CAKE', 'classic-carrot-cake', '₹1,100', '/images/carrot-cake.jpeg', 'Moist carrot cake with cream cheese icing and walnuts', '[]'::jsonb, '', 'cakes', true, 12),
      -- Cupcakes
      ('VANILLA CUPCAKES (DOZEN)', 'vanilla-cupcakes-dozen', '₹600', '/images/vanilla-cupcake.jpeg', 'Classic vanilla sponge with silky vanilla buttercream', '[]'::jsonb, '', 'cupcakes', true, 1),
      ('CHOCOLATE CUPCAKES (DOZEN)', 'chocolate-cupcakes-dozen', '₹650', '/images/chocolate-cupcake.jpeg', 'Rich chocolate sponge with chocolate ganache frosting', '[]'::jsonb, '', 'cupcakes', true, 2),
      ('RED VELVET CUPCAKE', 'red-velvet-cupcake', '₹50', '/images/red-velvet-cupcake.jpeg', 'Red velvet with cream cheese frosting — per piece', '[]'::jsonb, '', 'cupcakes', true, 3),
      ('CORPORATE LOGO CUPCAKES (DOZEN)', 'corporate-logo-cupcakes-dozen', '₹900', '/images/edible-photo-cupcake.jpeg', 'Edible logo printed on each cupcake — perfect for events', '[]'::jsonb, 'Corporate', 'cupcakes', true, 4),
      ('EDIBLE PHOTO CUPCAKES (DOZEN)', 'edible-photo-cupcakes-dozen', '₹800', '/images/edible-photo-cupcake.jpeg', 'Personalised edible photo toppers on vanilla cupcakes', '[]'::jsonb, '', 'cupcakes', true, 5),
      ('PRIDE CUPCAKES (DOZEN)', 'pride-cupcakes-dozen', '₹750', 'https://images.pexels.com/photos/7358362/pexels-photo-7358362.jpeg', 'Rainbow-frosted cupcakes celebrating Pride', '[]'::jsonb, '', 'cupcakes', true, 6),
      ('GLUTEN FREE VANILLA CUPCAKES', 'gluten-free-vanilla-cupcakes', '₹850', '/images/vanilla-cupcake-800.jpeg', 'Gluten-free vanilla sponge with buttercream', '[]'::jsonb, 'GF', 'cupcakes', true, 7),
      ('CUSTOM DESIGN CUPCAKES', 'custom-design-cupcakes', '₹950', '/images/red-velvet-cupcake.jpeg', 'Fully custom design — send us your theme!', '[]'::jsonb, '', 'cupcakes', true, 8),
      ('LEMON CURD CUPCAKE', 'lemon-curd-cupcake', '₹50', '/images/lemon-curd-cupcake.jpeg', 'Tangy lemon curd topped cupcake — per piece', '[]'::jsonb, '', 'cupcakes', true, 9);
  END IF;
END;
$$;

COMMIT;
```

---

### Task 2: Update CakesPage.jsx — fetch from `products` table

**File:** `src/pages/CakesPage.jsx`

**Changes:**
- Add `useEffect` + `useState` to fetch products from the `products` table filtered by `category_slug = 'cakes'`
- Keep `products.js` as final fallback if both DB and `page_sections` return nothing
- Normalizer maps `description` (DB column) → `desc` (component prop)

```jsx
import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import CategoryHero from '@/components/CategoryHero'
import ProductGrid from '@/components/ProductGrid'
import usePageSection from '@/hooks/usePageSection'
import { supabase } from '@/lib/supabase'
import { cakes as fallbackProducts } from '@/data/products'

// ... (normalizeProducts stays the same)
// ... (rest of imports/constants)

export default function CakesPage() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [dbProducts, setDbProducts] = useState(null)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('category_slug', 'cakes')
      .eq('active', true)
      .order('sort_order', { ascending: true, nullsFirst: false })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setDbProducts(data)
        }
      })
      .catch(() => {/* use fallback */})
  }, [])

  const products = useMemo(() => {
    const source = dbProducts || fallbackProducts
    return normalizeProducts(source, fallbackProducts)
  }, [dbProducts])

  const { data: heroData } = usePageSection('cakes_hero', { ... })
  const { data: deliveryData } = usePageSection('cakes_delivery', { ... })
  // ... rest stays the same
}
```

**Normalizer update** — map `description` (DB column) to `desc`:
```js
function normalizeProducts(productsData, fallback) {
  if (!Array.isArray(productsData) || productsData.length === 0) return fallback
  return productsData.map((p, i) => ({
    id: p.id || `p-${i}`,
    name: p.name || '',
    price: p.price || '',
    image: p.image || '',
    desc: p.desc || p.description || '',      // ← handles both field names
    badge: p.badge || '',
    variants: typeof p.variants === 'string'
      ? p.variants.split(',').map(v => v.trim()).filter(Boolean)
      : (Array.isArray(p.variants) ? p.variants : []),
  }))
}
```

---

### Task 3: Update CupcakesPage.jsx — same pattern

**File:** `src/pages/CupcakesPage.jsx`

Same as Task 2 but:
- `fallbackProducts` from `import { cupcakes as fallbackProducts } from '@/data/products'`
- Filter: `.eq('category_slug', 'cupcakes')`

---

### Task 4: Update DessertsPage.jsx — same pattern

**File:** `src/pages/DessertsPage.jsx`

Same as Task 2 but:
- `fallbackProducts` from `import { desserts as fallbackProducts } from '@/data/products'`
- Filter: `.eq('category_slug', 'desserts')`

---

### Task 5: Build + Push Migrations + Deploy

- [ ] `npm run build` — verify 0 errors
- [ ] `npx supabase db push` — apply seed migration (no-op if products already exist)
- [ ] `$env:CLOUDFLARE_API_TOKEN="cfut_...token..."; wrangler deploy`

---

## What gets preserved

| Data | Preserved? | How |
|------|-----------|-----|
| Products entered via Admin → Products | ✅ Already in `products` table — migration does `IF count=0` |
| `page_sections` data (hero, delivery, etc.) | ✅ Unchanged — only frontend code changes |
| `cakes_product_grid` section data (if any was saved) | ✅ Unchanged — code checks `products` table first, but old data still in DB |
| Hardcoded `products.js` data | ✅ Used as final fallback |
| Admin → Settings, orders, messages, reviews | ✅ No touch |

## Data flow (after fix)

```
User visits /cakes
  │
  ├─▶ Try `products` table WHERE category_slug='cakes'
  │     └─▶ Products found? → Display them ✅
  │
  └─▶ Fallback to `products.js` hardcoded data
        └─▶ Display fallback (always works)
```

## Verification

1. Visit `/cakes` → should show all 12 cakes from seeded data
2. Admin → Products → add/edit/delete a cake → visit `/cakes` → reflects changes
3. Visit `/cupcakes` → 9 cupcakes
4. Visit `/desserts` → all desserts
