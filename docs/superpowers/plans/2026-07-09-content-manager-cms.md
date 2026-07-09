# Content Manager CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full content management system so the bakery owner can edit every section of the website (text, images, cards, galleries, FAQs, footer) by pasting URLs or uploading images — no coding required.

**Architecture:** Extend the existing Supabase backend with a `page_sections` table for structured JSON content per section. Add an admin `/admin/content` page with dynamic form editors that render based on section type. Refactor each front-end component to fetch data from Supabase via a `usePageSection` hook, falling back to current hardcoded defaults.

**Tech Stack:** React 19, Supabase (JSONB, RPC functions, RLS), Tailwind CSS 3, Framer Motion, Lucide React, Vite

## Global Constraints

- All new files go in existing directory structure (`src/components/`, `src/pages/admin/`, `src/hooks/`)
- Use existing pattern: `@/` path alias for imports
- Follow Supabase RPC pattern already established in `useAdminApi.js`
- All new RPC functions use `admin_token` pattern for auth
- Front-end components must gracefully fall back to hardcoded data when Supabase returns null
- Images support both URL paste AND file upload (stored as URL string)
- Mobile responsive on all editor modals
- No new npm packages — use existing dependencies only
- Each section's JSON data shape must match the current hardcoded data structure exactly

---

## File Map

### New Files to Create
| File | Purpose |
|------|---------|
| `src/hooks/usePageSection.js` | Generic hook to fetch/update page section data from Supabase |
| `src/pages/admin/AdminContent.jsx` | Admin page listing all editable sections |
| `src/components/admin/SectionEditorModal.jsx` | Dynamic modal that renders editor form based on section type |
| `src/components/admin/fields/TextField.jsx` | Text/textarea input with label |
| `src/components/admin/fields/ImageField.jsx` | Image URL input + preview + upload |
| `src/components/admin/fields/ArrayEditor.jsx` | Drag-and-drop reorderable array of items |
| `src/components/admin/fields/ColorField.jsx` | Color picker |
| `src/components/admin/fields/BooleanField.jsx` | Checkbox toggle |
| `src/components/admin/fields/NumberField.jsx` | Number input |
| `src/data/contentDefaults.js` | All hardcoded defaults moved here as fallback data |
| `supabase/migrations/20260709_page_sections.sql` | SQL migration for new table + RPCs |
| `src/pages/admin/AdminContent.jsx` | Content manager page |
| `src/hooks/useContentApi.js` | Admin RPC calls for content sections |

### Files to Modify
| File | Change |
|------|--------|
| `src/App.jsx` | Add `/admin/content` route |
| `src/components/admin/AdminLayout.jsx` | Add "Content" link to sidebar |
| `src/pages/HomePage.jsx` | Pass fetched data to all child components |
| `src/components/CategoryGrid.jsx` | Accept data prop instead of hardcoded |
| `src/components/About.jsx` | Accept data prop instead of hardcoded |
| `src/components/Gallery.jsx` | Accept data prop instead of hardcoded |
| `src/components/NewsSection.jsx` | Accept data prop instead of hardcoded |
| `src/components/SignatureItems.jsx` | Accept data prop instead of hardcoded |
| `src/components/PromoCards.jsx` | Accept data prop instead of hardcoded |
| `src/components/ImageCarousel.jsx` | Accept data prop instead of hardcoded |
| `src/components/DeliverySection.jsx` | Accept data prop instead of hardcoded |
| `src/components/FaqSection.jsx` | Accept data prop instead of hardcoded |
| `src/components/BrowseByBake.jsx` | Accept data prop instead of hardcoded |
| `src/components/InstagramSection.jsx` | Accept data prop instead of hardcoded |
| `src/components/ProductCarousel.jsx` | Accept data prop instead of hardcoded |
| `src/components/Footer.jsx` | Accept data prop instead of hardcoded |
| `src/components/ui/hero-section-2.jsx` | Accept dynamic social proof stats |

---

## Task Breakdown

### Task 1: Create Database Migration — `page_sections` table + RPCs

**Files:**
- Create: `supabase/migrations/20260709_page_sections.sql`
- Modify: `src/hooks/useAdminApi.js` (add content section methods)
- Create: `src/hooks/useContentApi.js`

**Interfaces:**
- Produces: SQL for `page_sections` table, 4 RPC functions, RLS policies
- Produces: `useContentApi()` hook with `.sections.list()`, `.sections.get(key)`, `.sections.update(key, data)` methods

- [ ] **Step 1: Write the SQL migration**

```sql
-- Content Sections — stores all page content as JSONB for dynamic section management
-- Each row = one page section with its complete data payload

CREATE TABLE IF NOT EXISTS page_sections (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  section_label TEXT NOT NULL,
  section_type TEXT NOT NULL DEFAULT 'content',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read page sections" 
  ON page_sections FOR SELECT USING (true);

-- Admin-only write via RPCs
CREATE POLICY "Only admins write page sections" 
  ON page_sections FOR ALL USING (false);

-- RPC: Public read single section
CREATE OR REPLACE FUNCTION public_read_page_section(section_key TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(data, '{}'::jsonb) FROM page_sections WHERE section_key = $1;
$$;

-- RPC: Admin read all sections
CREATE OR REPLACE FUNCTION admin_read_page_sections(admin_token TEXT)
RETURNS TABLE(id BIGINT, section_key TEXT, section_label TEXT, section_type TEXT, data JSONB, updated_at TIMESTAMPTZ)
LANGUAGE sql
STABLE
AS $$
  SELECT id, section_key, section_label, section_type, data, updated_at 
  FROM page_sections 
  WHERE admin_token = current_setting('app.admin_token', true)::TEXT;
$$;

-- RPC: Admin upsert a section
CREATE OR REPLACE FUNCTION admin_upsert_page_section(admin_token TEXT, p_key TEXT, p_label TEXT, p_type TEXT, p_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
  IF admin_token <> current_setting('app.admin_token', true)::TEXT THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  
  INSERT INTO page_sections (section_key, section_label, section_type, data, updated_at)
  VALUES (p_key, p_label, p_type, p_data, now())
  ON CONFLICT (section_key) 
  DO UPDATE SET data = p_data, section_label = p_label, section_type = p_type, updated_at = now();
  
  RETURN jsonb_build_object('success', true);
END;
$$;

-- Seed all sections with default empty data
INSERT INTO page_sections (section_key, section_label, section_type) VALUES
  ('home_hero', 'Home Hero Section', 'hero'),
  ('category_grid', 'Category Grid', 'card_grid'),
  ('about', 'About Section', 'content_columns'),
  ('gallery', 'Photo Gallery', 'gallery'),
  ('news', 'News & Updates', 'news_list'),
  ('signature_items', 'Signature Menu Items', 'menu_items'),
  ('promo_cards', 'Promo / Perk Cards', 'card_grid'),
  ('image_carousel', 'Image Carousel', 'carousel'),
  ('product_carousel', 'Product Carousel', 'product_carousel'),
  ('delivery', 'Delivery Areas', 'delivery'),
  ('faq_section', 'FAQ / About Text', 'faq'),
  ('browse_by_bake', 'Browse By Bake', 'image_grid'),
  ('instagram', 'Instagram Section', 'social'),
  ('footer', 'Footer', 'footer'),
  ('hero_stats', 'Hero Social Proof Stats', 'stats')
ON CONFLICT (section_key) DO NOTHING;
```

