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
      { key: 'home_hero', label: '"Shillong\'s Best-Kept Secret" Hero' },
      { key: 'hero_stats', label: '"4.9 ★" Stats Bar' },
      { key: 'category_grid', label: 'Category Grid Cards' },
      { key: 'about', label: '"CRUMBS BAKERY & CAFE, SHILLONG"' },
      { label: 'SheetCakes Marquee', hardcoded: true },
      { key: 'browse_by_bake', label: '"BROWSE BY BAKE"' },
      { label: '"Signature bakes" (Derived from Menu Categories — edit items in the Menu tab)', hardcoded: true },
      { key: 'image_carousel', label: '"Behind the Bakery" → "OUR CREATIONS"' },
      { key: 'product_carousel', label: '"Featured Bakes" → "OUR COLLECTION"' },
      { key: 'menus', label: '"Our Menus" → "Browse our menu boards"' },
      { key: 'delivery', label: 'Delivery Section (heading: "WE OFFER CAKE DELIVERY IN SHILLONG")' },
      { key: 'gallery', label: '"Our Gallery" → "A taste of what we bake"' },
      { key: 'instagram', label: 'Instagram Section (heading: "INSTAGRAM")' },
      { label: 'Reviews Preview', hardcoded: true },
      { key: 'news', label: '"What\'s New" → "LATEST FROM CRUMBS"' },
      { label: 'Contact CTA', hardcoded: true },
      { key: 'faq_section', label: '"WHAT MAKES CRUMBS SPECIAL?"' },
      { label: 'Visit Us Section', hardcoded: true },
      { key: 'footer', label: '"Crumbs Bakery & Cafe" Footer' },
    ],
    productCategory: null,
  },

  // ── Cakes ─────────────────────────────────────────────────────────────
  cakes: {
    label: 'Cakes',
    route: '/cakes',
    icon: 'CakeSlice',
    description: 'Cakes page — hero, product grid, delivery info',
    sections: [
      { key: 'cakes_hero', label: 'Category Hero' },
      { key: 'cakes_product_grid', label: 'Cakes & Products', type: 'product_grid' },
      { key: 'cakes_delivery', label: 'Delivery Section' },
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
      { key: 'cupcakes_hero', label: 'Category Hero' },
      { key: 'cupcakes_product_grid', label: 'Cupcakes & Products', type: 'product_grid' },
      { key: 'cupcakes_delivery', label: 'Delivery Section' },
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
      { key: 'desserts_hero', label: 'Category Hero' },
      { key: 'desserts_product_grid', label: 'Desserts & Products', type: 'product_grid' },
      { key: 'desserts_delivery', label: 'Delivery Section' },
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
      { key: 'about_hero', label: 'About Hero' },
      { key: 'about_story', label: 'Story Section' },
      { key: 'about_timeline', label: 'Timeline' },
      { key: 'about_values', label: 'Values Cards' },
      { key: 'about_team', label: 'Team Section' },
      { key: 'about_cta', label: 'Visit Us CTA' },
    ],
    productCategory: null,
  },

  // ── Reviews ───────────────────────────────────────────────────────────
  reviews: {
    label: 'Reviews',
    route: '/reviews',
    icon: 'Star',
    description: 'Customer reviews & testimonials (managed in separate admin page)',
    sections: [
      { key: 'reviews_hero', label: 'Reviews Hero' },
      { key: 'reviews_cta', label: 'Review CTA Section' },
    ],
    productCategory: null,
  },

  // ── Contact ───────────────────────────────────────────────────────────
  contact: {
    label: 'Contact',
    route: '/contact',
    icon: 'Phone',
    description: 'Contact info, hours, address, social links in footer',
    sections: [
      { key: 'contact_hero', label: 'Contact Hero' },
      { key: 'contact_info', label: 'Contact Info Cards' },
      { key: 'contact_map', label: 'Map' },
      { key: 'contact_faq', label: 'FAQ' },
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
