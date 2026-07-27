# Phase 2 — 🟡 Warning-Level Fixes

**Builds on Phase 1.** Each item independently deployable but planned in optimal order to minimize conflicts.

---

### 2.1 Consolidate `useAdminApi` and `useContentApi` into single hook

**Trigger:** `useAdminApi.js` and `useContentApi.js` share identical `rpc()` wrapper. `useContentApi.sections.update` duplicates `useAdminApi.sections.update`.

**Current state:**
- `useAdminApi.js` — exposes `orders.*`, `messages.*`, `reviews.*`, `products.*`, `categories.*`, `settings.*`, `sections.*`, generic `rpc()`
- `useContentApi.js` — exposes `sections.*` only. Used by `SectionEditorModal.jsx` and `usePageSection.js`
- Both import `useAdminAuth` and create an identical `rpc()` wrapper passing `{ admin_token: password, ...params }`

**Fix:**
1. `src/hooks/useContentApi.js` — replace entire file to re-export from `useAdminApi`:
   ```js
   import { useAdminApi } from './useAdminApi'
   export function useContentApi() {
     return useAdminApi()
   }
   export async function fetchPageSection(sectionKey) {
     // keep this standalone function as-is
     ...
   }
   ```
2. Update all imports that call `useContentApi().sections.*` — they now call `useAdminApi().sections.*` which is identical
3. Remove `sections.*` duplication (already identical, just drop one export path)

**Break-risk analysis:**
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| `useContentApi` used in a way that relies on it being a different object than `useAdminApi` | Very low — grep shows both just destructure `.sections.list/get/update` | Low — RPC names and signatures are identical | Verify both hooks return same shape before/after |
| `fetchPageSection` is a named export not from the hook — might confuse bundler | Low — standalone function stays unchanged | None | Keep `fetchPageSection` as separate export |

**Files affected:** `src/hooks/useContentApi.js` (rewrite)
**Files NOT affected (verified):** No imports of `useContentApi` need changes — the hook interface is identical.

**QA:**
1. Admin Content page loads → sections display correctly
2. Edit and save a section → works
3. Public page renders section data → works

---

### 2.2 Create `ConfirmDialog` modal, replace all `window.confirm()`

**Trigger:** 5 admin pages use `window.confirm()` — blocking, unstyled, inconsistent with framer-motion UI.

**Current `window.confirm()` locations:**

| File | Line | Text |
|------|------|------|
| `AdminCategories.jsx` | 48 | `'Delete this category?'` |
| `AdminProducts.jsx` | 128 | `'Delete this product?'` |
| `AdminImages.jsx` | 60 | `` `Delete "${name}"?` `` |
| `AdminMessages.jsx` | 31 | `'Delete this message?'` |
| `AdminReviews.jsx` | 30 | `'Delete this review?'` |

**Fix:**
1. Create `src/components/admin/ConfirmDialog.jsx`:
```jsx
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title || 'Confirm'}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="neutral" onClick={onCancel} size="sm">Cancel</Button>
          <Button onClick={onConfirm} size="sm" className="gap-1 bg-red-600 hover:bg-red-700">{confirmLabel}</Button>
        </div>
      </motion.div>
    </div>
  )
}
```

2. In each of the 5 admin pages:
   - Add `import ConfirmDialog from '@/components/admin/ConfirmDialog'`
   - Add state: `const [confirmDelete, setConfirmDelete] = useState(null)`
   - Change handler: `if (!window.confirm(...)) return` → `setConfirmDelete(itemId)`
   - Add `<ConfirmDialog open={confirmDelete !== null} ... />` at bottom of JSX

**Break-risk analysis:**
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| User accidentally confirms by pressing Enter | Same as `window.confirm()` | Low | Modal requires explicit click; Enter doesn't confirm |
| Modal doesn't render properly on mobile | Low — uses same pattern as existing modals | Medium | Test on mobile viewport |
| Forgot to add state import in one file | Medium — manual steps | Low | Build catches undefined variable |