- [ ] **Step 2: Create `src/hooks/useContentApi.js`**

```js
import { supabase } from '@/lib/supabase'
import { useAdminAuth } from '@/pages/admin/AdminLogin'

export function useContentApi() {
  const { password } = useAdminAuth()

  function rpc(name, params = {}) {
    return supabase.rpc(name, { admin_token: password, ...params })
  }

  return {
    sections: {
      list: () => rpc('admin_read_page_sections'),
      get: (sectionKey) =>
        supabase.rpc('public_read_page_section', { section_key: sectionKey }),
      update: (key, label, type, data) =>
        rpc('admin_upsert_page_section', {
          p_key: key,
          p_label: label,
          p_type: type,
          p_data: data,
        }),
    },
  }
}

/**
 * Public hook for front-end components to load section data.
 * Falls back to hardcoded defaults when Supabase is unavailable.
 */
export async function fetchPageSection(sectionKey) {
  try {
    const { data, error } = await supabase
      .rpc('public_read_page_section', { section_key: sectionKey })
    if (error) throw error
    return data
  } catch (err) {
    console.warn(`[content] Failed to fetch "${sectionKey}":`, err.message)
    return null
  }
}
```

- [ ] **Step 3: Add content section methods to `src/hooks/useAdminApi.js`**

Edit `src/hooks/useAdminApi.js` — after the `settings` block, add:
```js
    // Content sections (page-level structured data)
    content: {
      list: () => rpc('admin_read_page_sections'),
      update: (key, label, type, data) =>
        rpc('admin_upsert_page_section', {
          p_key: key, p_label: label, p_type: type, p_data: data,
        }),
    },
```

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260709_page_sections.sql src/hooks/useContentApi.js src/hooks/useAdminApi.js
git commit -m "feat: add page_sections table, RPCs, and content API hooks"
```

---

### Task 2: Create `src/hooks/usePageSection.js` — React Hook

**Files:**
- Create: `src/hooks/usePageSection.js`

**Interfaces:**
- Produces: `usePageSection(sectionKey, defaults)` hook — returns `{ data, loading, error }`
- Consumes: `fetchPageSection` from `useContentApi` (or inline the logic)

- [ ] **Step 1: Create the hook**

```js
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * React hook to fetch a page section's data from Supabase.
 * Falls back to `defaults` when no data is available or fetch fails.
 * 
 * @param {string} sectionKey - The section_key in page_sections table
 * @param {any} defaults - Fallback data when Supabase returns null
 * @returns {{ data: any, loading: boolean, error: Error|null }}
 */
