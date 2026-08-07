# preorder-email-resend — Work Plan

## TL;DR (For humans)

**What you'll get:**
- Pre-order notifications switch from WhatsApp (Meta Cloud API) to **email via Resend**
- Every pre-order sends a styled HTML email to **crumbsbakery502@gmail.com** with the full order: customer name/phone/address, every item (including custom-cake base/size/filling/frosting/extras/message), total, requested date, and notes
- WhatsApp code is removed entirely (helper module, env vars, wa.me links, "via WhatsApp" toast copy)
- The email uses the sandbox sender `onboarding@resend.dev` (Resend domain `crumbs.in` is unverified) and delivers to the account owner's verified email

**Why this approach:**
- The DB trigger already fires the edge function on order INSERT — only the transport inside the function changes, no SQL migration needed
- A working Resend pattern already exists in `contact-notification/index.ts` (same `npm:resend@4`, escapeHtml, HTML table) — we reuse it exactly
- Owner-only delivery means no form changes and no customer email field needed

**What it will NOT do:**
- Will NOT send customer confirmation emails
- Will NOT change the pre-order form or the `orders` table schema
- Will NOT touch the unrelated dirty-worktree files (browse-by-bake-links, menu-add-to-cart, image fixes)

**Effort:** Small — 1 edge function rewrite + 1 helper delete + 3 frontend copy edits + secrets + deploy.
**Risk:** Low. The edge function is the only live transport; the DB trigger and frontend submit path are untouched.
**Decisions:** WhatsApp replaced entirely · owner-only recipient · sandbox sender · styled HTML format.

---

## Scope

### In Scope
1. Rewrite `supabase/functions/order-notification/index.ts` to send a styled Resend HTML email (owner-only) with full order + customer + items + customizations + total + notes + date.
2. Delete `supabase/functions/order-notification/whatsapp.ts`.
3. Frontend copy cleanup: `CartDrawer.jsx:58` toast, `AdminOrders.jsx:183/189` wa.me link + label.
4. `.env.example`: remove the 3 `VITE_WHATSAPP_*` lines.
5. Set Supabase secrets: `RESEND_API_KEY`, `OWNER_EMAIL=crumbsbakery502@gmail.com`, `FROM_EMAIL=onboarding@resend.dev`; unset `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `LILY_WHATSAPP_NUMBER`.
6. Deploy edge function with `--no-verify-jwt` (HANDOFF: deploy resets verify_jwt to true).
7. Verify: build passes + a real test order INSERT fires the trigger → email arrives.

### Out of Scope
- No customer confirmation emails.
- No changes to `orders` table schema, CartDrawer form fields, or DB triggers.
- No changes to the dirty-worktree files listed in the risk section.
- No changes to `contact-notification` (already Resend-based).

## Verification Strategy

- `npm run build` exits 0 after every frontend change.
- Edge function type-checks (Deno) — no TS errors.
- Manual QA: insert a test order row into `orders` → confirm the trigger fires `order-notification` → confirm Resend returns a 200 with an email id → confirm the email is delivered to `crumbsbakery502@gmail.com`.
- Grep confirms zero remaining WhatsApp references in the target files.
- `supabase functions list` shows `order-notification` deployed with `verify_jwt: false`.

## Execution Strategy

```
Wave 1 (Edge function) → Wave 2 (Frontend copy) → Wave 3 (Secrets + deploy) → Wave 4 (Verify) → Final Wave
```

- Wave 1 and Wave 2 are independent (different files) → run in parallel.
- Wave 3 depends on Wave 1 (function must exist before deploy).
- Wave 4 depends on Waves 1-3.

## Todos

### Wave 1 — Edge function: WhatsApp → Resend email

**1. [x] TODO 1.1 — Rewrite `order-notification/index.ts` to send a styled Resend HTML email (owner-only)**

**Reference:** `supabase/functions/order-notification/index.ts` (current WhatsApp version, lines 1-95); `supabase/functions/contact-notification/index.ts` (Resend pattern to copy: `import { Resend } from 'npm:resend@4'`, `escapeHtml()`, styled HTML table, `Deno.env.get('RESEND_API_KEY'|'OWNER_EMAIL'|'FROM_EMAIL')`).

**Task:** Rewrite `supabase/functions/order-notification/index.ts` so that on an `orders` INSERT webhook it sends ONE styled HTML email to the owner (`OWNER_EMAIL`), containing:
- Header: `🎂 New Pre-Order #<id>`
- Customer table: name, phone, address
- Items table: for each item — name, quantity, variant (if any), price; for `custom-cake` items render the customizations (base, size, filling, frosting, extras, message) as a formatted sub-table
- Order summary: total (₹, en-IN locale), requested date, notes/message, placed-at timestamp (Asia/Kolkata)
- Footer: `Crumbs Bakery & Cafe`

