# Cart System — Crumbs Bakery & Cafe

## Overview
Replace the current "Add to Order" → OrderModal (custom cake only) flow with a full cart system. "Add to Order" buttons add items to a cart. The cart is a slide-in drawer with checkout via Razorpay. Custom cakes go through the existing OrderModal customization flow and are then added to the cart.

## Requirements (User-Approved)
- **Add to Cart**: Click "Add to Order" → instantly adds 1 item with toast
- **Variants**: Products with variants open a small modal to pick variant → then adds to cart
- **Custom cakes**: Full customization in OrderModal → "Add to Cart" button → added to cart
- **Cart display**: Slide-in drawer from right side
- **Navbar**: Cart icon with badge count, always visible
- **Checkout**: Name + Phone + Address + pickup/delivery date (per order)
- **Persistence**: Cart saved to localStorage
- **Payment**: Single Razorpay payment for all cart items
- **Custom cake in cart**: Shows full details (base, size, filling, frosting, extras, total)

## Files to Create

### 1. `src/context/CartContext.jsx`
Cart state management with useReducer + localStorage.

**State shape (cart items):**
- Regular product: `{ cartId, productId, name, price, image, type: 'product', variant, quantity }`
- Custom cake: `{ cartId, name, price: <number>, type: 'custom-cake', customizations: { base, size, filling, frosting, extras, message, date }, quantity }`

**Actions:** ADD_ITEM (increments qty for matching product+variant), REMOVE_ITEM, UPDATE_QTY, CLEAR

**Exports:** CartProvider, useCart(), parsePrice(), formatPrice()

**Key behavior:** parsePrice() strips ₹ and commas from price strings like "₹1,200" → 1200. formatPrice() formats back.

### 2. `src/components/CartDrawer.jsx`
Slide-in drawer from right side using framer-motion AnimatePresence.

**Sections:**
1. **Header** — "Your Cart (N items)", close X button
2. **Items list** — scrollable:
   - Each item: image thumbnail, name, variant (if any), unit price, quantity stepper (-/+/×), line total
   - Regular product: shows product image, name, variant badge
   - Custom cake: shows cake icon, "Custom Cake", customization summary (base + size + filling...)
   - Quantity stepper: minus button, number, plus button
   - Remove button (×) to delete item
3. **Subtotal** — fixed at bottom: "Subtotal: ₹X,XXX"
4. **Checkout section** — toggled when user clicks "Proceed to Checkout":
   - Name input (required)
   - Phone input (required, validated as Indian phone: 6-20 digits)
   - Address textarea (required)
   - Pickup/Delivery Date picker (react-datepicker, optional)
   - Order notes textarea (optional)
5. **Pay button** — "Pay ₹X,XXX" → opens Razorpay

**Checkout flow:**
1. Validate: name required, phone required (regex: `/^[\d\s+\-()]{6,20}$/`), address required
2. Load Razorpay script dynamically
3. Create Razorpay instance with cart total * 100 (paise)
4. On success handler: save order to Supabase `orders` table with items, customer info, total, payment_id
5. Show success toast, clear cart, close drawer
6. On dismiss: show cancellation toast

**Data shape for orders table:**
```json
{
  "items": [{ "cartId": "...", "name": "...", "price": "₹600", "quantity": 2, "variant": null }],
  "customer": { "name": "...", "phone": "...", "address": "..." },
  "total": 1200,
  "message": "order notes...",
  "date": "2026-07-28",
  "payment_id": "pay_..."
}
```

### 3. `src/components/VariantModal.jsx`
Small centered modal for picking a variant before adding to cart.

**Props:** `product` (object with variants array), `onSelect(variant)` callback, `onClose` callback

**Flow:**
1. Modal shows product name and variant options as buttons/tags
2. User taps a variant → calls `onSelect(variant)` → adds to cart → closes
3. User can also click X/outside to close without selecting

**UI:** Simple overlay + centered card with product name, "Choose your variant" text, variant buttons in a flex-wrap grid.

## Files to Modify

### 4. `src/components/Layout.jsx`
**Changes:**
- Import CartProvider, wrap `<CartProvider><children/></CartProvider>`
- Import CartDrawer, render `<CartDrawer />`
- Keep OrderModal import and rendering (for custom cakes)
- Have CartDrawer manage its own open/close state (via internal useState, not via Layout)
- Remove old `onOrder` context that opened OrderModal from ProductGrid
- Keep `onOrder` context for Navbar ORDER NOW button only

**New context shape:** Provide both `onOrder` (for custom cakes → opens OrderModal) and `openCart` (for opening cart drawer)

### 5. `src/components/Navbar.jsx`
**Changes:**
- Import useCart for count
- Add a cart icon button (ShoppingCart icon from lucide-react) next to "ORDER NOW"
- Show a badge with item count (red dot with number)
- Badge hidden when count is 0
- Clicking cart icon opens CartDrawer (via `useCartDrawer()` or context)
- Ensure cart icon has proper aria-label
- Mobile menu: include cart icon there too