export default function usePageSection(sectionKey, defaults = null) {
  const [data, setData] = useState(defaults)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data: result, error: err } = await supabase
          .rpc('public_read_page_section', { section_key: sectionKey })
        
        if (cancelled) return

        if (err) throw err

        // If result is not null/empty, use it; otherwise keep defaults
        if (result && typeof result === 'object' && Object.keys(result).length > 0) {
          setData(result)
        } else {
          setData(defaults)
        }
      } catch (err) {
        console.warn(`[usePageSection] Failed to load "${sectionKey}":`, err.message)
        if (!cancelled) {
          setError(err)
          setData(defaults) // fall back to defaults on error
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [sectionKey])

  return { data, loading, error }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/usePageSection.js
git commit -m "feat: add usePageSection hook for fetching section data"
```

---

### Task 3: Create `src/data/contentDefaults.js` — Centralized Fallback Data

**Files:**
- Create: `src/data/contentDefaults.js`

**Interfaces:**
- Produces: Exported objects matching each section's data shape — used as fallback when Supabase returns null

- [ ] **Step 1: Create the defaults file**

```js
// Centralized fallback data for all page sections.
// These match the original hardcoded data exactly.
// When Supabase returns null, the site renders these defaults.

const PEXELS = (id, w = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&q=80&fit=crop`

export const HOME_HERO_DEFAULTS = {
  slogan: "SHILLONG'S BEST-KEPT SECRET",
  title: "Where every <br> <span class=\"text-foreground italic\">crumb</span> tells a story",
  subtitle: "Handcrafted tiramisu, cream puffs, cheesecakes, and artisanal bakes — made fresh daily in the heart of Shillong.",
  cta_text: 'ORDER CUSTOM CAKE',
  background_image: PEXELS(2144200, 1920),
  contact_website: 'crumbsbakery.in',
  contact_phone: '+91 96127 72089',
  contact_address: 'Jaiaw, Shillong, Meghalaya',
}

export const HERO_STATS_DEFAULTS = [
  { number: '4.9 ★', label: 'Google Reviews' },
  { number: '500+', label: 'Happy Customers' },
  { number: '7+ Years', label: 'Serving Shillong' },
]

export const CATEGORY_GRID_DEFAULTS = [
  { name: 'AMAZING CAKES', desc: "Shillong's best cakes — freshly baked, expertly decorated", cta: 'SHOP CAKES', href: '/cakes', isRoute: true, image: PEXELS(140831) },
  { name: 'PERFECT CUPCAKES', desc: "Cupcake perfection from Shillong's finest bakery", cta: 'SHOP CUPCAKES', href: '/cupcakes', isRoute: true, image: PEXELS(14105) },
  { name: 'DECADENT DESSERTS', desc: 'Cookies, brownies, cheesecakes & more sweet treats', cta: 'SHOP DESSERTS', href: '/desserts', isRoute: true, image: PEXELS(2067396) },
  { name: 'CUSTOM ORDERS', desc: 'Design your dream cake for any celebration', cta: 'ORDER NOW', href: '#order', isRoute: false, image: PEXELS(1793037) },
  { name: 'CAFE EXPERIENCE', desc: 'Visit our Jaiaw cafe for a cozy treat', cta: 'FIND US', href: '/contact', isRoute: true, image: PEXELS(132694) },
]

export const ABOUT_DEFAULTS = [
  { image: PEXELS(140831), heading: 'CRUMBS BAKERY & CAFE, SHILLONG', body: 'Founded in the heart of Jaiaw, we make amazing Cakes, Cupcakes, Cookies and Brownies. You can find us in Shillong every day of the week, serving fresh treats made from scratch.', cta: 'VISIT OUR CAFE', href: '#contact' },
  { image: PEXELS(1793037), heading: 'CAKES & BAKES IN SHILLONG', body: 'You can order our exceptional Cakes and Cupcakes, as well as our famous New York Cookies and Brownies, for pickup in Shillong or hand delivery within the city. Custom orders welcome.', cta: 'ORDER NOW', href: '#order' },
  { image: PEXELS(5702761), heading: 'DELIVERY ACROSS SHILLONG', body: 'Enjoy fresh delivery on our Cakes, Cookies, and Brownies anywhere in Shillong with safe, contact-free delivery. Order online and treat yourself or someone special.', cta: 'ORDER DELIVERY', href: '#order' },
]

export const GALLERY_DEFAULTS = [
  { src: PEXELS(140831), alt: 'Assortment of cakes and pastries on a platter', caption: 'Artisanal Cakes' },
  { src: PEXELS(32916204), alt: 'Fresh pastries displayed in a bakery case', caption: 'Fresh Pastries' },
  { src: PEXELS(32706248), alt: 'Cakes and macarons in a display case', caption: 'Cakes & Macarons' },
  { src: PEXELS(14766327), alt: 'Tiramisu dessert', caption: 'Signature Tiramisu' },
  { src: PEXELS(16402099), alt: 'Cream puffs and eclairs', caption: 'Cream Puffs' },
  { src: PEXELS(38058461), alt: 'Cheesecake with berries', caption: 'Cheesecakes' },
]

export const NEWS_DEFAULTS = [
  { title: 'New Menu Items Have Landed at Crumbs Bakery!', image: PEXELS(2144200), excerpt: 'Coming to Crumbs Bakery this weekend — new cakes, fresh flavours, and exciting treats!', date: 'June 24, 2026' },
  { title: 'Valrhona Chocolate Cookies Are Here!!', image: PEXELS(37353913), excerpt: 'There\'s a brand new, limited edition cookie — the Valrhona Choc Chip cookie.', date: 'June 20, 2026' },
  { title: 'What\'s Happening in Store This Week', image: PEXELS(14105), excerpt: 'There\'s a lot of choice on the counter this week — Malteser Cupcakes, fresh bakes, and more!', date: 'June 18, 2026' },
  { title: 'A Little Look in the Bakery', image: PEXELS(5702761), excerpt: 'A peek behind the scenes at our Jaiaw bakery.', date: 'June 14, 2026' },
  { title: 'Recent Cakes from Our Bakery!', image: PEXELS(140831), excerpt: 'There have been so many gorgeous cakes flying out of the bakery this week!', date: 'June 10, 2026' },
  { title: 'The Cutest New Cakes on Our Menu!', image: PEXELS(1793037), excerpt: 'We\'re obsessed with these new cakes and we think you will be too!', date: 'June 5, 2026' },
]

export const SIGNATURE_ITEMS_DEFAULTS = [
  { name: 'Tiramisu', desc: 'Our signature — bittersweet coffee-soaked layers with silky mascarpone cream.', highlight: 'Customer Favorite', price: '₹250', image: PEXELS(14766327), badge: 'bg-amber-100 text-amber-700' },
  { name: 'Cream Puffs', desc: 'Light, airy choux pastry filled with velvety vanilla cream.', highlight: 'Best Seller', price: '₹180', image: PEXELS(16402099), badge: 'bg-green-100 text-green-700' },
  { name: 'Cheesecake', desc: 'New York-style baked cheesecake with a buttery graham crust.', highlight: 'Must Try', price: '₹350', image: PEXELS(38058461), badge: 'bg-purple-100 text-purple-700' },
  { name: 'Cookies', desc: 'Chewy, gooey, and loaded with chocolate chunks.', highlight: 'Perfect Pair', price: '₹120', image: PEXELS(37353913), badge: 'bg-orange-100 text-orange-700' },
  { name: 'Hot Snacks', desc: 'From savoury puffs to warm sandwiches — everything served hot and fresh.', highlight: 'Quick Bite', price: '₹150', image: PEXELS(32916204), badge: 'bg-green-100 text-green-700' },
  { name: 'Custom Cakes', desc: 'Birthday, anniversary, or just because. Order a custom-designed cake.', highlight: 'Celebrate', price: '₹500+', image: PEXELS(1793037), badge: 'bg-rose-100 text-rose-700' },
]

export const PROMO_CARDS_DEFAULTS = [
  { title: 'BAKE CLUB', desc: 'PDF Recipes, Behind-the-Scenes content, site-wide discounts.', cta: 'SIGN UP NOW', href: '#', image: PEXELS(140831) },
  { title: 'YOUTUBE', desc: 'New Recipe videos uploaded every week on our channel.', cta: 'CHECK IT OUT', href: '#', image: PEXELS(2144200) },
  { title: 'COOKIE CLUB', desc: 'Everything in Bake Club plus a box of Cookies delivered every month!', cta: 'GET THOSE COOKIES', href: '#', image: PEXELS(37353913) },
]

export const IMAGE_CAROUSEL_DEFAULTS = [
  { image: PEXELS(2144200), label: 'Artisanal Bakes' },
  { image: PEXELS(132694), label: 'Fresh Daily' },
  { image: PEXELS(2067396), label: 'Crafted with Love' },
  { image: PEXELS(14766327), label: "Shillong's Finest" },
]

export const DELIVERY_DEFAULTS = {
  heading: 'WE OFFER CAKE DELIVERY IN SHILLONG',
  description: 'Whether you need cake delivery in Shillong or nearby areas we deliver our incredible Cakes and Cupcakes to all parts of the city.',
  areas: [
    { name: 'CENTRAL SHILLONG', image: PEXELS(5702761) },
    { name: 'JAIAW & LAITUMKHRAH', image: PEXELS(32916204) },
    { name: "POLICE BAZAR & WARD'S LAKE", image: PEXELS(5702761) },
    { name: 'GREATER SHILLONG AREA', image: PEXELS(5702761) },
  ],
  footer_text: "Can't see your area? We deliver to almost all areas within Shillong.",
  cta_text: 'SHILLONG CAKE DELIVERY',
  cta_href: '#contact',
}

export const FAQ_DEFAULTS = [
  { title: "OVER 10 YEARS AS SHILLONG'S BEST BAKERY", image: PEXELS(2144200), content: "Crumbs Bakery began life in the heart of Jaiaw way back in 2014 and we've dedicated ourselves to making incredible Cakes, Cupcakes, Cookies and Brownies ever since." },
  { title: 'CUSTOMER SERVICE THAT GOES ABOVE & BEYOND', image: PEXELS(2144200), content: 'Our team is passionate about cake, and even more passionate about offering exceptional customer service.' },
  { title: 'EVERYTHING FRESHLY BAKED IN SMALL BATCHES', image: PEXELS(140831), content: "We only ever bake to order and we always work in small batches — it takes longer but it means we can keep a fastidious eye on quality." },
  { title: 'USING THE FINEST INGREDIENTS AVAILABLE', image: PEXELS(2067396), content: 'All our Cakes, Cupcakes, Cookies and Brownies are made using the best ingredients we can get.' },
  { title: 'TRUSTED BY THOUSANDS OF HAPPY CUSTOMERS', image: PEXELS(14105), content: "With hundreds of five-star reviews, we take pride in delivering exceptional treats every time." },
  { title: 'DESIGN YOUR OWN CAKE ONLINE', image: PEXELS(1793037), content: "You can use our custom cake builder to design your dream cake. Choose flavours, fillings, frosting, and decorations." },
  { title: 'SAFE & SPEEDY DELIVERY IN SHILLONG', image: PEXELS(5702761), content: 'We offer guaranteed safe delivery anywhere in Shillong.' },
  { title: 'INDEPENDENTLY OWNED & OPERATED', image: PEXELS(38058461), content: "Since we started out, Crumbs Bakery has been independently owned and operated." },
  { title: 'BESPOKE CAKE OPTIONS AVAILABLE', image: PEXELS(132694), content: 'From fully custom cakes to edible printed images and piped messages, we offer the widest range of customisations.' },
]

export const BROWSE_BY_BAKE_DEFAULTS = [
  { label: 'CAKES', image: PEXELS(140831) },
  { label: 'CUPCAKES', image: PEXELS(14105) },
  { label: 'COOKIES', image: PEXELS(37353913) },
  { label: 'BROWNIES', image: PEXELS(2067396) },
  { label: 'CORPORATE', image: PEXELS(1793037) },
]

export const INSTAGRAM_DEFAULTS = {
  heading: 'INSTAGRAM',
  description: 'Tag us in your photos for a chance to be featured on our page!',
  handle: '@CRUMBSBAKERY',
  menu_links: [
    { label: 'OUR MENU', icon: '🍰', href: 'https://instagram.com/crumbsbakery/' },
    { label: 'FRESH BAKES', icon: '🧁', href: 'https://instagram.com/crumbsbakery/' },
    { label: 'F.A.Q.', icon: '❓', href: 'https://instagram.com/crumbsbakery/' },
    { label: 'BAKING TIPS!', icon: '👩‍🍳', href: 'https://instagram.com/crumbsbakery/' },
    { label: 'CUSTOM CAKES', icon: '🎂', href: 'https://instagram.com/crumbsbakery/' },
    { label: 'FIND US!', icon: '📍', href: 'https://instagram.com/crumbsbakery/' },
  ],
  images: [
    PEXELS(140831), PEXELS(2144200), PEXELS(1793037), PEXELS(132694),
    PEXELS(14105), PEXELS(2067396), PEXELS(32421567), PEXELS(32916204),
    PEXELS(37353913), PEXELS(32421567), PEXELS(14766327), PEXELS(38058461),
  ],
}

export const FOOTER_DEFAULTS = {
  brand_name: 'Crumbs Bakery & Cafe',
  brand_description: 'Handcrafted treats made from scratch daily in the heart of Jaiaw, Shillong. Bringing warmth and sweetness to your table since day one.',
  quick_links: [
    { label: 'HOME', href: '/' },
    { label: 'CAKES', href: '/cakes' },
    { label: 'CUPCAKES', href: '/cupcakes' },
    { label: 'DESSERTS', href: '/desserts' },
    { label: 'ABOUT', href: '/about' },
    { label: 'REVIEWS', href: '/reviews' },
    { label: 'CONTACT', href: '/contact' },
  ],
  social: [
    { label: 'Facebook', href: 'https://facebook.com/crumbsbakery/' },
    { label: 'Instagram', href: 'https://instagram.com/crumbsbakery/' },
    { label: 'YouTube', href: 'https://youtube.com/@crumbsbakery' },
  ],
  contact: {
    address: 'Jaiaw, Shillong, Meghalaya, India',
    phone: '+91 99999 99999',
    email: 'hello@crumbs.in',
    hours: 'Mon – Sat: 9 AM – 8 PM\nSun: 10 AM – 6 PM',
  },
  bottom_text: 'Made with love in Shillong',
}

export const PRODUCT_CAROUSEL_DEFAULTS = [
  { name: 'VINTAGE HEART CAKE', price: '₹1,200', image: PEXELS(140831) },
  { name: 'DESIGN YOUR OWN BESPOKE CAKE', price: '₹2,500', image: PEXELS(2144200) },
  { name: 'VINTAGE CAKE - SINGLE COLOUR', price: '₹1,500', image: PEXELS(1793037) },
  { name: 'EDIBLE IMAGE PHOTO CAKE', price: '₹1,800', image: PEXELS(37110821) },
  { name: 'CLASSIC CHOCOLATE CAKE', price: '₹1,000', image: PEXELS(132694) },
  { name: 'FUNFETTI SPRINKLE CAKE', price: '₹1,400', image: PEXELS(34155188) },
  { name: 'RASPBERRY RIPPLE CAKE', price: '₹1,600', image: PEXELS(29230134) },
  { name: 'BIRTHDAY CAKE', price: '₹1,200', image: PEXELS(7328340) },
  { name: 'CHOCOLATE BIRTHDAY CAKE', price: '₹1,300', image: PEXELS(34155188) },
  { name: 'CUSTOM CUPCAKES (DOZEN)', price: '₹900', image: PEXELS(14105) },
  { name: 'COOKIE BOX (6 PACK)', price: '₹600', image: PEXELS(37353913) },
  { name: 'BROWNIE BOX (6 PACK)', price: '₹700', image: PEXELS(2067396) },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/data/contentDefaults.js
git commit -m "feat: add centralized content defaults for all page sections"
```

---

### Task 4: Create Field Editor Components

**Files:**
- Create: `src/components/admin/fields/TextField.jsx`
- Create: `src/components/admin/fields/ImageField.jsx`
- Create: `src/components/admin/fields/ArrayEditor.jsx`
- Create: `src/components/admin/fields/ColorField.jsx`
- Create: `src/components/admin/fields/BooleanField.jsx`
- Create: `src/components/admin/fields/NumberField.jsx`

- [ ] **Step 1: Create `TextField.jsx`**

```jsx
import { TextField } from '@/components/admin/fields/TextField'
// A simple label + input/textarea component
```

Actually, to keep things clean and avoid over-engineering, let me NOT create separate field component files. Instead, let me put the field rendering directly into the SectionEditorModal. Each section type defines its own field schema. Since each section has a unique data structure, a generic field renderer is actually cleaner.

Let me revise: create `SectionEditorModal.jsx` which has inline field rendering logic based on section type, plus handlers for array items (drag-and-drop reorder, add, delete).

- [ ] **Step 1: Create `src/components/admin/SectionEditorModal.jsx`**

This is the core editor. It receives a section definition + current data, renders appropriate fields for that section's type, and supports array reordering with up/down buttons.

```jsx
import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { X, GripVertical, Plus, Trash2, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SECTION_FIELDS = {
  // Defines what fields each section type has
  hero: [
    { key: 'slogan', label: 'Slogan', type: 'text' },
    { key: 'title', label: 'Title (HTML allowed)', type: 'textarea' },
    { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
    { key: 'cta_text', label: 'CTA Button Text', type: 'text' },
    { key: 'background_image', label: 'Background Image URL', type: 'image' },
    { key: 'contact_website', label: 'Website', type: 'text' },
    { key: 'contact_phone', label: 'Phone', type: 'text' },
    { key: 'contact_address', label: 'Address', type: 'text' },
  ],
  stats: [
    { key: '__array__', label: 'Stats Items', type: 'array', itemFields: [
      { key: 'number', label: 'Stat Number', type: 'text' },
      { key: 'label', label: 'Stat Label', type: 'text' },
    ]},
  ],
  card_grid: [
    { key: '__array__', label: 'Cards', type: 'array', itemFields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
      { key: 'cta', label: 'CTA Text', type: 'text' },
      { key: 'href', label: 'Link URL', type: 'text' },
      { key: 'image', label: 'Image URL', type: 'image' },
    ]},
  ],
  content_columns: [
    { key: '__array__', label: 'Columns', type: 'array', itemFields: [
      { key: 'image', label: 'Image URL', type: 'image' },
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'body', label: 'Body Text', type: 'textarea' },
      { key: 'cta', label: 'CTA Text', type: 'text' },
      { key: 'href', label: 'Link URL', type: 'text' },
    ]},
  ],
  gallery: [
    { key: '__array__', label: 'Gallery Images', type: 'array', itemFields: [
      { key: 'src', label: 'Image URL', type: 'image' },
      { key: 'alt', label: 'Alt Text', type: 'text' },
      { key: 'caption', label: 'Caption', type: 'text' },
    ]},
  ],
  news_list: [
    { key: '__array__', label: 'News Articles', type: 'array', itemFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'image', label: 'Image URL', type: 'image' },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { key: 'date', label: 'Date', type: 'text' },
    ]},
  ],
  menu_items: [
    { key: '__array__', label: 'Menu Items', type: 'array', itemFields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
      { key: 'highlight', label: 'Badge Text', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'image', label: 'Image URL', type: 'image' },
    ]},
  ],
  carousel: [
    { key: '__array__', label: 'Carousel Slides', type: 'array', itemFields: [
      { key: 'image', label: 'Image URL', type: 'image' },
      { key: 'label', label: 'Label', type: 'text' },
    ]},
  ],
  product_carousel: [
    { key: '__array__', label: 'Featured Products', type: 'array', itemFields: [
      { key: 'name', label: 'Product Name', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'image', label: 'Image URL', type: 'image' },
    ]},
  ],
  delivery: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'areas', label: 'Delivery Areas', type: 'array', itemFields: [
      { key: 'name', label: 'Area Name', type: 'text' },
      { key: 'image', label: 'Image URL', type: 'image' },
    ]},
    { key: 'footer_text', label: 'Footer Text', type: 'textarea' },
    { key: 'cta_text', label: 'CTA Text', type: 'text' },
    { key: 'cta_href', label: 'CTA Link', type: 'text' },
  ],
  faq: [
    { key: '__array__', label: 'FAQ Items', type: 'array', itemFields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'image', label: 'Image URL', type: 'image' },
      { key: 'content', label: 'Content', type: 'textarea' },
    ]},
  ],
  image_grid: [
    { key: '__array__', label: 'Images', type: 'array', itemFields: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'image', label: 'Image URL', type: 'image' },
    ]},
  ],
  social: [
    { key: 'heading', label: 'Heading', type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'handle', label: 'Social Handle', type: 'text' },
    { key: 'menu_links', label: 'Menu Links', type: 'array', itemFields: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'icon', label: 'Emoji Icon', type: 'text' },
      { key: 'href', label: 'Link URL', type: 'text' },
    ]},
    { key: 'images', label: 'Gallery Images', type: 'array', itemFields: [
      { key: '__value__', label: 'Image URL', type: 'image' },
    ]},
  ],
  footer: [
    { key: 'brand_name', label: 'Brand Name', type: 'text' },
    { key: 'brand_description', label: 'Brand Description', type: 'textarea' },
    { key: 'quick_links', label: 'Quick Links', type: 'array', itemFields: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'href', label: 'URL', type: 'text' },
    ]},
    { key: 'social', label: 'Social Links', type: 'array', itemFields: [
      { key: 'label', label: 'Platform Name', type: 'text' },
      { key: 'href', label: 'URL', type: 'text' },
    ]},
    { key: 'contact', label: 'Contact Info', type: 'object', objectFields: [
      { key: 'address', label: 'Address', type: 'textarea' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'hours', label: 'Business Hours', type: 'textarea' },
    ]},
    { key: 'bottom_text', label: 'Bottom Bar Text', type: 'text' },
  ],
}

function SimpleField({ field, value, onChange }) {
  const id = `field-${field.key}`
  
  switch (field.type) {
    case 'textarea':
      return (
        <div>
          <label htmlFor={id} className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
          <textarea
            id={id}
            value={value ?? ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-xs"
          />
        </div>
      )
    case 'image':
      return (
        <div>
          <label htmlFor={id} className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
          <div className="flex gap-2">
            <input
              id={id}
              type="text"
              value={value ?? ''}
              onChange={(e) => onChange(field.key, e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="https://images.pexels.com/..."
            />
            <ImageIcon size={18} className="text-gray-400 self-center shrink-0" />
          </div>
          {value && (
            <img
              src={value}
              alt="Preview"
              className="mt-2 w-24 h-16 object-cover rounded-lg border border-gray-100"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          )}
        </div>
      )
    case 'text':
    default:
      return (
        <div>
          <label htmlFor={id} className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
          <input
            id={id}
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      )
  }
}

function ArrayItemEditor({ item, index, fields, onChange, onMoveUp, onMoveDown, onRemove, isFirst, isLast }) {
  const handleFieldChange = (key, value) => {
    const updated = { ...item, [key]: value }
    onChange(index, updated)
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical size={14} className="text-gray-400 cursor-grab" />
          <span className="text-xs font-medium text-gray-500">Item {index + 1}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onMoveUp(index)} disabled={isFirst} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30" title="Move up">
            <ChevronUp size={14} />
          </button>
          <button onClick={() => onMoveDown(index)} disabled={isLast} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30" title="Move down">
            <ChevronDown size={14} />
          </button>
          <button onClick={() => onRemove(index)} className="p-1 hover:bg-red-100 rounded text-red-500" title="Remove">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {fields.map((field) => (
        <SimpleField
          key={field.key}
          field={field}
          value={item[field.key]}
          onChange={(key, val) => handleFieldChange(key, val)}
        />
      ))}
    </div>
  )
}

export default function SectionEditorModal({ section, currentData, onSave, onClose }) {
  const [formData, setFormData] = useState(() => 
    JSON.parse(JSON.stringify(currentData || {}))
  )
  const [saving, setSaving] = useState(false)

  const fields = SECTION_FIELDS[section.section_type] || []
  
  const handleFieldChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleArrayChange = (key, index, value) => {
    setFormData((prev) => {
      const arr = [...(prev[key] || [])]
      arr[index] = value
      return { ...prev, [key]: arr }
    })
  }

  const handleArrayAdd = useCallback((key) => {
    setFormData((prev) => {
      const arr = [...(prev[key] || [])]
      arr.push({})
      return { ...prev, [key]: arr }
    })
  }, [])

  const handleArrayRemove = useCallback((key, index) => {
    setFormData((prev) => {
      const arr = (prev[key] || []).filter((_, i) => i !== index)
      return { ...prev, [key]: arr }
    })
  }, [])

  const handleArrayMove = useCallback((key, index, direction) => {
    setFormData((prev) => {
      const arr = [...(prev[key] || [])]
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= arr.length) return prev
      ;[arr[index], arr[targetIndex]] = [arr[targetIndex], arr[index]]
      return { ...prev, [key]: arr }
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(formData)
    } finally {
      setSaving(false)
    }
  }

  // Find array fields for rendering array editors
  const renderField = (field) => {
    if (field.type === 'array') {
      const items = formData[field.key] || []
      return (
        <div key={field.key} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-gray-600">{field.label}</label>
            <Button
              variant="neutral"
              size="sm"
              onClick={() => handleArrayAdd(field.key)}
              className="gap-1 text-xs"
            >
              <Plus size={12} /> Add Item
            </Button>
          </div>
          {items.length === 0 && (
            <p className="text-xs text-gray-400 italic">No items yet. Click "Add Item" to begin.</p>
          )}
          {items.map((item, i) => (
            <ArrayItemEditor
              key={i}
              item={item}
              index={i}
              fields={field.itemFields}
              onChange={(idx, val) => handleArrayChange(field.key, idx, val)}
              onMoveUp={(idx) => handleArrayMove(field.key, idx, -1)}
              onMoveDown={(idx) => handleArrayMove(field.key, idx, 1)}
              onRemove={(idx) => handleArrayRemove(field.key, idx)}
              isFirst={i === 0}
              isLast={i === items.length - 1}
            />
          ))}
        </div>
      )
    }

    if (field.type === 'object') {
      const obj = formData[field.key] || {}
      return (
        <div key={field.key} className="space-y-3 p-3 border border-gray-200 rounded-lg bg-gray-50/30">
          <label className="block text-xs font-medium text-gray-600">{field.label}</label>
          {field.objectFields.map((subField) => (
            <SimpleField
              key={subField.key}
              field={subField}
              value={obj[subField.key]}
              onChange={(key, val) => {
                setFormData((prev) => ({
                  ...prev,
                  [field.key]: { ...(prev[field.key] || {}), [key]: val },
                }))
              }}
            />
          ))}
        </div>
      )
    }

    return (
      <SimpleField
        key={field.key}
        field={field}
        value={formData[field.key]}
        onChange={handleFieldChange}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900">{section.section_label}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Type: {section.section_type}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={16} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {fields.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No editable fields defined for this section type.
            </p>
          ) : (
            fields.map(renderField)
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100 shrink-0">
          <Button variant="neutral" onClick={onClose} size="sm">Cancel</Button>
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-1">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/SectionEditorModal.jsx
git commit -m "feat: add SectionEditorModal with dynamic field rendering"
```

---

### Task 5: Create Admin Content Page

**Files:**
- Create: `src/pages/admin/AdminContent.jsx`

**Interfaces:**
- Produces: Admin page listing all editable sections with edit buttons
- Consumes: `useContentApi` from `src/hooks/useContentApi.js`, `SectionEditorModal`

- [ ] **Step 1: Create `AdminContent.jsx`**

```jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit3, RefreshCw, Layout, Image, Type, Grid3X3, List, MessageSquare, Star, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SectionEditorModal from '@/components/admin/SectionEditorModal'
import { useContentApi } from '@/hooks/useContentApi'

const typeIcons = {
  hero: Layout,
  stats: Star,
  card_grid: Grid3X3,
  content_columns: Grid3X3,
  gallery: Image,
  news_list: List,
  menu_items: List,
  carousel: Image,
  product_carousel: Grid3X3,
  delivery: Type,
  faq: MessageSquare,
  image_grid: Image,
  social: Star,
  footer: Settings,
}

const typeColors = {
  hero: 'bg-violet-50 text-violet-600',
  stats: 'bg-amber-50 text-amber-600',
  card_grid: 'bg-blue-50 text-blue-600',
  content_columns: 'bg-green-50 text-green-600',
  gallery: 'bg-pink-50 text-pink-600',
  news_list: 'bg-cyan-50 text-cyan-600',
  menu_items: 'bg-orange-50 text-orange-600',
  carousel: 'bg-indigo-50 text-indigo-600',
  product_carousel: 'bg-teal-50 text-teal-600',
  delivery: 'bg-yellow-50 text-yellow-600',
  faq: 'bg-purple-50 text-purple-600',
  image_grid: 'bg-rose-50 text-rose-600',
  social: 'bg-fuchsia-50 text-fuchsia-600',
  footer: 'bg-gray-50 text-gray-600',
}

export default function AdminContent() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // section object being edited
  const api = useContentApi()

  const loadSections = async () => {
    setLoading(true)
    try {
      const { data } = await api.sections.list()
      setSections(data ?? [])
    } catch (err) {
      console.error('Failed to load sections:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadSections() }, [])

  const handleSave = async (formData) => {
    if (!editing) return
    const { error } = await api.sections.update(
      editing.section_key,
      editing.section_label,
      editing.section_type,
      formData
    )
    if (error) throw error
    setEditing(null)
    await loadSections()
  }

  const TypeIcon = (type) => typeIcons[type] || Settings

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Content Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Edit every section of your website — text, images, cards, and more</p>
        </div>
        <Button onClick={loadSections} variant="neutral" size="sm" className="gap-1">
          <RefreshCw size={14} /> Refresh
        </Button>
      </div>

      {editing && (
        <SectionEditorModal
          section={editing}
          currentData={{}}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Section list */}
      <div className="grid gap-3">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading sections...</div>
        ) : (
          sections.map((section, i) => {
            const Icon = typeIcons[section.section_type] || Settings
            const colorClass = typeColors[section.section_type] || 'bg-gray-50 text-gray-600'
            const hasData = section.data && typeof section.data === 'object' && Object.keys(section.data).length > 0
            
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{section.section_label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                        {section.section_type}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${hasData ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                        {hasData ? 'Has data' : 'Using defaults'}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setEditing(section)}
                  variant="neutral"
                  size="sm"
                  className="gap-1 shrink-0 ml-3"
                >
                  <Edit3 size={14} /> Edit
                </Button>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add the content route to `App.jsx`**

Edit `src/App.jsx` — add import and route:

```jsx
// Add import:
import AdminContent from './pages/admin/AdminContent'

// Add route inside the admin ProtectedRoute/AdminLayout block:
<Route path="content" element={<AdminContent />} />
```

- [ ] **Step 3: Add sidebar link in `AdminLayout.jsx`**

Edit `src/components/admin/AdminLayout.jsx` — add between categories and orders (or wherever appropriate):

```jsx
// Add import:
import { FileText } from 'lucide-react'
// Note: FileText is already available in lucide-react ^1.16.0

// Add to sidebarLinks array (after categories):
{ to: '/admin/content', icon: FileText, label: 'Content' },
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/AdminContent.jsx src/App.jsx src/components/admin/AdminLayout.jsx
git commit -m "feat: add AdminContent page with dynamic section editor"
```

---

### Task 6: Refactor HomePage to Use Dynamic Content

**Files:**
- Modify: `src/pages/HomePage.jsx`
- Modify: `src/components/ui/hero-section-2.jsx`
- Modify: `src/components/CategoryGrid.jsx`

**Interfaces:**
- Consumes: `usePageSection` hook from Task 2, defaults from Task 3

- [ ] **Step 1: Refactor `HomePage.jsx`** to fetch section data and pass to children

```jsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HeroSection } from '@/components/ui/hero-section-2'
import CategoryGrid from '@/components/CategoryGrid'
import About from '@/components/About'
import SheetCakesMarquee from '@/components/SheetCakesMarquee'
import BrowseByBake from '@/components/BrowseByBake'
import SignatureItems from '@/components/SignatureItems'
import ImageCarousel from '@/components/ImageCarousel'
import ProductCarousel from '@/components/ProductCarousel'
import DeliverySection from '@/components/DeliverySection'
import Gallery from '@/components/Gallery'
import InstagramSection from '@/components/InstagramSection'
import PromoCards from '@/components/PromoCards'
import NewsSection from '@/components/NewsSection'
import FaqSection from '@/components/FaqSection'
import { Button } from '@/components/ui/button'
import { useOrderContext } from '@/components/Layout'
import usePageSection from '@/hooks/usePageSection'
import * as DEFAULTS from '@/data/contentDefaults'

export default function HomePage() {
  const { onOrder } = useOrderContext()

  const hero = usePageSection('home_hero', DEFAULTS.HOME_HERO_DEFAULTS)
  const stats = usePageSection('hero_stats', DEFAULTS.HERO_STATS_DEFAULTS)
  const categories = usePageSection('category_grid', DEFAULTS.CATEGORY_GRID_DEFAULTS)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
    >
      <HeroSection
        slogan={hero.data?.slogan}
        title={
          <span dangerouslySetInnerHTML={{ __html: hero.data?.title || '' }} />
        }
        subtitle={hero.data?.subtitle}
        callToAction={{ text: hero.data?.cta_text || 'ORDER CUSTOM CAKE' }}
        onOrder={onOrder}
        backgroundImage={hero.data?.background_image}
        contactInfo={{
          website: hero.data?.contact_website || '',
          phone: hero.data?.contact_phone || '',
          address: hero.data?.contact_address || '',
        }}
        stats={stats.data}
      />

      <CategoryGrid data={categories.data} />
      <About />
      <SheetCakesMarquee />
      <BrowseByBake />
      <SignatureItems />
      <ImageCarousel />
      <ProductCarousel />
      <DeliverySection />
      <Gallery />
      <InstagramSection />
      <PromoCards />
      <NewsSection />
      <FaqSection />

      {/* Rest of the page sections remain unchanged for now...
          They will be individually refactored in later tasks */}
    </motion.div>
  )
}
```

- [ ] **Step 2: Update `hero-section-2.jsx`** to accept dynamic stats

Edit the `HeroSection` component — replace `SOCIAL_PROOF_STATS` with a prop:
```jsx
// Remove the const SOCIAL_PROOF_STATS = [...] line
// In the component props, add: stats
// In the JSX, replace SOCIAL_PROOF_STATS.map(...) with (stats || SOCIAL_PROOF_STATS).map(...)
// Keep SOCIAL_PROOF_STATS as fallback inside the component
```

- [ ] **Step 3: Update `CategoryGrid.jsx`** to accept data prop

```jsx
export default function CategoryGrid({ data: propData }) {
  // Use propData if available, otherwise use hardcoded fallback
  const categories = propData || [
    // ... original hardcoded data moved to contentDefaults.js
  ]
  // ... rest of component stays the same
}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/HomePage.jsx src/components/ui/hero-section-2.jsx src/components/CategoryGrid.jsx
git commit -m "refactor: HomePage, HeroSection, CategoryGrid use dynamic content"
```

---

### Task 7: Refactor All Remaining Components

Each component follows the same pattern: accept a `data` prop, fall back to defaults, render from prop data.

**Files to modify (all same pattern):**
- `src/components/About.jsx` → accept `data` prop, use `ABOUT_DEFAULTS`
- `src/components/Gallery.jsx` → accept `data` prop, use `GALLERY_DEFAULTS`
- `src/components/NewsSection.jsx` → accept `data` prop, use `NEWS_DEFAULTS`
- `src/components/SignatureItems.jsx` → accept `data` prop, use `SIGNATURE_ITEMS_DEFAULTS`
- `src/components/PromoCards.jsx` → accept `data` prop, use `PROMO_CARDS_DEFAULTS`
- `src/components/ImageCarousel.jsx` → accept `data` prop, use `IMAGE_CAROUSEL_DEFAULTS`
- `src/components/DeliverySection.jsx` → accept `data` prop, use `DELIVERY_DEFAULTS`
- `src/components/FaqSection.jsx` → accept `data` prop, use `FAQ_DEFAULTS`
- `src/components/BrowseByBake.jsx` → accept `data` prop, use `BROWSE_BY_BAKE_DEFAULTS`
- `src/components/InstagramSection.jsx` → accept `data` prop, use `INSTAGRAM_DEFAULTS`
- `src/components/ProductCarousel.jsx` → accept `data` prop, use `PRODUCT_CAROUSEL_DEFAULTS`
- `src/components/Footer.jsx` → accept `data` prop, use `FOOTER_DEFAULTS`

**Pattern for each:**
```jsx
import { SECTION_NAME_DEFAULTS } from '@/data/contentDefaults'

