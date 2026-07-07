# Cake Booking & Email Notification — Complete Integration Plan

> **For agentic workers:** Use subagent-driven-development or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the cake booking flow fully functional — customers can order a custom cake, receive email confirmation, and bakery owner gets notified, with secure admin management.

**Architecture:** Supabase stores orders/contact_messages → Database Webhooks trigger Edge Functions → Edge Functions send emails via Resend. Admin panel uses password-gated RPCs for all data access. Public site loads reviews from Supabase.

**Tech Stack:** React 19 + Vite 8, Supabase (Postgres + Edge Functions + Webhooks), Resend (email), GitHub Pages (hosting)

## Global Constraints

- All admin data access must use password-gated SECURITY DEFINER RPCs
- Edge Functions use Deno runtime with `npm:resend@4`
- Phone numbers require India-format validation
- Supabase anon key is public — never trust it for admin operations
- HashRouter with base `/crumbs-bakery-/`
- No hardcoded secrets — all via environment variables or Supabase secrets
- All changes must be build-verified: `npm run build` must pass

---

## File Structure

### Files to Create:
- `supabase/migrations/20260707000000_admin_reviews_rpc.sql` — Password-gated RPCs for reviews CRUD
- `supabase/migrations/20260707000001_admin_products_rpc.sql` — Password-gated RPCs for products CRUD
- `supabase/migrations/20260707000002_admin_categories_rpc.sql` — Password-gated RPCs for categories CRUD
- `src/hooks/useReviews.js` — Hook to fetch reviews from Supabase with fallback

### Files to Modify:
- `src/components/Reviews.jsx` — Switch from static data to Supabase-backed live data
- `src/pages/admin/AdminReviews.jsx` — Switch to password-gated RPCs
- `src/pages/admin/AdminProducts.jsx` — Switch to password-gated RPCs
- `src/pages/admin/AdminCategories.jsx` — Switch to password-gated RPCs
- `src/pages/admin/AdminDashboard.jsx` — Fix reviews count via RPC
- `src/components/admin/AdminLayout.jsx` — Fix "View Site" link
- `src/hooks/useAdminApi.js` — Add reviews, products, categories API methods
- `HANDOFF.md` — Update with session summary

### Files to Verify (no changes needed):
- `supabase/functions/order-notification/index.ts` — Already deployed, needs webhook
- `supabase/functions/contact-notification/index.ts` — Already deployed, needs webhook
- `src/components/OrderModal.jsx` — Already working
- `src/pages/ContactPage.jsx` — Already working

---

### Task 1: Create RPC Migration — Reviews Password-Gated CRUD

**Files:**
- Create: `supabase/migrations/20260707000000_admin_reviews_rpc.sql`
- Modify: `src/hooks/useAdminApi.js` (will add review methods in Task 5)

**Interfaces:**
- Produces: 5 new RPC functions consumed by AdminReviews and AdminDashboard
  - `admin_read_reviews(admin_token text)` → SETOF reviews
  - `admin_count_unapproved_reviews(admin_token text)` → integer
  - `admin_toggle_review_approval(admin_token text, review_id bigint)` → void
  - `admin_delete_review(admin_token text, review_id bigint)` → void

- [ ] **Step 1: Create the SQL migration file**

```sql
-- SECURITY DEFINER RPCs for reviews moderation
-- Run this in Supabase Dashboard → SQL Editor after all other migrations

-- RPC: list all reviews (including unapproved)
CREATE OR REPLACE FUNCTION admin_read_reviews(admin_token text)
RETURNS SETOF reviews
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN QUERY SELECT * FROM reviews ORDER BY created_at DESC;
  END IF;
END;
$$;

-- RPC: count unapproved reviews
CREATE OR REPLACE FUNCTION admin_count_unapproved_reviews(admin_token text)
RETURNS integer
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN (SELECT count(*) FROM reviews WHERE approved = false);
  END IF;
  RETURN 0;
END;
$$;

-- RPC: toggle review approval status
CREATE OR REPLACE FUNCTION admin_toggle_review_approval(admin_token text, review_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    UPDATE reviews SET approved = NOT approved WHERE id = review_id;
  END IF;
END;
$$;

-- RPC: delete review
CREATE OR REPLACE FUNCTION admin_delete_review(admin_token text, review_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    DELETE FROM reviews WHERE id = review_id;
  END IF;
END;
$$;
```

- [ ] **Step 2: Commit migration**

```bash
git add supabase/migrations/20260707000000_admin_reviews_rpc.sql
git commit -m "feat: add password-gated RPCs for reviews CRUD"
```