### 6. `src/components/ProductGrid.jsx`
**Changes:**
- Import `useCart()` instead of `useOrderContext()`
- Import `VariantModal` component
- Change onClick from `{ onOrder }` to `() => handleAddToCart(product)`
- `handleAddToCart` logic:
  - If product has variants (product.variants.length > 0) → show VariantModal
  - If no variants → directly `addToCart({ productId, name, price, image, type: 'product', variant: null })`
- Remove `useOrderContext` import
- "Add to Order" button text stays the same

### 7. `src/components/ProductCarousel.jsx`
**Changes:**
- Same as ProductGrid: switch from `useOrderContext` to `useCart`
- Products in carousel → add to cart directly
- Handle variants same way (variant modal)

### 8. `src/components/OrderModal.jsx`
**Changes:**
- Import `useCart()`
- Replace the entire payment/submit flow:
  - Remove the "Review & Order" step that processes Razorpay
  - Change the final step to show customization summary + "Add to Cart" button
  - "Add to Cart" calls `addToCart()` with custom cake payload and closes modal
- Remove Razorpay integration from this component (moved to CartDrawer)
- Remove `submitOrder` and `handleSubmit` functions
- Change the "Place — ₹X" button at step 4 to "Add to Cart — ₹X"
- Keep the full customization flow (steps 0-3)
- Remove customer info collection (moved to checkout)
- Keep the progress bar and step indicator

**Custom cake payload for cart:**
```js
{
  name: `Custom ${base?.name || ''} Cake`,
  price: <total number>,
  type: 'custom-cake',
  customPrice: total, // numeric price for cart calculation
  customizations: {
    base: { id: base?.id, name: base?.name },
    size: { id: size?.id, name: size?.name },
    filling: { id: filling?.id, name: filling?.name },
    frosting: { id: frosting?.id, name: frosting?.name },
    extras: selectedExtras.map(e => ({ id: e.id, name: e.name, price: e.price })),
    message,
    date,
  },
  image: null,
}
```

### 9. `src/components/CategoryGrid.jsx`
**Changes:**
- Update `onOrder` reference to use the new context
- If it's meant for custom cakes, keep it pointing to OrderModal opener
- If it redirects to category pages, leave as-is (it navigates to those pages)

### 10. `src/components/Contact.jsx` and `src/components/ui/hero-section-2.jsx`
**Changes:**
- These use `onOrder` for the "ORDER CUSTOM CAKE" button → keep opening OrderModal
- Update references if context shape changed

## Implementation Order

Wave 1 (parallel - independent new files):
- [ ] Create `src/context/CartContext.jsx` — Core: provider, reducer, localStorage, parsePrice/formatPrice
- [ ] Create `src/components/CartDrawer.jsx` — Full drawer with items + checkout + Razorpay
- [ ] Create `src/components/VariantModal.jsx` — Simple variant picker
- [ ] Create `src/notepads/cart-system/decisions.md`

Wave 2 (parallel - wire everything after CartContext exists):
- [ ] Modify `src/components/Layout.jsx` — CartProvider wrapper, CartDrawer, new context shape
- [ ] Modify `src/components/Navbar.jsx` — Cart icon with badge, linked to CartDrawer
- [ ] Modify `src/components/ProductGrid.jsx` — Switch to useCart, add to cart with VariantModal
- [ ] Modify `src/components/ProductCarousel.jsx` — Same addToCart switch
- [ ] Modify `src/components/OrderModal.jsx` — Replace payment with add to cart

Wave 3 (minor refs - parallel):
- [ ] Update `CategoryGrid.jsx` / `Contact.jsx` / `hero-section-2.jsx` — context refs

Final:
- [ ] Build and test entire cart flow

## Edge Cases & States
- **Empty cart**: Drawer shows "Your cart is empty" message with a "Browse Menu" link
- **Loading**: During Razorpay payment, button shows "Processing..." and is disabled
- **Error**: If Razorpay fails or order save fails, show error toast, don't clear cart
- **Storage full**: localStorage.setItem in try/catch, silently fail if full
- **Razorpay not loaded**: Show error toast, try reloading script
- **Invalid phone**: Client-side validation with error message under field
- **Missing address**: Client-side validation before payment
- **Variant modal cancel**: If user closes modal without picking, nothing happens

## Acceptance Criteria
- [ ] Clicking "Add to Order" on a product without variants adds 1 to cart with toast
- [ ] Clicking "Add to Order" on a variant product opens VariantModal, picking variant adds to cart
- [ ] Navbar shows cart icon with correct badge count
- [ ] CartDrawer slides in from right, shows items with name/price/variant/quantity controls
- [ ] Quantity stepper works (increment, decrement with min 1, remove at 0)
- [ ] Remove button deletes item from cart
- [ ] Subtotal updates correctly
- [ ] Cart persists across page refreshes (localStorage)
- [ ] Checkout form validates name, phone, address
- [ ] Razorpay payment processes for cart total
- [ ] Successful payment saves order to Supabase, clears cart, shows success toast
- [ ] OrderModal customizes cake → "Add to Cart" → appears in cart with full details
- [ ] Empty cart drawer shows helpful message
- [ ] Build passes with zero errors

## Final Verification
```bash
npm run build
```
