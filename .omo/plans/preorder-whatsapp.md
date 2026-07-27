# preorder-whatsapp — Work Plan

## TL;DR (For humans)

**What you'll get:**
- The website changes from "order" to "pre-order" everywhere — customers submit pre-orders, not paid orders
- Razorpay payment removed — no payment collected on the website
- Customer fills in their details and pre-order is submitted to Supabase
- Lily gets an automated WhatsApp message on her phone with full pre-order details (items, customer name, phone, address, date, notes)
- Lily goes to Admin Panel → Orders → Approve or Reject each pre-order
- When approved/rejected, Lily contacts the customer outside the website to handle payment

**What it will NOT do:**
- Will NOT collect any payment on the website
- Will NOT store or ask for card/bank details
- Will NOT send automated customer confirmations
- Will NOT auto-approve orders

---

## Scope

Full conversion from payment-driven ordering to WhatsApp-notified pre-order system.

### In Scope
1. Remove Razorpay payment from checkout flow in `CartDrawer.jsx`
2. Change all "Order" wording to "Pre-Order" site-wide (pages, admin, checkout, modals, navigation)
3. Add admin order status toggle: Approve / Reject (already partially implemented)
4. Add WhatsApp notification via Meta Cloud API when a pre-order is placed
5. Fix `public/_redirects` build-breaking infinite loop

### Out of Scope
- No customer-facing status tracking
- No email notifications
- No customer WhatsApp confirmations
- No changes to product catalog, categories, reviews, or gallery

---

## Files Changed

| File | Change |
|------|--------|
| `public/_redirects` | DELETE (causes infinite loop with Workers + Assets SPA config) |
| `src/components/CartDrawer.jsx` | Remove Razorpay. Change checkout to pre-order form (name, phone, address, date, notes). Submit to Supabase. |
| `src/components/OrderModal.jsx` | Change "Custom Cake Order" → "Custom Cake Pre-Order", button text changes |
| `src/context/CartContext.jsx` | No structural changes (maybe button text) |
| `src/pages/admin/AdminOrders.jsx` | Change "Orders" → "Pre-Orders". Add Approve/Reject buttons more prominent. Change status labels. |
| `src/pages/admin/AdminDashboard.jsx` | Change "Orders" → "Pre-Orders" |
| `src/hooks/useAdminApi.js` | No changes needed (RPCs stay same) |
| `supabase/functions/order-notification/index.ts` | REWRITE to send WhatsApp via Meta Cloud API instead of Resend email |
| `supabase/functions/order-notification/whatsapp.ts` | NEW - Meta Cloud API helper module |
| `.env.example` | Replace RAZORPAY_KEY_ID with WHATSAPP env vars |
| Plus wording changes in any other public-facing pages | Site-wide audit |

---

## Verification Strategy

- `npm run build` exits 0 after every change
- Manual QA: submit a test pre-order → check Supabase for new row → verify WhatsApp received on Lily's phone
- Admin panel: verify Approve/Reject changes order status correctly
- No Razorpay script loading in browser dev tools

---

## Wave Dependencies

```
Wave 1 (Fix build) → Wave 2 (Remove payment + Pre-order wording) → Wave 3 (WhatsApp function) → Wave 4 (Admin polish) → Final Wave
```

---

## Todos

### Wave 1 — Fix build + Prep

**1. [x] TODO 1.1 — Delete `public/_redirects` to fix Cloudflare build**

**Reference:** Build log shows "Invalid _redirects configuration: Line 1: Infinite loop detected"
**Task:** Delete `public/_redirects` file. The Workers + Assets config in wrangler.jsonc has `"not_found_handling": "single-page-application"` which handles SPA routing natively — the `_redirects` file conflicts.

**Acceptance:** `npm run build` exits 0. No _redirects in dist output.
**QA:** `npm run build` passes.
**Adversarial:** Verify no new _redirects is generated during build.

---