---

### Task 2: Create RPC Migration — Products & Categories Password-Gated CRUD

**Files:**
- Create: `supabase/migrations/20260707000001_admin_products_rpc.sql`
- Create: `supabase/migrations/20260707000002_admin_categories_rpc.sql`

**Interfaces:**
- Produces: 
  - `admin_read_products(admin_token text)` → SETOF products
  - `admin_create_product(admin_token text, product_data jsonb)` → void
  - `admin_update_product(admin_token text, product_id bigint, product_data jsonb)` → void
  - `admin_delete_product(admin_token text, product_id bigint)` → void
  - `admin_read_categories(admin_token text)` → SETOF categories
  - `admin_create_category(admin_token text, category_data jsonb)` → void
  - `admin_update_category(admin_token text, category_id bigint, category_data jsonb)` → void
  - `admin_delete_category(admin_token text, category_id bigint)` → void

- [ ] **Step 1: Create products RPC migration**

File: `supabase/migrations/20260707000001_admin_products_rpc.sql`

```sql
-- SECURITY DEFINER RPCs for products CRUD
-- Run this in Supabase Dashboard → SQL Editor

DROP POLICY IF EXISTS "Anyone can insert products" ON products;
DROP POLICY IF EXISTS "Anyone can update products" ON products;
DROP POLICY IF EXISTS "Anyone can delete products" ON products;

-- RPC: read all products (including inactive)
CREATE OR REPLACE FUNCTION admin_read_products(admin_token text)
RETURNS SETOF products
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN QUERY SELECT * FROM products ORDER BY sort_order;
  END IF;
END;
$$;

-- RPC: create product
CREATE OR REPLACE FUNCTION admin_create_product(admin_token text, product_data jsonb)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    INSERT INTO products (name, slug, price, image, description, variants, badge, category_slug, active, sort_order)
    SELECT name, slug, price, image, description, COALESCE(variants, '[]'::jsonb), badge, category_slug, COALESCE(active, true), COALESCE(sort_order, 0)
    FROM jsonb_to_record(product_data) AS x(
      name text, slug text, price text, image text, description text,
      variants jsonb, badge text, category_slug text, active boolean, sort_order integer
    );
  END IF;
END;
$$;

-- RPC: update product
CREATE OR REPLACE FUNCTION admin_update_product(admin_token text, product_id bigint, product_data jsonb)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    UPDATE products SET
      name = COALESCE((product_data->>'name')::text, name),
      slug = COALESCE((product_data->>'slug')::text, slug),
      price = COALESCE((product_data->>'price')::text, price),
      image = COALESCE((product_data->>'image')::text, image),
      description = COALESCE((product_data->>'description')::text, description),
      variants = COALESCE((product_data->>'variants')::jsonb, variants),
      badge = COALESCE((product_data->>'badge')::text, badge),
      category_slug = COALESCE((product_data->>'category_slug')::text, category_slug),
      active = COALESCE((product_data->>'active')::boolean, active),
      sort_order = COALESCE((product_data->>'sort_order')::integer, sort_order)
    WHERE id = product_id;
  END IF;
END;
$$;

-- RPC: delete product
CREATE OR REPLACE FUNCTION admin_delete_product(admin_token text, product_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    DELETE FROM products WHERE id = product_id;
  END IF;
END;
$$;
```

- [ ] **Step 2: Create categories RPC migration**

File: `supabase/migrations/20260707000002_admin_categories_rpc.sql`

```sql
-- SECURITY DEFINER RPCs for categories CRUD
-- Run this in Supabase Dashboard → SQL Editor

DROP POLICY IF EXISTS "Anyone can insert categories" ON categories;
DROP POLICY IF EXISTS "Anyone can update categories" ON categories;
DROP POLICY IF EXISTS "Anyone can delete categories" ON categories;

-- RPC: read all categories
CREATE OR REPLACE FUNCTION admin_read_categories(admin_token text)
RETURNS SETOF categories
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN QUERY SELECT * FROM categories ORDER BY id;
  END IF;
END;
$$;

-- RPC: create category
CREATE OR REPLACE FUNCTION admin_create_category(admin_token text, category_data jsonb)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    INSERT INTO categories (slug, name, description, hero_image)
    SELECT slug, name, description, hero_image
    FROM jsonb_to_record(category_data) AS x(slug text, name text, description text, hero_image text);
  END IF;
END;
$$;

-- RPC: update category
CREATE OR REPLACE FUNCTION admin_update_category(admin_token text, category_id bigint, category_data jsonb)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    UPDATE categories SET
      slug = COALESCE((category_data->>'slug')::text, slug),
      name = COALESCE((category_data->>'name')::text, name),
      description = COALESCE((category_data->>'description')::text, description),
      hero_image = COALESCE((category_data->>'hero_image')::text, hero_image)
    WHERE id = category_id;
  END IF;
END;
$$;

-- RPC: delete category
CREATE OR REPLACE FUNCTION admin_delete_category(admin_token text, category_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    DELETE FROM categories WHERE id = category_id;
  END IF;
END;
$$;
```

