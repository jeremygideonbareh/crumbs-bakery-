// Page → Sections mapping table for Admin Content Manager.
// Defines which page route each section_key belongs to and how to display them.
// Sections are listed in top-to-bottom render order matching the live page.
// `hardcoded: true` = section exists on the page but is not CMS-editable yet.

export const PAGE_SECTIONS = {
  // ── Home ──────────────────────────────────────────────────────────────
  home: {
    label: 'Home',
    route: '/',
    icon: 'Home',
    description: 'Hero, stats, category grid, gallery, news, signature items, FAQ, Instagram, footer…',
    sections: [
      { key: 'home_hero', label: 'Hero Section' },
      { key: 'hero_stats', label: 'Stats Bar' },
      { key: 'category_grid', label: 'Category Grid Cards' },
      { key: 'about', label: 'About Story Columns' },
      { label: 'SheetCakes Marquee', hardcoded: true },
      { key: 'browse_by_bake', label: 'Browse By Bake Grid' },
      { key: 'signature_items', label: 'Signature Menu Items' },
      { key: 'image_carousel', label: 'Image Carousel' },
      { key: 'product_carousel', label: 'Featured Products Carousel' },
      { key: 'menus', label: 'Menu Gallery' },
      { key: 'delivery', label: 'Delivery Section' },
      { key: 'gallery', label: 'Gallery Images' },
      { key: 'instagram', label: 'Instagram Section' },
      { key: 'promo_cards', label: 'Promo Cards' },
      { label: 'Reviews Preview', hardcoded: true },
      { key: 'news', label: 'News Articles' },
      { label: 'Contact CTA', hardcoded: true },
      { key: 'faq_section', label: 'FAQ Items' },
      { label: 'Visit Us Section', hardcoded: true },
      { key: 'footer', label: 'Footer / Contact Info' },
    ],
    productCategory: null,
  },

  // ── Cakes ─────────────────────────────────────────────────────────────
  cakes: {
    label: 'Cakes',
    route: '/cakes',
    icon: 'CakeSlice',
    description: 'Cakes page — hero, category filters, product grid, delivery info',
    sections: [
      { label: 'Category Hero', hardcoded: true },
      { label: 'Category Filter Tabs', hardcoded: true },
      { label: 'Product Grid', hardcoded: true },
      { label: 'Delivery Section', hardcoded: true },
    ],
    productCategory: 'cakes',
  },

  // ── Cupcakes ──────────────────────────────────────────────────────────
  cupcakes: {
    label: 'Cupcakes',
    route: '/cupcakes',
    icon: 'Cupcake',
    description: 'Cupcakes page — hero, product grid, delivery info',
    sections: [
      { label: 'Category Hero', hardcoded: true },
      { label: 'Product Grid', hardcoded: true },
      { label: 'Delivery Section', hardcoded: true },
    ],
    productCategory: 'cupcakes',
  },

  // ── Desserts ──────────────────────────────────────────────────────────
  desserts: {
    label: 'Desserts',
    route: '/desserts',
    icon: 'Cookie',
    description: 'Desserts page — hero, product grid, delivery info (cookies, brownies, treats)',
    sections: [
      { label: 'Category Hero', hardcoded: true },
      { label: 'Product Grid', hardcoded: true },
      { label: 'Delivery Section', hardcoded: true },
    ],
    productCategory: 'desserts',
  },

  // ── Menu ──────────────────────────────────────────────────────────────
  menu: {
    label: 'Menu',
    route: '/menus',
    icon: 'BookOpen',
    description: 'Menu board images + structured menu categories & items',
    sections: [
      { label: 'Breadcrumb', hardcoded: true },
      { key: 'menu_categories', label: 'Menu Categories & Items' },
    ],
    productCategory: null,
  },

  // ── About ─────────────────────────────────────────────────────────────
  about: {
    label: 'About',
    route: '/about',
    icon: 'Info',
    description: 'About story columns + team member photos',
    sections: [
      { label: 'About Hero', hardcoded: true },
      { label: 'Story Section', hardcoded: true },
      { label: 'Timeline', hardcoded: true },
      { label: 'Values Cards', hardcoded: true },
      { label: 'Team Section', hardcoded: true },
      { label: 'Visit Us CTA', hardcoded: true },
    ],
    productCategory: null,
  },

  // ── Reviews ───────────────────────────────────────────────────────────
  reviews: {
    label: 'Reviews',
    route: '/reviews',
    icon: 'Star',
    description: 'Customer reviews & testimonials (managed in separate admin page)',
    sections: [],
    productCategory: null,
    externalUrl: '/admin/reviews',
  },

  // ── Contact ───────────────────────────────────────────────────────────
  contact: {
    label: 'Contact',
    route: '/contact',
    icon: 'Phone',
    description: 'Contact info, hours, address, social links in footer',
    sections: [
      { label: 'Contact Hero', hardcoded: true },
      { label: 'Contact Info Cards', hardcoded: true },
      { label: 'Map', hardcoded: true },
      { label: 'FAQ', hardcoded: true },
    ],
    productCategory: null,
  },

  // ── Order Now ─────────────────────────────────────────────────────────
  'order-now': {
    label: 'Order Now',
    route: '/#order',
    icon: 'ShoppingCart',
    description: 'Order CTA section with heading, features, background image',
    sections: [{ key: 'order_cta', label: 'Order CTA Section' }],
    productCategory: null,
  },
}

// Ordered page keys for tab navigation
export const PAGE_ORDER = [
  'home', 'cakes', 'cupcakes', 'desserts', 'menu',
  'about', 'reviews', 'contact', 'order-now',
]

// Look up which page and section label a section_key belongs to
export function getSectionLocation(sectionKey) {
  for (const [, page] of Object.entries(PAGE_SECTIONS)) {
    for (const s of page.sections) {
      if (s.key && s.key === sectionKey) {
        return {
          page: page.label,
          section: s.label,
          route: page.route,
        }
      }
    }
  }
  return { page: 'Uncategorized', section: sectionKey, route: null }
}
