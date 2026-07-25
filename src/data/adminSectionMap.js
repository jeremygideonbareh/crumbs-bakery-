// Page → Sections mapping table for Admin Content Manager.
// Defines which page route each section_key belongs to and how to display them.
// Used by AdminContent.jsx for tab-based navigation and location badges.

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
      { key: 'about_section', label: 'About Columns' },
      { key: 'gallery', label: 'Gallery Images' },
      { key: 'news', label: 'News Articles' },
      { key: 'signature_items', label: 'Signature Menu Items' },
      { key: 'promo_cards', label: 'Promo Cards' },
      { key: 'image_carousel', label: 'Image Carousel' },
      { key: 'delivery', label: 'Delivery Section' },
      { key: 'faq', label: 'FAQ Items' },
      { key: 'browse_by_bake', label: 'Browse By Bake Grid' },
      { key: 'instagram', label: 'Instagram Section' },
      { key: 'product_carousel', label: 'Featured Products Carousel' },
      { key: 'footer', label: 'Footer / Contact Info' },
    ],
    productCategory: null,
  },

  // ── Cakes ─────────────────────────────────────────────────────────────
  cakes: {
    label: 'Cakes',
    route: '/cakes',
    icon: 'CakeSlice',
    description: 'Cakes page hero image + product listings',
    sections: [{ key: 'cakes_hero', label: 'Page Hero' }],
    productCategory: 'cakes',
  },

  // ── Cupcakes ──────────────────────────────────────────────────────────
  cupcakes: {
    label: 'Cupcakes',
    route: '/cupcakes',
    icon: 'Cupcake',
    description: 'Cupcakes page hero image + product listings',
    sections: [{ key: 'cupcakes_hero', label: 'Page Hero' }],
    productCategory: 'cupcakes',
  },

  // ── Desserts ──────────────────────────────────────────────────────────
  desserts: {
    label: 'Desserts',
    route: '/desserts',
    icon: 'Cookie',
    description: 'Desserts page hero + product listings (cookies, brownies, treats)',
    sections: [{ key: 'desserts_hero', label: 'Page Hero' }],
    productCategory: 'desserts',
  },

  // ── Menu ──────────────────────────────────────────────────────────────
  menu: {
    label: 'Menu',
    route: '/menus',
    icon: 'BookOpen',
    description: 'Menu board images + structured menu categories & items',
    sections: [
      { key: 'menu_images', label: 'Menu Board Images' },
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
      { key: 'about_story', label: 'About Story Columns' },
      { key: 'team', label: 'Team Members' },
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
    sections: [{ key: 'footer', label: 'Footer / Contact Info' }],
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
    const match = page.sections.find(s => s.key === sectionKey)
    if (match) {
      return {
        page: page.label,
        section: match.label,
        route: page.route,
      }
    }
  }
  return { page: 'Uncategorized', section: sectionKey, route: null }
}