- [ ] **Step 3: Commit both migration files**

```bash
git add supabase/migrations/20260707000001_admin_products_rpc.sql supabase/migrations/20260707000002_admin_categories_rpc.sql
git commit -m "feat: add password-gated RPCs for products and categories CRUD"
```

---

### Task 3: Update useAdminApi Hook — Add Reviews, Products, Categories Methods

**Files:**
- Modify: `src/hooks/useAdminApi.js`

**Interfaces:**
- Consumes: All RPC functions from Tasks 1-2
- Produces: API methods consumed by AdminReviews, AdminProducts, AdminCategories, AdminDashboard

- [ ] **Step 1: Edit `src/hooks/useAdminApi.js` to add all CRUD methods**

Replace the entire file with:

```javascript
import { supabase } from '@/lib/supabase'
import { useAdminAuth } from '@/pages/admin/AdminLogin'

export function useAdminApi() {
  const { password } = useAdminAuth()

  function rpc(name, params = {}) {
    return supabase.rpc(name, { admin_token: password, ...params })
  }

  return {
    // Orders
    orders: {
      list: () => rpc('admin_read_orders'),
      count: () => rpc('admin_count_orders'),
      recent: (maxCount = 5) => rpc('admin_recent_orders', { max_count: maxCount }),
      updateStatus: (orderId, newStatus) =>
        rpc('admin_update_order_status', { order_id: orderId, new_status: newStatus }),
    },
    // Messages
    messages: {
      list: () => rpc('admin_read_messages'),
      unreadCount: () => rpc('admin_unread_message_count'),
      toggleRead: (msgId) => rpc('admin_toggle_message_read', { msg_id: msgId }),
      delete: (msgId) => rpc('admin_delete_message', { msg_id: msgId }),
    },
    // Reviews
    reviews: {
      list: () => rpc('admin_read_reviews'),
      unapprovedCount: () => rpc('admin_count_unapproved_reviews'),
      toggleApproval: (reviewId) => rpc('admin_toggle_review_approval', { review_id: reviewId }),
      delete: (reviewId) => rpc('admin_delete_review', { review_id: reviewId }),
    },
    // Products
    products: {
      list: () => rpc('admin_read_products'),
      create: (productData) => rpc('admin_create_product', { product_data: productData }),
      update: (productId, productData) =>
        rpc('admin_update_product', { product_id: productId, product_data: productData }),
      delete: (productId) => rpc('admin_delete_product', { product_id: productId }),
    },
    // Categories
    categories: {
      list: () => rpc('admin_read_categories'),
      create: (categoryData) => rpc('admin_create_category', { category_data: categoryData }),
      update: (categoryId, categoryData) =>
        rpc('admin_update_category', { category_id: categoryId, category_data: categoryData }),
      delete: (categoryId) => rpc('admin_delete_category', { category_id: categoryId }),
    },
    // Settings
    settings: {
      saveBatch: (updates) =>
        rpc('admin_save_settings', { setting_data: updates }),
    },
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useAdminApi.js
git commit -m "feat: add reviews, products, categories methods to useAdminApi hook"
```

---

### Task 4: Refactor AdminReviews — Use Password-Gated RPCs

**Files:**
- Modify: `src/pages/admin/AdminReviews.jsx`

**Interfaces:**
- Consumes: `api.reviews.list()`, `api.reviews.toggleApproval(id)`, `api.reviews.delete(id)` from useAdminApi

- [ ] **Step 1: Rewrite AdminReviews to use RPCs instead of direct Supabase calls**

Edit `src/pages/admin/AdminReviews.jsx`:
- Replace `import { supabase } from '@/lib/supabase'` with `import { useAdminApi } from '@/hooks/useAdminApi'`
- Replace all `supabase.from('reviews')` calls with `api.reviews.*()` methods
- Keep all UI the same — only change the data layer