Requirements:
- Read env from `Deno.env.get()`: `RESEND_API_KEY`, `OWNER_EMAIL` (default `crumbsbakery502@gmail.com`), `FROM_EMAIL` (default `onboarding@resend.dev`).
- Reuse the `escapeHtml()` helper pattern from `contact-notification/index.ts` for ALL user-supplied fields (name, phone, address, item names, customizations, notes) to prevent email XSS.
- Parse `order.customer` (string JSON or object) and `order.items` (string JSON or array) defensively.
- Handle the `custom-cake` item shape: `{ name, price, quantity, variant, customizations: { base, size, filling, frosting, extras[], message } }`.
- Return `{ success: true, order_id }` on success; `{ success: false, error }` with 500 on failure; 405 on non-POST; 200 "Ignored" on non-orders-INSERT.
- Remove the WhatsApp import and all WhatsApp env var reads.

**Acceptance:**
- `index.ts` has zero references to `whatsapp`, `WHATSAPP`, `sendWhatsAppMessage`, `formatPreOrderMessage`, `LILY_WHATSAPP_NUMBER`.
- Imports `Resend` from `npm:resend@4` and reads `RESEND_API_KEY`/`OWNER_EMAIL`/`FROM_EMAIL`.
- All user fields are HTML-escaped.
- `deno check` passes (or the function's TS is valid).

**QA (happy):** `deno check index.ts` passes. Read the file — Resend import present, WhatsApp gone, escapeHtml applied to all user fields.
**QA (failure):** Grep `index.ts` for `whatsapp` → 0 matches. Grep for `escapeHtml(` → applied to name, phone, address, item names, customizations, notes.
**Commit:** `feat(order-notification): send pre-order details via Resend email instead of WhatsApp`

---

**2. [x] TODO 1.2 — Delete `supabase/functions/order-notification/whatsapp.ts`**

**Reference:** `supabase/functions/order-notification/whatsapp.ts` (sole importer is `index.ts`, confirmed by explore agent).

**Task:** Delete the file `supabase/functions/order-notification/whatsapp.ts`.

**Acceptance:** File no longer exists. No file under `supabase/` imports it.
**QA (happy):** `Test-Path` returns false for the file.
**QA (failure):** Grep `supabase/` for `from './whatsapp'` → 0 matches.
**Commit:** `chore(order-notification): remove unused WhatsApp helper`

---

### Wave 2 — Frontend copy cleanup

**3. [x] TODO 2.1 — Update `CartDrawer.jsx` success toast (remove "via WhatsApp")**

**Reference:** `src/components/CartDrawer.jsx:58` — `toast.success('Pre-order submitted! Lily will confirm via WhatsApp shortly.', { description: ... })`.

**Task:** Change the toast text to remove the WhatsApp reference. New text: `'Pre-order submitted! We'll confirm your order shortly.'` (keep the `description: Total: ...` line unchanged).

**Acceptance:** Line 58 toast no longer contains "WhatsApp".
**QA (happy):** Grep `CartDrawer.jsx` for `WhatsApp` → 0 matches.
**QA (failure):** Read line 58 — new copy present, `description` intact.
**Commit:** `feat(cart): update pre-order success toast copy`

---

**4. [x] TODO 2.2 — Update `AdminOrders.jsx` wa.me link + label**

**Reference:** `src/pages/admin/AdminOrders.jsx:183` (wa.me href) and `:189` (label "WhatsApp").

**Task:** Replace the WhatsApp contact link with a plain `tel:` call link so the admin can still reach the customer without WhatsApp. Change:
- Line 183 href from `https://wa.me/${customer.phone...}?text=...` → `tel:${customer.phone.replace(/[^0-9]/g, '')}`
- Line 189 label from `WhatsApp` → `Call`

**Acceptance:** No `wa.me` in `AdminOrders.jsx`; label reads "Call"; href is a `tel:` link.
**QA (happy):** Grep `AdminOrders.jsx` for `wa.me` → 0 matches; grep for `tel:` → present.
**QA (failure):** Read lines 182-190 — link is `tel:` and label is "Call".
**Commit:** `feat(admin): replace wa.me link with tel: call link`

---

**4. [x] TODO 2.3 — Remove WhatsApp env vars from `.env.example`**

**Reference:** `.env.example` lines 12-14 (`VITE_WHATSAPP_PHONE_NUMBER_ID`, `VITE_WHATSAPP_ACCESS_TOKEN`, `VITE_LILY_WHATSAPP_NUMBER`).

**Task:** Delete those 3 lines from `.env.example`. Optionally add a comment noting Resend secrets are set server-side via `supabase secrets set` (not in `.env`).

**Acceptance:** `.env.example` has no `WHATSAPP` lines.
**QA (happy):** Grep `.env.example` for `WHATSAPP` → 0 matches.
**QA (failure):** Read the file — WhatsApp block gone.
**Commit:** `chore(env): remove unused WhatsApp env vars from example`

---

### Wave 3 — Secrets + deploy (depends on Wave 1)

**5. [x] TODO 3.1 — Set Supabase secrets and unset WhatsApp secrets**

**Reference:** HANDOFF.md §Edge Functions; `.env` (Supabase URL `https://vkicdybgaoofabgapmbw.supabase.co`).

**Task:** From the `crumbs/` directory, run:
```
supabase secrets set RESEND_API_KEY=<RESEND_API_KEY> OWNER_EMAIL=crumbsbakery502@gmail.com FROM_EMAIL=onboarding@resend.dev
supabase secrets unset WHATSAPP_PHONE_NUMBER_ID WHATSAPP_ACCESS_TOKEN LILY_WHATSAPP_NUMBER
```
(If `supabase` CLI is not on PATH, use the Supabase Dashboard → Edge Functions → Secrets, or `npx supabase`.)

**Acceptance:** `supabase secrets list` shows `RESEND_API_KEY`, `OWNER_EMAIL`, `FROM_EMAIL` set; WhatsApp secrets absent.
**QA (happy):** `supabase secrets list` output contains the 3 Resend secrets.
**QA (failure):** `supabase secrets list` shows no `WHATSAPP_*` / `LILY_WHATSAPP_NUMBER`.
**Commit:** none (secrets are not committed).

---

**6. [x] TODO 3.2 — Deploy `order-notification` edge function with `--no-verify-jwt`**

**Reference:** HANDOFF.md — "`supabase functions deploy` resets `verify_jwt` to `true`. Always re-set via API after deploy OR use `--no-verify-jwt` flag."

**Task:** Deploy the rewritten function:
```
supabase functions deploy order-notification --no-verify-jwt
```
Then confirm `verify_jwt` is `false` (via `supabase functions list` or the Dashboard → Edge Functions → order-notification → settings).

**Acceptance:** Function deploys; `verify_jwt: false`; the DB trigger can call it without auth headers.
**QA (happy):** `supabase functions list` shows `order-notification` deployed, `verify_jwt: false`.
**QA (failure):** If `verify_jwt` shows `true`, re-run with `--no-verify-jwt` or set via API.
**Commit:** none (deployment).

---

### Wave 4 — Verification (depends on Waves 1-3)

**6. [x] TODO 4.1 — Build + full verification**

**Reference:** `package.json` scripts; `supabase/migrations/20260716000003_create_notification_triggers.sql` (trigger fires on orders INSERT).

**Tasks:**
1. `npm run build` → exit 0.
2. Grep `src/` for `whatsapp|wa.me` → only the false-positive image filename in `contentDefaults.js:141` remains (do NOT touch it).
3. Insert a test order row into `orders` (via Supabase SQL editor or `supabase db` / psql) with realistic customer + items (including one `custom-cake` item with customizations) → confirm the trigger fires `order-notification` → check the edge function logs for a successful Resend send (email id returned).
4. Confirm the email is delivered to `crumbsbakery502@gmail.com` (Resend dashboard / logs).
5. Clean up the test order row.

**Acceptance:** Build passes; test order triggers a successful Resend email; test row cleaned up.
**QA (happy):** Edge function log shows `success: true` + email id; email visible in Resend dashboard.
**QA (failure):** If email fails, check `RESEND_API_KEY` validity + sandbox recipient restriction (must be the account owner's verified email).
**Commit:** none (verification).

---

## Final Verification Wave

- [ ] F1. Plan compliance — every in-scope file changed exactly as specified; no out-of-scope file touched.
- [ ] F2. Code quality — no hardcoded secrets in tracked files; all user fields HTML-escaped; error handling present; no WhatsApp references in `src/` (except allowed image filename).
- [ ] F3. Manual QA — a real test order INSERT produced a delivered email to `crumbsbakery502@gmail.com` (evidence: edge function log + Resend delivery).
- [ ] F4. Scope fidelity — dirty-worktree files untouched; `contact-notification` untouched; `orders` schema unchanged.

## Commit Strategy

- One commit per todo (see each todo's Commit line).
- Push to `origin` (`jeremygideonbareh/crumbs-bakery-`) main after all todos pass.
- Secrets are set via `supabase secrets set` — never committed.

## Success Criteria

- `npm run build` exits 0.
- A pre-order INSERT sends a styled HTML email to `crumbsbakery502@gmail.com` with full order + customer + items + customizations + total + date + notes.
- Zero WhatsApp references remain in `src/` (except the allowed image filename).
- Edge function deployed with `verify_jwt: false`.
- Dirty-worktree files are untouched.