**2. [x] TODO 1.2 — Update `.env.example` — replace Razorpay with WhatsApp env vars**

**Reference:** `.env.example` currently has `VITE_RAZORPAY_KEY_ID`
**Task:** Replace Razorpay entry with:
```
# Meta WhatsApp Cloud API
VITE_WHATSAPP_PHONE_NUMBER_ID=your-whatsapp-phone-number-id
VITE_WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
VITE_LILY_WHATSAPP_NUMBER=your-whatsapp-number  # Lily's WhatsApp (with country code, no +)
```

**Acceptance:** `.env.example` has WhatsApp vars, no Razorpay var
**QA:** Read the file — correct vars present.

---

### Wave 2 — Remove Payment + Pre-order Wording

**3. [x] TODO 2.1 — Rewrite CartDrawer.jsx checkout: Remove Razorpay, convert to pre-order form**

**Reference:** `src/components/CartDrawer.jsx` lines 22-105 (handlePay, loadRazorpay, validate)
**Tasks:**
1. Remove `loadRazorpay()` function entirely
2. Remove the entire `handlePay()` function
3. Change checkout form to NOT require address (optional — for pickup)
4. Change "Proceed to Checkout" → "Continue to Pre-Order"
5. Change the submit button from `Pay ₹{subtotal}` → `Submit Pre-Order`
6. On submit: validate name + phone → insert order into `supabase.from('orders').insert(...)` with status `pending`
7. Show success toast: "Pre-order submitted! Lily will confirm via WhatsApp shortly."
8. Remove `CreditCard` icon usage, replace with `Send` or `ShoppingCart`
9. Remove import of Razorpay-related references

**Acceptance:**
- No Razorpay script loaded on page
- Checkout form submits pre-order to Supabase without any payment step
- Toast says "Pre-order submitted" not "Order placed"
- Build passes

**QA:** `npm run build` passes. Open cart → go to checkout → submit with test data → check Supabase table for new row.
**Adversarial:** Submit empty form — verify validation catches it. Submit with special chars in name.

---

**4. [x] TODO 2.2 — Change "Order" → "Pre-Order" wording site-wide**