```javascript
import { useState, useEffect } from 'react'
import { Check, X, Star, Trash2 } from 'lucide-react'
import { useAdminApi } from '@/hooks/useAdminApi'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const api = useAdminApi()

  useEffect(() => { loadReviews() }, [])

  async function loadReviews() {
    setLoading(true)
    try {
      const { data } = await api.reviews.list()
      setReviews(data ?? [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const toggleApproval = async (id) => {
    try {
      await api.reviews.toggleApproval(id)
      setReviews((prev) => prev.map((r) => r.id === id ? { ...r, approved: !r.approved } : r))
    } catch (err) { console.error(err) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return
    try {
      await api.reviews.delete(id)
      setReviews((prev) => prev.filter((r) => r.id !== id))
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">Moderate customer reviews</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Rating</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Review</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Source</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No reviews yet</td></tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className={`hover:bg-gray-50 transition-colors ${!review.approved ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">{review.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-gray-700 truncate">{review.text}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">{review.source || 'Google'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        review.approved ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {review.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleApproval(review.id)}
                          className={`p-1.5 rounded transition-colors ${
                            review.approved ? 'text-amber-500 hover:bg-amber-50' : 'text-green-500 hover:bg-green-50'
                          }`}>
                          {review.approved ? <X size={14} /> : <Check size={14} />}
                        </button>
                        <button onClick={() => handleDelete(review.id)}
                          className="p-1.5 hover:bg-red-50 rounded text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminReviews.jsx
git commit -m "refactor: AdminReviews uses password-gated RPCs instead of direct Supabase"
```

---

### Task 5: Refactor AdminProducts — Use Password-Gated RPCs

**Files:**
- Modify: `src/pages/admin/AdminProducts.jsx`

**Interfaces:**
- Consumes: `api.products.list()`, `api.products.create(data)`, `api.products.update(id, data)`, `api.products.delete(id)`, `api.categories.list()` from useAdminApi

- [ ] **Step 1: Rewrite AdminProducts to use RPCs**

Edit `src/pages/admin/AdminProducts.jsx`:
- Replace `import { supabase } from '@/lib/supabase'` with `import { useAdminApi } from '@/hooks/useAdminApi'`
- Replace all `supabase.from('products')` and `supabase.from('categories')` calls with `api.products.*()` and `api.categories.list()`
- Add `const api = useAdminApi()` after useState hooks
- In `loadData()`: use `api.products.list()` instead of `supabase.from('products').select('*')` and `api.categories.list()` instead of `supabase.from('categories').select('*')`
- In `handleSave()`: use `api.products.create(payload)` or `api.products.update(editing, payload)` 
- In `handleDelete()`: use `api.products.delete(id)`

Here are the precise edits:

**Replace the imports (line 1-5):**
```javascript
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Check, Image, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAdminApi } from '@/hooks/useAdminApi'
```

**Add `const api = useAdminApi()` after the useState hooks (after line 26):**
```javascript
  const [saving, setSaving] = useState(false)
  const api = useAdminApi()
```

**Replace `loadData` function to use RPCs (lines 32-46):**
```javascript
  async function loadData() {
    setLoading(true)
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.products.list(),
        api.categories.list(),
      ])
      setProducts(productsRes.data ?? [])
      setCategories(categoriesRes.data ?? [])
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }
```

**Replace `handleSave` insert/update (lines 87-113):**
```javascript
  const handleSave = async () => {
    if (!form.name || !form.price) {
      return
    }
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        price: form.price,
        image: form.image,
        description: form.description,
        variants: form.variants ? JSON.parse(form.variants) : [],
        badge: form.badge,
        category_slug: form.category_slug,
        active: form.active,
        sort_order: form.sort_order,
      }

      if (editing === 'new') {
        const { error } = await api.products.create(payload)
        if (error) throw error
      } else {
        const { error } = await api.products.update(editing, payload)
        if (error) throw error
      }
      closeEditor()
      await loadData()
    } catch (err) {
      console.error('Failed to save product:', err)
    } finally {
      setSaving(false)
    }
  }
```

**Replace `handleDelete` (lines 115-123):**
```javascript
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await api.products.delete(id)
      await loadData()
    } catch (err) {
      console.error('Failed to delete product:', err)
    }
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminProducts.jsx
git commit -m "refactor: AdminProducts uses password-gated RPCs instead of direct Supabase"
```

---

### Task 6: Refactor AdminCategories — Use Password-Gated RPCs

**Files:**
- Read: `src/pages/admin/AdminCategories.jsx`
- Modify: `src/pages/admin/AdminCategories.jsx`

- [ ] **Step 1: Read the current file**

```bash
cat src/pages/admin/AdminCategories.jsx
```

- [ ] **Step 2: Rewrite to use RPCs following the same pattern as AdminProducts**

Key changes:
- Replace `import { supabase } from '@/lib/supabase'` with `import { useAdminApi } from '@/hooks/useAdminApi'`
- Add `const api = useAdminApi()`
- Use `api.categories.list()` for loading
- Use `api.categories.create(data)` / `api.categories.update(id, data)` / `api.categories.delete(id)` for mutations

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/AdminCategories.jsx
git commit -m "refactor: AdminCategories uses password-gated RPCs instead of direct Supabase"
```