export default function ComponentName({ data: propData }) {
  const data = propData || SECTION_NAME_DEFAULTS
  
  // If data is an array, map over it
  if (Array.isArray(data)) {
    return (
      <div>
        {data.map((item) => (
          // use item.field instead of hardcoded field
        ))}
      </div>
    )
  }
  
  // If data is an object, use its properties
  return (
    <div>
      <h2>{data.heading}</h2>
      {/* etc */}
    </div>
  )
}
```

- [ ] **Step 1-12: Refactor each component one-by-one**

Each component:
1. Read current component
2. Add `import ...DEFAULTS from '@/data/contentDefaults'`
3. Add `data: propData` to props
4. Replace hardcoded data usage with `data || DEFAULTS`
5. Confirm no functionality broken

- [ ] **Step 13: Update `HomePage.jsx`** to fetch all sections and pass data

```jsx
// Add all section fetches:
const about = usePageSection('about', DEFAULTS.ABOUT_DEFAULTS)
const gallery = usePageSection('gallery', DEFAULTS.GALLERY_DEFAULTS)
const news = usePageSection('news', DEFAULTS.NEWS_DEFAULTS)
const signatureItems = usePageSection('signature_items', DEFAULTS.SIGNATURE_ITEMS_DEFAULTS)
const promoCards = usePageSection('promo_cards', DEFAULTS.PROMO_CARDS_DEFAULTS)
const imageCarousel = usePageSection('image_carousel', DEFAULTS.IMAGE_CAROUSEL_DEFAULTS)
const delivery = usePageSection('delivery', DEFAULTS.DELIVERY_DEFAULTS)
const faq = usePageSection('faq_section', DEFAULTS.FAQ_DEFAULTS)
const browseByBake = usePageSection('browse_by_bake', DEFAULTS.BROWSE_BY_BAKE_DEFAULTS)
const instagram = usePageSection('instagram', DEFAULTS.INSTAGRAM_DEFAULTS)
const productCarousel = usePageSection('product_carousel', DEFAULTS.PRODUCT_CAROUSEL_DEFAULTS)
const footer = usePageSection('footer', DEFAULTS.FOOTER_DEFAULTS)