**Tasks:**
1. `src/components/OrderModal.jsx`: Change title "Custom Cake Order" → "Custom Cake Pre-Order". Change "Add to Cart — ₹{total}" wording stays (that's adding to cart, not ordering).
2. `src/components/CartDrawer.jsx`: Checkout heading "Checkout" → "Pre-Order Details"
3. `src/pages/admin/AdminOrders.jsx`: Change heading "Orders" → "Pre-Orders". Change subtitle "View and manage cake orders" → "View and manage cake pre-orders". Change "No orders yet" → "No pre-orders yet"
4. `src/pages/admin/AdminDashboard.jsx`: Change "Total Orders" → "Total Pre-Orders". Change "Recent Orders" → "Recent Pre-Orders". Change "No orders yet" → "No pre-orders yet"
5. Search for any other "order" references in public-facing text and change to "pre-order"

**Acceptance:**
- All user-facing "Order" references become "Pre-Order"
- Build passes

**QA:** Grep for "order" (case-insensitive) in src/pages and src/components — verify changed where appropriate. Build passes.

---

### Wave 3 — WhatsApp Notification (Meta Cloud API)

**5. [x] TODO 3.1 — Create Supabase Edge Function for WhatsApp notification**

**Reference:** `supabase/functions/order-notification/index.ts` (current Resend-based function)
**Task:**
1. Create `supabase/functions/order-notification/whatsapp.ts` helper module:
   - `sendWhatsAppMessage(to: string, templateParams: object)` → calls Meta Cloud API
   - Uses `WHATSAPP_PHONE_NUMBER_ID` and `WHATSAPP_ACCESS_TOKEN` from env
   - Constructs message payload for Meta's `/messages` endpoint
   - Returns success/failure

2. Rewrite `supabase/functions/order-notification/index.ts`:
   - Remove Resend import and all email code
   - Import `sendWhatsAppMessage` from whatsapp.ts
   - On orders INSERT webhook trigger:
     - Format a nicely structured WhatsApp message to Lily containing:
       - 🎂 New Pre-Order #123
       - Customer: {name}
       - Phone: {phone}
       - Address: {address}
       - Items: {item list with quantities}
       - Total: ₹{total}
       - Date: {requested date}
       - Notes: {special instructions}
     - Call `sendWhatsAppMessage(LILY_WHATSAPP_NUMBER, messageBody)`
     - Log success/failure

3. Add DENO env var references for WhatsApp credentials

**API endpoint:** `POST https://graph.facebook.com/v22.0/{phone-number-id}/messages`
**Payload:**
```json
{
  "messaging_product": "whatsapp",
  "to": "919612772089",
  "type": "text",
  "text": { "body": "New Pre-Order #123\n\nCustomer: Priya Sharma\nPhone: 9876543210\nAddress: 123, MG Road, Shillong\n\nItems:\n• Vanilla Cupcakes (Dozen) x 2 — ₹1,200\n• Custom Chocolate Cake — ₹1,500\n\nTotal: ₹2,700\nDate: 28 July 2026\nNotes: Birthday cake, need by evening" }
}
```

**Acceptance:**
- Function deploys successfully via `supabase functions deploy order-notification`
- On INSERT to orders table, WhatsApp message is sent to Lily's number
- Build passes

**QA:** Deploy function. Insert test order row in Supabase DB. Verify WhatsApp message arrives on Lily's phone.
**Adversarial:** Test with empty customer fields — function handles gracefully.

---

**6. [x] TODO 3.2 — Connect Supabase webhook to trigger order-notification function** ✅

**Task:**
Database trigger `trg_order_notification` created on `orders` table for AFTER INSERT events. Calls `net.http_post()` to invoke the `order-notification` edge function with the full record payload.

**Verified:**
- Trigger exists and is enabled on `public.orders`
- Edge function deployed at version 8 (ACTIVE)
- Test order inserted (id=30) to verify trigger fires
- Test order cleaned up

**Still needed (Lily-side):**
Set WhatsApp env vars via `supabase secrets set`:
- `WHATSAPP_PHONE_NUMBER_ID` — from Meta WhatsApp Cloud API
- `WHATSAPP_ACCESS_TOKEN` — from Meta WhatsApp Cloud API
- `LILY_WHATSAPP_NUMBER` — Lily's WhatsApp (e.g., `919612772089`)

**Step-by-step setup (requires Supabase Dashboard credentials):**
1. Open Supabase Dashboard → Database → Webhooks → Create Webhook
2. Configure:
   - Name: `order-notification-webhook`
   - Table: `orders`
   - Event: `INSERT`
   - Function: `order-notification` (select from dropdown)
   - HTTP Method: `POST`
3. After creating, go to Edge Functions → `order-notification` → add env vars:
   - `WHATSAPP_PHONE_NUMBER_ID` — from Meta WhatsApp Cloud API setup
   - `WHATSAPP_ACCESS_TOKEN` — from Meta WhatsApp Cloud API setup
   - `LILY_WHATSAPP_NUMBER` — Lily's WhatsApp number (e.g., `919612772089`)
4. Test: Insert a test row in the orders table → check Edge Function logs

**Acceptance:** Webhook configured in Supabase Dashboard. New order INSERT triggers function.
**QA:** Insert test order row → check function logs in Supabase Dashboard.

---

### Wave 4 — Admin Panel Polish

**7. [x] TODO 4.1 — Polish Admin Orders page for pre-order workflow**

**Reference:** `src/pages/admin/AdminOrders.jsx`
**Tasks:**
1. Change "Orders" heading to "Pre-Orders" 
2. Add instruction banner: "Pre-orders appear here. Approve or contact Lily on WhatsApp to arrange payment."
3. Change status pill colors: pending → amber, approved → green, rejected → red
4. Add "Mark Approved" and "Mark Rejected" buttons (already exist as confirmed/cancelled — rename them)
5. In order detail modal: add "Customer WhatsApp" link with `wa.me` link

**Acceptance:**
- Admin orders page clearly labeled as "Pre-Orders"
- Approve/Reject buttons work correctly
- Build passes

**QA:** Open admin → Pre-Orders → change status of a test order. Build passes.

---

### Wave 5 — Final Verification

**8. [x] TODO 5.1 — Full build + deploy test** ✅

**Tasks:**
1. `npm run build` — verify exit 0 ✅
2. Commit all changes ✅ — `git commit -m "feat: convert site from Razorpay payment to pre-order + WhatsApp notifications"`
3. Push to GitHub origin ✅ — pushed to `jeremygideonbareh/crumbs-bakery-` main
4. Cloudflare Pages auto-deploys — pending Lily's fork sync
5. Verify site loads at `crumbs-bakery.pages.dev` — pending Cloudflare deploy

---

## Final Verification Wave

- [x] F1. Plan compliance ✅ — no Razorpay code found in src/ (grep confirmed 0 matches). WhatsApp notification function `order-notification/index.ts` + `whatsapp.ts` is written and ready. Pre-order wording applied everywhere (AdminOrders, AdminDashboard, OrderModal, CartDrawer).
- [x] F2. Code quality ✅ — no hardcoded secrets (all credentials from `Deno.env.get()`). WhatsApp env vars in `.env.example`. Error handling in edge function: try/catch, validation checks, meaningful error responses. WhatsApp helper handles API errors gracefully.
- [ ] F3. Manual QA ⏳ — partially unblocked. Database webhook trigger `trg_order_notification` is created and verified (test order id=30 fired the function). Still blocked on: Meta WhatsApp Cloud API credentials (Phone Number ID, Access Token, Lily's WhatsApp number) — all Lily-side setup. Run `supabase secrets set WHATSAPP_PHONE_NUMBER_ID=... WHATSAPP_ACCESS_TOKEN=... LILY_WHATSAPP_NUMBER=...` in the project directory when ready.
- [x] F4. Scope fidelity ✅ — changed files match plan exactly: `_redirects` deleted, CartDrawer.jsx converted, OrderModal.jsx/AdminOrders/AdminDashboard wording updated, WhatsApp edge function created, `.env.example` updated. No unintended modifications found.

---

## WhatsApp Setup Prerequisites

Before Wave 3 can be verified, Lily needs to complete Meta WhatsApp Cloud API setup:

1. Create Facebook Business Page for Crumbs Bakery
2. Register on Meta Business Suite
3. Create WhatsApp Business Account
4. Get Phone Number ID + Access Token
5. Share credentials to add to Supabase Edge Function env vars

These steps are Lily-side and can happen in parallel with Waves 1-4.

---

## Deployment

The project has two deployment paths:

**1. GitHub Pages** (via `.github/workflows/deploy.yml`)
- Auto-deploys on push to `main` via GitHub Actions
- **Needs fix:** Workflow still references `VITE_RAZORPAY_KEY_ID` in env vars — must be replaced with `VITE_WHATSAPP_PHONE_NUMBER_ID`, `VITE_WHATSAPP_ACCESS_TOKEN`, `VITE_LILY_WHATSAPP_NUMBER`

**2. Cloudflare Pages** (Lily's account, manually configured on Cloudflare dashboard)
- Points to Lily's fork `crumbsbakery502-art/crumbs-bakery-`
- `crumbs-bakery.pages.dev` was reachable — so it was set up at some point
- If Lily doesn't see the project in her Cloudflare dashboard → check:
  - She may be logged into the wrong Cloudflare account
  - The project may be under a different name
  - Cloudflare Pages may need to be (re)configured: New Pages project → Connect to GitHub → select the fork repo → build command: `npm run build` → output dir: `dist`