---

### Task 7: Fix AdminDashboard — Use RPC for Reviews Count

**Files:**
- Modify: `src/pages/admin/AdminDashboard.jsx`

**Interfaces:**
- Consumes: `api.reviews.unapprovedCount()` from useAdminApi

- [ ] **Step 1: Fix the dashboard to use RPC for reviews count**

In the `loadStats` function, replace the direct `supabase.from('reviews').select(...)` call with `api.reviews.unapprovedCount()`:

```javascript
const [
  { data: ordersCount },
  { data: messagesCount },
  { data: reviewsCount },
  { count: products },
  { data: ordersData },
] = await Promise.all([
  api.orders.count(),
  api.messages.unreadCount(),
  api.reviews.unapprovedCount(),
  supabase.from('products').select('*', { count: 'exact', head: true }),
  api.orders.recent(5),
])
setStats({
  orders: ordersCount ?? 0,
  messages: messagesCount ?? 0,
  reviews: reviewsCount ?? 0,
  products: products ?? 0,
})
```

Also, since we still need `supabase` for the products count, keep the import.

- [ ] **Step 2: Commit**

```bash
git add src/pages/admin/AdminDashboard.jsx
git commit -m "fix: AdminDashboard reviews count uses RPC instead of direct table access"
```

---

### Task 8: Create useReviews Hook — Supabase-Backed Reviews

**Files:**
- Create: `src/hooks/useReviews.js`

**Interfaces:**
- Produces: `useReviews()` hook returning `{ reviews, loading }`
  - Fetches approved reviews from Supabase
  - Falls back to static data if Supabase unavailable

- [ ] **Step 1: Create the useReviews hook**

Edit: Create `src/hooks/useReviews.js`:

```javascript
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Static fallback reviews matching the hardcoded data
const STATIC_REVIEWS = [
  {
    name: 'Merry',
    text: 'My favorites from this bakery is definitely the cream puffs and THE TIRAMISU! That tiramisu is proportionate for its price and the quality is on point.',
    rating: 5,
    source: 'Google',
    when: 'Nov 2025',
  },
  {
    name: 'Ebenezer Douglas',
    text: "Love that everything was served hot, especially the snacks. Great quality and service every time.",
    rating: 5,
    source: 'Google',
    when: 'Feb 2026',
  },
  {
    name: 'Audrey LZM',
    text: 'Loved the atmosphere and the cheesecake! They offer different flavours and the place has such a warm, welcoming vibe.',
    rating: 5,
    source: 'Google',
    when: '2026',
  },
  {
    name: 'Juri Galvan',
    text: 'They offer homemade bread. I had the carrot cake and absolutely delicious. Doesn\'t have too much sugar, just right. Also the cookies are amazing!',
    rating: 5,
    source: 'Google',
    when: '2026',
  },
  {
    name: 'A Happy Customer',
    text: "I'm delighted with the cake I ordered for my daughter's birthday! Every aspect, from the design to the taste, was amazing.",
    rating: 5,
    source: 'Google',
    when: '2024',
  },
  {
    name: 'Dhakshanamoorthy',
    text: 'Nice desserts. I like the quality and packaging. Nice staffs and ambience too. Highly recommend.',
    rating: 5,
    source: 'Zomato',
    when: '2017',
  },
]

export function useReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchReviews() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false })

        if (!cancelled) {
          if (!error && data && data.length > 0) {
            // Map DB fields to component props
            setReviews(data.map((r) => ({
              name: r.name,
              text: r.text,
              rating: r.rating,
              source: r.source || 'Google',
              when: r.created_at
                ? new Date(r.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                : 'Recently',
            })))
          } else {
            // Fallback to static data
            setReviews(STATIC_REVIEWS)
          }
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setReviews(STATIC_REVIEWS)
          setLoading(false)
        }
      }
    }

    fetchReviews()
    return () => { cancelled = true }
  }, [])

  return { reviews, loading }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useReviews.js
git commit -m "feat: add useReviews hook with Supabase fetch and static fallback"
```