// Pass to child components:
<About data={about.data} />
<BrowseByBake data={browseByBake.data} />
<SignatureItems data={signatureItems.data} />
<ImageCarousel data={imageCarousel.data} />
<ProductCarousel data={productCarousel.data} />
<DeliverySection data={delivery.data} />
<Gallery data={gallery.data} />
<InstagramSection data={instagram.data} />
<PromoCards data={promoCards.data} />
<NewsSection data={news.data} />
<FaqSection data={faq.data} />
```

- [ ] **Step 14: Commit**

```bash
git add src/pages/HomePage.jsx src/components/*.jsx src/components/ui/hero-section-2.jsx
git commit -m "refactor: all components accept dynamic content data from Supabase"
```

---

### Task 8: Handle Footer — Special Case (Used Across All Pages)

**Files:**
- Modify: `src/components/Footer.jsx`
- Modify: `src/components/Layout.jsx`

The Footer is rendered in `Layout.jsx` which wraps all public routes. We need to pass footer data through Layout or have Footer fetch its own data.

**Approach:** Have `Footer.jsx` fetch its own data using `usePageSection` since it can't receive props from the page.

- [ ] **Step 1: Update `Footer.jsx` to self-fetch**

```jsx
import usePageSection from '@/hooks/usePageSection'
import { FOOTER_DEFAULTS } from '@/data/contentDefaults'

export default function Footer() {
  const { data } = usePageSection('footer', FOOTER_DEFAULTS)
  // Use data properties instead of hardcoded values
  // ...
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.jsx
git commit -m "refactor: Footer self-fetches dynamic content"
```

---

### Task 9: Add Image Upload Support (Supabase Storage)

**Files:**
- Create: (logic inline in SectionEditorModal)
- Modify: `src/components/admin/SectionEditorModal.jsx`

**Approach:** Add a file upload button alongside the URL input. When a file is selected, upload to Supabase Storage bucket `site-images`, get the public URL, and set it in the field.

- [ ] **Step 1: Add image upload handler to SectionEditorModal**

Add upload logic for image fields:
```jsx
import { Upload } from 'lucide-react'

// In the ImageField section of SimpleField, add after the URL input:
{/* File upload button */}
<label className="shrink-0 cursor-pointer">
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={async (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      try {
        const fileName = `sections/${Date.now()}-${file.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('site-images')
          .upload(fileName, file)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage
          .from('site-images')
          .getPublicUrl(fileName)
        onChange(field.key, publicUrl)
      } catch (err) {
        console.error('Upload failed:', err)
      }
    }}
  />
  <div className="flex items-center gap-1 px-3 py-2 text-xs text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
    <Upload size={14} />
    Upload
  </div>
</label>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/SectionEditorModal.jsx
git commit -m "feat: add image upload via Supabase Storage in SectionEditorModal"
```

---

### Task 10: Verify Build & Fix Issues

- [ ] **Step 1: Run build**

```bash
npm run build
```

- [ ] **Step 2: Fix any build errors** (import paths, missing exports, etc.)

- [ ] **Step 3: Commit any fixes**

```bash
git add .
git commit -m "fix: resolve build errors from content manager refactor"
```

---

## Execution Order (Dependency-Aware)

```
Task 1 (DB + API) ──► Task 2 (Hook) ──► Task 3 (Defaults)
                                              │
                                              ▼
                                         Task 4 (Editor)
                                              │
                                              ▼
                                         Task 5 (Admin Page) ──► Task 9 (Upload)
                                              │
                    ┌─────────────────────────┘
                    ▼
     Task 6 (Hero + Categories)
                    │
                    ▼
     Task 7 (All other components)
                    │
                    ▼
     Task 8 (Footer - self-fetch)
                    │
                    ▼
     Task 10 (Build verification)
```

**Parallelizable work:**
- Tasks 1-3 can be done in sequence (they build on each other)
- Task 4 (Editor Modal) can start after Task 1 (needs section type definitions)
- Task 7 (refactoring all components) can be parallelized into sub-agents per component since they're independent

---

## Image Upload Flow

1. Owner clicks "Content" in admin sidebar
2. Sees all 15 sections listed with type icons and status badges
3. Clicks "Edit" on any section → opens SectionEditorModal
4. Modal renders fields based on section type:
   - Text fields → input/textarea
   - Image fields → URL input + preview + file upload button
   - Array fields → reorderable list with add/remove/move up/move down
   - Object fields → nested sub-fields
5. Owner edits content, adds images (by URL or file upload)
6. Clicks "Save Changes"
7. Data is upserted to `page_sections` table via RPC
8. Front-end immediately reflects changes (fetches fresh data on next page load)
