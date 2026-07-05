# Crumbs CMS & Booking System — Implementation Plan

> **Goal:** Add phone-required booking, Resend email notifications via Supabase webhooks, and a full admin CMS so the owner can edit products/text/images/pricing without code.

**Architecture:** React 19 frontend + Supabase (DB + Edge Functions) + Resend (email). Admin panel is a password-protected HashRouter section. Webhooks trigger Supabase Edge Functions on INSERT to orders/contact_messages.

**Tech Stack:** React 19, Vite 8, Tailwind 3, Framer Motion, Supabase JS v2, Resend, Supabase Edge Functions (Deno)

---

## Phase 1: Phone Collection + Fixes

### Task 1.1: Make Phone Required in OrderModal

**File:** `src/components/OrderModal.jsx`

- Change phone validation from optional to required:
  ```js
  if (!customer.phone || !customer.phone.trim() || !/^[\d\s+\-()]{6,20}$/.test(customer.phone)) {
    toast.error('Please enter a valid phone number.')
    return
  }
  ```
- Add `required` attribute to phone input
- Change placeholder to "Phone Number *"
- Update the comment/indicator in the "Your Details" section

### Task 1.2: Make Phone Required in ContactPage

**File:** `src/pages/ContactPage.jsx`

- Add phone validation to handleSubmit:
  ```js
  if (!form.phone || !form.phone.trim()) {
    toast.error('Please enter your phone number.')
    return
  }
  ```
- Validate India format: `/^[\d\s+\-()]{6,20}$/`
- Add `required` attribute to phone input

### Task 1.3: Fix Static Product Data — Load from Supabase

**Files:** Create `src/lib/products.js`, Modify category pages

- Create a Supabase query helper: `getProductsByCategory(slug)` and `getAllCategories()`
- Modify `CakesPage.jsx`, `CupcakesPage.jsx`, `DessertsPage.jsx` to fetch from Supabase instead of static imports
- Keep static data as fallback if DB is empty

---

## Phase 2: Email Notifications (Webhook + Resend)

### Task 2.1: Create order-notification Edge Function

**Create:** `supabase/functions/order-notification/index.ts`

```ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { Resend } from 'npm:@resend/node'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL')!
const resend = new Resend(RESEND_API_KEY)

serve(async (req) => {
  const { type, table, record } = await req.json()
  
  if (type !== 'INSERT' || table !== 'orders') {
    return new Response('ignored', { status: 200 })
  }

  const order = record
  const customer = typeof order.customer === 'string' ? JSON.parse(order.customer) : order.customer

  // Notify owner
  await resend.emails.send({
    from: 'Crumbs Bakery <orders@crumbs.in>',
    to: OWNER_EMAIL,
    subject: `🍰 New Order #${order.id} — ₹${order.total}`,
    html: `<h2>New Cake Order!</h2>
      <p><strong>Customer:</strong> ${customer.name}</p>
      <p><strong>Phone:</strong> ${customer.phone}</p>
      <p><strong>Email:</strong> ${customer.email}</p>
      <p><strong>Total:</strong> ₹${order.total}</p>
      <p><strong>Date requested:</strong> ${order.date || 'Not specified'}</p>
      <p><strong>Message:</strong> ${order.message || 'None'}</p>
      <pre>${JSON.stringify(order.items, null, 2)}</pre>`
  })

  // Confirm to customer
  if (customer.email) {
    await resend.emails.send({
      from: 'Crumbs Bakery <orders@crumbs.in>',
      to: customer.email,
      subject: `Your Crumbs Bakery Order #${order.id} — Confirmed!`,
      html: `<h2>Thank you for your order!</h2>
        <p>Hi ${customer.name},</p>
        <p>We've received your custom cake order and will contact you on <strong>${customer.phone}</strong> within an hour.</p>
        <p><strong>Total:</strong> ₹${order.total}</p>
        <p>— Crumbs Bakery & Cafe, Shillong</p>`
    })
  }

  return new Response('ok', { status: 200 })
})
```

### Task 2.2: Create contact-notification Edge Function

**Create:** `supabase/functions/contact-notification/index.ts`

Similar to above but for contact_messages table.

### Task 2.3: Configure Database Webhooks

Instructions for Supabase Dashboard:
- Go to Database → Webhooks
- Create webhook for `orders` table on INSERT → `order-notification` function
- Create webhook for `contact_messages` table on INSERT → `contact-notification` function

---

## Phase 3: Admin CMS

### Task 3.1: Site Settings Migration

**Create:** `supabase/migrations/20260705000000_site_settings.sql`

SQL for `site_settings` table with initial seed data for all editable site content.

### Task 3.2: Admin Auth + Layout

**Create:**
- `src/pages/admin/AdminLogin.jsx` — Password gate
- `src/pages/admin/AdminDashboard.jsx` — Stats overview
- `src/components/admin/AdminLayout.jsx` — Sidebar + header shell
- `src/components/admin/ProtectedRoute.jsx` — Auth guard

### Task 3.3: Admin Products CRUD

**Create:** `src/pages/admin/AdminProducts.jsx`

- List products in a table
- Edit modal for name, price, image, description, variants
- Add/delete products
- Reorder by sort_order

### Task 3.4: Admin Categories CRUD

**Create:** `src/pages/admin/AdminCategories.jsx`

- List/edit categories
- Upload hero images

### Task 3.5: Admin Orders Viewer

**Create:** `src/pages/admin/AdminOrders.jsx`

- Table of all orders with customer details
- Mark as "confirmed" / "completed" / "cancelled"

### Task 3.6: Admin Messages Viewer

**Create:** `src/pages/admin/AdminMessages.jsx`

- View contact messages
- Mark as read/unread

### Task 3.7: Admin Reviews Moderator

**Create:** `src/pages/admin/AdminReviews.jsx`

- Approve/reject reviews
- Delete reviews

### Task 3.8: Admin Site Settings Editor

**Create:** `src/pages/admin/AdminSettings.jsx`

- Editable form for all site settings (hero title, hero subtitle, about text, footer tagline, contact info, etc.)
- Image URL fields
- Color picker for palette
- Save to site_settings table

### Task 3.9: Wire Admin Routes

**Modify:** `src/App.jsx`

- Add `/admin/*` routes with ProtectedRoute wrapper
- Add redirect from `/admin` to `/admin/dashboard`

---

## Phase 4: Integration & Build

### Task 4.1: Fix Build Errors

- Run `npm run build`
- Fix any errors
- Fix type/lint issues

### Task 4.2: Verify & Commit

- Verify all routes work
- Verify phone validation
- Verify admin login/logout
- Commit (excluding HANDOFF.md)

---

## File Change Summary

| Action | File |
|--------|------|
| Modify | `src/components/OrderModal.jsx` |
| Modify | `src/pages/ContactPage.jsx` |
| Modify | `src/App.jsx` |
| Create | `supabase/functions/order-notification/index.ts` |
| Create | `supabase/functions/contact-notification/index.ts` |
| Create | `supabase/migrations/20260705000000_site_settings.sql` |
| Create | `src/pages/admin/AdminLogin.jsx` |
| Create | `src/pages/admin/AdminDashboard.jsx` |
| Create | `src/pages/admin/AdminProducts.jsx` |
| Create | `src/pages/admin/AdminCategories.jsx` |
| Create | `src/pages/admin/AdminOrders.jsx` |
| Create | `src/pages/admin/AdminMessages.jsx` |
| Create | `src/pages/admin/AdminReviews.jsx` |
| Create | `src/pages/admin/AdminSettings.jsx` |
| Create | `src/components/admin/AdminLayout.jsx` |
| Create | `src/components/admin/ProtectedRoute.jsx` |
| Modify | `src/lib/supabase.js` (add admin helper) |
| Create | `src/lib/products.js` (Supabase product queries) |