---

### Task 9: Update Reviews Component — Use Supabase-Backed Hook

**Files:**
- Modify: `src/components/Reviews.jsx`

**Interfaces:**
- Consumes: `useReviews()` hook producing `{ reviews, loading }`

- [ ] **Step 1: Update Reviews.jsx to use the useReviews hook**

Edit `src/components/Reviews.jsx`:
- Add import: `import { useReviews } from '@/hooks/useReviews'`
- Replace the hardcoded `const reviews = [...]` with `const { reviews, loading } = useReviews()`
- Keep all the UI rendering exactly the same — the reviews array has the same shape (`name`, `text`, `rating`, `source`, `when`)

The diff:

```javascript
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { SectionEyebrow, CharReveal } from './RevealText'
import { useReviews } from '@/hooks/useReviews'

export default function Reviews() {
  const { reviews, loading } = useReviews()

  return (
    <section id="reviews" className="relative py-8 md:py-28 lg:py-36 px-4 md:px-6 scroll-mt-24">
      {/* ... everything stays the same, reviews is already used as `reviews.map(...)` ... */}
```

The rest of the JSX stays identical — remove the old `const reviews = [...]` block and the data now comes from the hook.

- [ ] **Step 2: Commit**

```bash
git add src/components/Reviews.jsx
git commit -m "feat: Reviews component now loads from Supabase via useReviews hook with static fallback"
```

---

### Task 10: Fix AdminLayout "View Site" Link

**Files:**
- Modify: `src/components/admin/AdminLayout.jsx`

**Interfaces:**
- The base path is `/crumbs-bakery-/`, so the correct "View Site" link is `/crumbs-bakery-/`

- [ ] **Step 1: Fix the "View Site" link URL**

In `src/components/admin/AdminLayout.jsx`, line 77:

Change:
```jsx
<a href="/#/"
```
To:
```jsx
<a href="/crumbs-bakery-/#/"
```

This ensures the hash router base path is included so the link works in production.

Alternatively, to make this dynamic and avoid hardcoding, use:
```jsx
<a href={`${import.meta.env.BASE_URL || '/'}`}
```

But since Vite's `base` is `/crumbs-bakery-/`, the simplest fix is:
```jsx
<a href="/crumbs-bakery-/"
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/AdminLayout.jsx
git commit -m "fix: View Site link now uses correct base path /crumbs-bakery-/"
```

---

### Task 11: Configure Supabase Secrets & Webhooks (Owner Action)

**Files:**
- Reference: `supabase/functions/order-notification/index.ts`
- Reference: `supabase/functions/contact-notification/index.ts`

**This task requires Supabase Dashboard access — the owner must execute these steps.**

- [ ] **Step 1: Set Supabase secrets for Edge Functions**

Run in terminal (requires Supabase CLI linked to project):
```bash
npx supabase secrets set RESEND_API_KEY=re_xxxxxxxxxx --project-ref vkicdybgaoofabgapmbw
npx supabase secrets set OWNER_EMAIL=hello@crumbs.in --project-ref vkicdybgaoofabgapmbw
npx supabase secrets set FROM_EMAIL=orders@crumbs.in --project-ref vkicdybgaoofabgapmbw
```

> **Note:** Replace `re_xxxxxxxxxx` with the actual Resend API key from https://resend.com

- [ ] **Step 2: Configure Database Webhooks in Supabase Dashboard**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/vkicdybgaoofabgapmbw)
2. Navigate to **Database → Webhooks**
3. Click **Create a webhook**

**Webhook 1 — order-notification:**
- Name: `order-notification`
- Table: `orders`
- Events: `INSERT` only
- Source type: `Supabase Edge Function`
- Edge Function: `order-notification`
- HTTP Method: `POST`
- Trigger on: `origin` (or `all` if prompted)

**Webhook 2 — contact-notification:**
- Name: `contact-notification`
- Table: `contact_messages`
- Events: `INSERT` only
- Source type: `Supabase Edge Function`
- Edge Function: `contact-notification`
- HTTP Method: `POST`
- Trigger on: `origin`

- [ ] **Step 3: Apply all SQL migrations in Supabase SQL Editor**

Run these in order:
1. `supabase/migrations/20260704072121_init.sql` — Base schema (if not already run)
2. `supabase/migrations/20260705000000_site_settings.sql` — Site settings table
3. `supabase/migrations/20260705000001_admin_rpc_security.sql` — Admin RPCs for orders/messages
4. `supabase/migrations/20260705000002_admin_site_settings_rpc.sql` — Settings RPC
5. `supabase/migrations/20260707000000_admin_reviews_rpc.sql` — Reviews RPC
6. `supabase/migrations/20260707000001_admin_products_rpc.sql` — Products RPC
7. `supabase/migrations/20260707000002_admin_categories_rpc.sql` — Categories RPC