**QA after each file:**
1. Click delete → modal appears with Cancel and Delete buttons
2. Press Cancel → nothing deleted, modal closes
3. Press Delete → item deleted + toast
4. `npm run build` passes

---

### 2.3 Fix silent error swallowing in AdminContent

**Trigger:** `.catch(() => {})` in `AdminContent.jsx` lines 136-138, 152-154 — errors completely swallowed.

**Current code:**
```js
// Line 136-138
api.products.list().then(({ data }) => {
  setProducts(data?.filter((p) => p.category_slug === page.productCategory) ?? [])
}).catch(() => {})

// Line 152-154
Promise.all([
  api.reviews.list(),
  api.reviews.unapprovedCount(),
]).then(([listRes, countRes]) => {
  setReviewsData({ list: listRes.data ?? [], unapprovedCount: countRes.data ?? 0 })
}).catch(() => {})
```

**Fix:** Replace `.catch(() => {})` with proper error handling:
```js
.catch((err) => {
  console.error('Failed to load products for tab:', err)
  toast.error('Failed to load products')
})
```
Similarly for the reviews catch block.

**Break-risk analysis:** None — only adds error visibility.

---

### 2.4 Add `saving` state to AdminCategories

**Trigger:** AdminCategories has no `saving` state — double-clicking save fires duplicate RPC calls. AdminProducts handles this correctly.

**Current AdminCategories save:**
```js
const handleSave = async () => {
  if (!form.name || !form.slug) return
  try {
    // ... save
  } catch (err) { ... }
}
```

**Fix:** Follow same pattern as AdminProducts:
```js
const [saving, setSaving] = useState(false)

const handleSave = async () => {
  if (!form.name || !form.slug || saving) return
  setSaving(true)
  try {
    // ... save
    close(); await loadCategories()
  } catch (err) { ... }
  finally { setSaving(false) }
}
```
And disable button: `<Button disabled={saving || !form.name || !form.slug} ...>`

**Break-risk analysis:**
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| `saving` not reset in catch block → button stuck disabled | Medium if `finally` not used | Low | Use `try/catch/finally` pattern (exactly as in AdminProducts) |

---

### 2.5 Fix "View Site" link in AdminLayout

**Trigger:** `<a href="/crumbs-bakery-/">` — old GitHub Pages path. Site is at `/` on Cloudflare.

**Fix:** Change to `<a href="/">`.

**Break-risk analysis:** None — navigation link only. Clicking it now goes to correct homepage instead of 404.

---

### 2.6 Add missing database indexes

**Trigger:** Only one custom index exists (`idx_refs_section_key`). Common query columns are unindexed.

**Fix — New file `supabase/migrations/20260801000004_add_performance_indexes.sql`:**
```sql
BEGIN;

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages (read);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews (approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_slug ON products (category_slug);
CREATE INDEX IF NOT EXISTS idx_products_active_sort ON products (active, sort_order);

COMMIT;
```

`categories(slug)` already has a UNIQUE index — no need for additional.

**Break-risk analysis:**
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| `CREATE INDEX CONCURRENTLY` needed for zero-downtime | Low — bakery site, low traffic | Low | Tables are small (<1000 rows), index creation takes milliseconds |
| Duplicate index error | Very low — using `IF NOT EXISTS` | None | All indexes use `IF NOT EXISTS` |

---

### 2.7 Add error handling to notification triggers

**Trigger:** Notification triggers `notify_order_insert` and `notify_contact_insert` have no error handling — if `pg_net` queue is full or edge function is down, the exception kills the INSERT transaction.

**Fix — New file `supabase/migrations/20260801000005_fix_notification_triggers.sql`:**
Wrap each `PERFORM extensions.net.http_post(...)` in a `BEGIN EXCEPTION END` block:

```sql
BEGIN;

CREATE OR REPLACE FUNCTION notify_order_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  function_url text;
BEGIN
  SELECT url INTO function_url FROM edge_function_config WHERE key = 'order_notification_url';
  IF function_url IS NOT NULL THEN
    BEGIN
      PERFORM extensions.net.http_post(
        url := function_url,
        headers := jsonb_build_object('Content-Type', 'application/json'),
        body := jsonb_build_object('type', 'INSERT', 'table', 'orders', 'record', row_to_json(NEW)::jsonb)
      );
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Order notification failed: %', SQLERRM;
    END;
  END IF;
  RETURN NEW;
END;
$$;

-- Repeat for notify_contact_insert...
COMMIT;
```

**Break-risk analysis:**
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Exception handler catches too broadly | Low — only wraps the `net.http_post` call | Low | Wrapping `BEGIN/EXCEPTION` only around the single `PERFORM` statement |
| Notifications stop working silently | Low — warning is still logged | Low | The old behavior was "kill entire INSERT on failure" — new behavior is "log warning, INSERT succeeds" which is strictly better |

---

### 2.8 Drop `admin_clear_all_section_data` RPC

**Trigger:** Dangerous RPC that can wipe all CMS content with no audit trail. Migration comment says "After seeding, drop this RPC" but never does.

**Fix — New file `supabase/migrations/20260801000006_drop_clear_section_data.sql`:**
```sql
BEGIN;
DROP FUNCTION IF EXISTS admin_clear_all_section_data(TEXT);
COMMIT;
```

**Break-risk analysis:** None — RPC is a utility, not called by any frontend code.

---

### 2.9 Add type validation to `admin_save_settings`

**Trigger:** `admin_save_settings` bypasses the `site_settings.type` column — any text value can be stored for any key regardless of declared type.

**Current code:**
```sql
INSERT INTO site_settings (key, value)
SELECT key, value FROM jsonb_to_recordset(setting_data) AS x(key text, value text)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
```

**Fix — New file `supabase/migrations/20260801000007_validate_settings_type.sql`:**
Replace `admin_save_settings` with a validated version:
```sql
BEGIN;

CREATE OR REPLACE FUNCTION admin_save_settings(admin_token TEXT, setting_data JSONB)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash TEXT;
  rec RECORD;
  expected_type TEXT;
BEGIN
  -- Auth check (correct pattern)
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  -- Validate each setting against its declared type
  FOR rec IN SELECT key, value FROM jsonb_to_recordset(setting_data) AS x(key text, value text)
  LOOP
    SELECT s.type INTO expected_type FROM site_settings s WHERE s.key = rec.key;
    
    IF expected_type = 'boolean' AND rec.value NOT IN ('true', 'false') THEN
      RAISE EXCEPTION 'Setting "%" requires a boolean value (true/false), got: %', rec.key, rec.value;
    END IF;
    IF expected_type = 'color' AND rec.value !~ '^#[0-9a-fA-F]{3,6}$' THEN
      RAISE EXCEPTION 'Setting "%" requires a valid hex color (e.g. #fff), got: %', rec.key, rec.value;
    END IF;
    IF expected_type = 'number' AND rec.value !~ '^-?\d+(\.\d+)?$' THEN
      RAISE EXCEPTION 'Setting "%" requires a numeric value, got: %', rec.key, rec.value;
    END IF;

    INSERT INTO site_settings (key, value)
    VALUES (rec.key, rec.value)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
  END LOOP;
END;
$$;

COMMIT;
```

**Break-risk analysis:**
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Existing settings that violate type constraints can't be saved | Medium — if admin has `#fff` in a `color` field — that's actually valid | Low | Validation uses regex that allows 3 and 6 digit hex. Check existing data before deploying. |
| New key with no type entry (`expected_type` is NULL) fails | Medium — first save of a new key bypasses check | Low | `IF expected_type IS NULL THEN -- skip validation` — add this guard |
| Current auth pattern (`IF EXISTS crypt()`) is broken — RPC never works | Same as pre-fix — RPC silently does nothing | Medium | This fix ALSO corrects the auth pattern (uses `DECLARE stored_hash` pattern) |

**Key guard:** Add `IF expected_type IS NULL THEN CONTINUE; END IF;` to skip validation for new keys not yet in the type table.

---

### 2.10 Fix broken auth pattern in orders and messages RPCs