Then seed the admin password hash:
```sql
INSERT INTO admin_config (key, value)
VALUES ('password_hash', extensions.crypt('admin123', extensions.gen_salt('bf')))
ON CONFLICT (key) DO UPDATE SET value = extensions.crypt('admin123', extensions.gen_salt('bf'));
```

> **IMPORTANT:** Change `admin123` to the actual admin password from `.env` `VITE_ADMIN_PASSWORD`

- [ ] **Step 4: Commit migration files**

```bash
git add supabase/migrations/20260707000000_admin_reviews_rpc.sql supabase/migrations/20260707000001_admin_products_rpc.sql supabase/migrations/20260707000002_admin_categories_rpc.sql
git commit -m "chore: add all admin RPC migration files for reviews, products, categories"
```

---

### Task 12: Build Verification

**Files:**
- Check: `npm run build` completes without errors

- [ ] **Step 1: Run the production build**

```bash
npm run build
```

Expected output: Build completes with no errors, outputs to `dist/` directory.

- [ ] **Step 2: Fix any build errors if they appear**

Common issues:
- Missing imports
- Incorrect API usage
- Unused variables

- [ ] **Step 3: Verify the dev server starts**

```bash
npm run dev
```

Navigate to `http://localhost:5173/crumbs-bakery-/` and verify:
1. Home page loads
2. OrderModal opens and works through steps
3. Contact form loads
4. Admin login works at `/#/admin/login`

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "chore: build verification passed"
```

---

### Task 13: Update HANDOFF.md

**Files:**
- Modify: `HANDOFF.md`

- [ ] **Step 1: Add session summary section**

Append to HANDOFF.md:

```markdown
## 18. SESSION SUMMARY (Jul 7, Session 7) — Full Integration, RPC Security, Email, Reviews Hook

### What Was Done

| # | Task | Status | Files |
|---|------|--------|-------|
| 1 | Created password-gated RPCs for reviews CRUD | ✅ | `supabase/migrations/20260707000000_admin_reviews_rpc.sql` |
| 2 | Created password-gated RPCs for products CRUD | ✅ | `supabase/migrations/20260707000001_admin_products_rpc.sql` |
| 3 | Created password-gated RPCs for categories CRUD | ✅ | `supabase/migrations/20260707000002_admin_categories_rpc.sql` |
| 4 | Updated useAdminApi hook with reviews, products, categories methods | ✅ | `src/hooks/useAdminApi.js` |
| 5 | Refactored AdminReviews to use RPCs | ✅ | `src/pages/admin/AdminReviews.jsx` |
| 6 | Refactored AdminProducts to use RPCs | ✅ | `src/pages/admin/AdminProducts.jsx` |
| 7 | Refactored AdminCategories to use RPCs | ✅ | `src/pages/admin/AdminCategories.jsx` |
| 8 | Fixed AdminDashboard reviews count via RPC | ✅ | `src/pages/admin/AdminDashboard.jsx` |
| 9 | Created useReviews hook (Supabase-first with static fallback) | ✅ | `src/hooks/useReviews.js` |
| 10 | Updated Reviews component to load from Supabase | ✅ | `src/components/Reviews.jsx` |
| 11 | Fixed "View Site" link in admin sidebar | ✅ | `src/components/admin/AdminLayout.jsx` |
| 12 | Build verified (npm run build passes) | ✅ | — |

### Remaining Owner Actions (Must Be Done for Emails to Work)

The following steps require Supabase Dashboard or Resend access:

1. **Set Supabase secrets:**
   ```bash
   npx supabase secrets set RESEND_API_KEY=re_xxxxxxxxxx --project-ref vkicdybgaoofabgapmbw
   npx supabase secrets set OWNER_EMAIL=hello@crumbs.in --project-ref vkicdybgaoofabgapmbw
   npx supabase secrets set FROM_EMAIL=orders@crumbs.in --project-ref vkicdybgaoofabgapmbw
   ```

2. **Configure DB Webhooks in Supabase Dashboard → Database → Webhooks:**
   - `order-notification`: table `orders`, event `INSERT`, function `order-notification`
   - `contact-notification`: table `contact_messages`, event `INSERT`, function `contact-notification`

3. **Run all SQL migrations** in Supabase SQL Editor (in order):
   - `20260704072121_init.sql` — Base schema
   - `20260705000000_site_settings.sql` — Site settings
   - `20260705000001_admin_rpc_security.sql` — Admin RPCs
   - `20260705000002_admin_site_settings_rpc.sql` — Settings RPC
   - `20260707000000_admin_reviews_rpc.sql` — Reviews RPC
   - `20260707000001_admin_products_rpc.sql` — Products RPC
   - `20260707000002_admin_categories_rpc.sql` — Categories RPC
   - Then seed: `INSERT INTO admin_config (key, value) VALUES ('password_hash', extensions.crypt('admin123', extensions.gen_salt('bf'))) ON CONFLICT (key) DO UPDATE SET value = extensions.crypt('admin123', extensions.gen_salt('bf'));`

### Known Issues Still Open

| # | Issue | Status |
|---|-------|--------|
| 1 | Replace simple password auth with Supabase Auth for production | 🔴 Not started |
| 2 | Add image upload to Supabase Storage (for product images) | 🔴 Not started |
| 3 | Add order confirmation page/customer portal | 🔴 Not started |
| 4 | Add delivery tracking | 🔴 Not started |
| 5 | Add SEO meta tags editable from admin settings | 🔴 Not started |
| 6 | Reviews — hardcoded data used as fallback when Supabase unavailable | ✅ Fixed (useReviews hook) |
| 7 | Admin Products/Categories/Reviews — direct Supabase CRUD (no auth) | ✅ Fixed (all RPC-gated) |
| 8 | AdminDashboard reviews count — direct table access | ✅ Fixed (RPC-gated) |
| 9 | "View Site" link broken in admin sidebar | ✅ Fixed |

### Deployed Edge Functions

| Function | URL | Status |
|----------|-----|--------|
| order-notification | `https://vkicdybgaoofabgapmbw.functions.supabase.co/order-notification` | ✅ Deployed, needs webhook |
| contact-notification | `https://vkicdybgaoofabgapmbw.functions.supabase.co/contact-notification` | ✅ Deployed, needs webhook |

> **⚠️ REMINDER:** This file is in `.gitignore` and will NOT be committed. Keep all secrets here locally.
> Updated: July 7, 2026 (Session 7)
```

- [ ] **Step 2: Verify the file is still in .gitignore**

```bash
grep -n "HANDOFF.md" .gitignore
```

Expected: `HANDOFF.md` is listed in `.gitignore`

- [ ] **Step 3: Don't commit HANDOFF.md** (it's in .gitignore)

---

## End-to-End Verification Checklist

After implementing all tasks, verify the full flow:

### Public Site
- [ ] Customer visits `https://jeremygideonbareh.github.io/crumbs-bakery-/`
- [ ] Home page loads with products from Supabase (or static fallback)
- [ ] Reviews section shows live data from Supabase `reviews` table (approved only)
- [ ] OrderModal opens, all 5 steps work, validation passes
- [ ] Order submits to Supabase `orders` table
- [ ] Contact form submits to Supabase `contact_messages` table

### Email Notifications (requires owner action)
- [ ] Webhook triggers on `orders` INSERT
- [ ] `order-notification` Edge Function fires
- [ ] Owner receives email at `hello@crumbs.in`
- [ ] Customer receives confirmation email
- [ ] Webhook triggers on `contact_messages` INSERT
- [ ] `contact-notification` Edge Function fires
- [ ] Owner receives contact notification email

### Admin Panel
- [ ] Login at `/#/admin/login` with password `admin123`
- [ ] Dashboard shows correct stats (orders count, unread messages, pending reviews, products)
- [ ] Products page — create, edit, delete products (all RPC-gated)
- [ ] Categories page — create, edit, delete categories (all RPC-gated)
- [ ] Orders page — view orders, update status (RPC-gated)
- [ ] Messages page — view, read/unread, delete (RPC-gated)
- [ ] Reviews page — approve/reject, delete (RPC-gated)
- [ ] Settings page — edit site text and images (RPC-gated writes)
- [ ] "View Site" link navigates to correct URL

### Security
- [ ] Direct `supabase.from('orders').select('*')` returns empty/null (RPC only)
- [ ] Direct `supabase.from('contact_messages').select('*')` returns empty/null (RPC only)
- [ ] Direct `supabase.from('reviews').update()` blocked (RPC only for admin)
- [ ] Direct `supabase.from('products').insert()` blocked (RPC only for admin)
- [ ] Direct `supabase.from('categories').delete()` blocked (RPC only for admin)