**Trigger:** `admin_read_orders`, `admin_read_messages`, `admin_count_orders`, `admin_recent_orders`, `admin_update_order_status`, `admin_unread_message_count`, `admin_toggle_message_read`, `admin_delete_message` — all use broken `IF EXISTS ... crypt()` pattern. They silently return empty results instead of raising exceptions.

**The broken pattern (in 20260705000001_admin_rpc_security.sql):**
```sql
IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
  RETURN QUERY SELECT * FROM orders ORDER BY created_at DESC;
END IF;
-- No RETURN/RETURN QUERY after END IF for SETOF functions!
-- Function falls through, returns empty set silently
```

**Fix — New file `supabase/migrations/20260801000008_fix_orders_messages_rpc_auth.sql`:**
Replace all 8 RPCs with the correct `DECLARE stored_hash` pattern that raises unauthorized on failure.

For SETOF functions (admin_read_orders, admin_read_messages, admin_recent_orders):
```sql
CREATE OR REPLACE FUNCTION admin_read_orders(admin_token TEXT)
RETURNS SETOF orders
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  RETURN QUERY SELECT * FROM orders ORDER BY created_at DESC;
END;
$$;
```

For scalar-returning functions (admin_count_orders, admin_unread_message_count):
```sql
CREATE OR REPLACE FUNCTION admin_count_orders(admin_token TEXT)
RETURNS INTEGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  RETURN (SELECT count(*) FROM orders);
END;
$$;
```

For void functions (admin_update_order_status, admin_toggle_message_read, admin_delete_message):
```sql
CREATE OR REPLACE FUNCTION admin_update_order_status(admin_token TEXT, order_id BIGINT, new_status TEXT)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  SELECT value INTO stored_hash FROM admin_config WHERE key = 'password_hash';
  IF stored_hash IS NULL OR extensions.crypt(admin_token, stored_hash) <> stored_hash THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  UPDATE orders SET status = new_status WHERE id = order_id;
END;
$$;
```

Also: `admin_recent_orders(admin_token, max_count)` (extra parameter)
And: `admin_toggle_message_read(admin_token, msg_id)`
And: `admin_delete_message(admin_token, msg_id)`

**Break-risk analysis:**
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| These RPCs silently returned empty before — now they raise exceptions on auth failure | 100% — behavior changes | **HIGH if someone relies on silent empty** | **But:** they never worked correctly. `extensions.crypt(admin_token, value)` can never match because `value` is already the bcrypt hash, not the plaintext. The `IF EXISTS` condition was ALWAYS false, so these functions always returned empty sets / 0 / did nothing. The fix makes them WORK. |
| Frontend `.catch()` handlers may not expect `RAISE EXCEPTION` | Low — they use `.catch(err => { toast.error(...) })` which works with RPC exceptions | Low | Test each admin page after migration |
| RPC name or parameter order mismatch | Very low — exact same signatures | None | Parameter names/order unchanged |

**This is a net improvement:** RPCs go from "broken (silent empty)" to "working (raise on auth fail, return real data on success)".

---

## Phase 2 Migration Order

```
20260801000004_add_performance_indexes.sql          (2.6)
20260801000005_fix_notification_triggers.sql         (2.7)
20260801000006_drop_clear_section_data.sql           (2.8)
20260801000007_validate_settings_type.sql            (2.9)
20260801000008_fix_orders_messages_rpc_auth.sql      (2.10)
```

## Phase 2 Dependency Matrix

```
2.1 consolidate hooks    → nothing
2.2 ConfirmDialog        → nothing
2.3 fix error handling   → nothing
2.4 saving state         → nothing
2.5 fix View Site link   → nothing
2.6 add indexes          → new migration
2.7 notification fix     → new migration
2.8 drop clear RPC       → new migration
2.9 type validation      → new migration (replaces old RPC)
2.10 fix RPC auth        → new migration (replaces 8 RPCs)
```

All frontend items are independent. All migration items are independent.
Can be parallelized: frontend work + migration work simultaneously.
