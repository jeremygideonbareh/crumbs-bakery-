// Centralized fallback data for all page sections.
// These match the original hardcoded data exactly.
// When Supabase returns null, the site renders these defaults.

const PEXELS = (id, w = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&q=80&fit=crop`

const LOCAL = (name) => `${import.meta.env.BASE_URL}images/${encodeURIComponent(name)}`

export const HOME_HERO_DEFAULTS = {
  slogan: "SHILLONG'S BEST-KEPT SECRET",
  title: 'Where every <br> <span class="text-foreground italic">crumb</span> tells a story',
  subtitle:
    'Handcrafted tiramisu, cream puffs, cheesecakes, and artisanal bakes — made fresh daily in the heart of Shillong.',
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
  {
    name: 'AMAZING CAKES',
    desc: "Shillong's best cakes — freshly baked, expertly decorated",
    cta: 'SHOP CAKES',
    href: '/cakes',
    isRoute: true,
    image: PEXELS(140831),
  },
  {
    name: 'PERFECT CUPCAKES',
    desc: "Cupcake perfection from Shillong's finest bakery",
    cta: 'SHOP CUPCAKES',
    href: '/cupcakes',
    isRoute: true,
    image: PEXELS(14105),
  },
  {
    name: 'DECADENT DESSERTS',
    desc: 'Cookies, brownies, cheesecakes & more sweet treats',
    cta: 'SHOP DESSERTS',
    href: '/desserts',
    isRoute: true,
    image: PEXELS(2067396),
  },
  {
    name: 'CUSTOM ORDERS',
    desc: 'Design your dream cake for any celebration',
    cta: 'ORDER NOW',
    href: '#order',
    isRoute: false,
    image: PEXELS(1793037),
  },
  {
    name: 'CAFE EXPERIENCE',
    desc: 'Visit our Jaiaw cafe for a cozy treat',
    cta: 'FIND US',
    href: '/contact',
    isRoute: true,
    image: PEXELS(132694),
  },
]

export const ABOUT_DEFAULTS = [
  {
    image: PEXELS(140831),
    heading: 'CRUMBS BAKERY & CAFE, SHILLONG',
    body: 'Founded in the heart of Jaiaw, we make amazing Cakes, Cupcakes, Cookies and Brownies. You can find us in Shillong every day of the week, serving fresh treats made from scratch.',
    cta: 'VISIT OUR CAFE',
    href: '#contact',
  },
  {
    image: PEXELS(1793037),
    heading: 'CAKES & BAKES IN SHILLONG',
    body: 'You can order our exceptional Cakes and Cupcakes, as well as our famous New York Cookies and Brownies, for pickup in Shillong or hand delivery within the city. Custom orders welcome.',
    cta: 'ORDER NOW',
    href: '#order',
  },
  {
    image: PEXELS(5702761),
    heading: 'DELIVERY ACROSS SHILLONG',
    body: 'Enjoy fresh delivery on our Cakes, Cookies, and Brownies anywhere in Shillong with safe, contact-free delivery. Order online and treat yourself or someone special.',
    cta: 'ORDER DELIVERY',
    href: '#order',
  },
]

export const GALLERY_DEFAULTS = [
  {
    src: PEXELS(140831),
    alt: 'Assortment of cakes and pastries on a platter',
    caption: 'Artisanal Cakes',
  },
  {
    src: PEXELS(32916204),
    alt: 'Fresh pastries displayed in a bakery case',
    caption: 'Fresh Pastries',
  },
  {
    src: PEXELS(32706248),
    alt: 'Cakes and macarons in a display case',
    caption: 'Cakes & Macarons',
  },
  {
    src: PEXELS(14766327),
    alt: 'Tiramisu dessert',
    caption: 'Signature Tiramisu',
  },
  {
    src: PEXELS(16402099),
    alt: 'Cream puffs and eclairs',
    caption: 'Cream Puffs',
  },
  {
    src: PEXELS(38058461),
    alt: 'Cheesecake with berries',
    caption: 'Cheesecakes',
  },
]

export const NEWS_DEFAULTS = [
  {
    title: 'New Menu Items Have Landed at Crumbs Bakery!',
    image: PEXELS(2144200),
    excerpt:
      "Coming to Crumbs Bakery this weekend — new cakes, fresh flavours, and exciting treats you won't want to miss!",
    date: 'June 24, 2026',
  },
  {
    title: 'Valrhona Chocolate Cookies Are Here!!',
    image: PEXELS(37353913),
    excerpt:
      "There's a brand new, limited edition cookie — the Valrhona Choc Chip cookie, packed with delicious dark chocolate.",
    date: 'June 20, 2026',
  },
  {
    title: "What's Happening in Store This Week",
    image: PEXELS(14105),
    excerpt:
      "There's a lot of choice on the counter this week — Malteser Cupcakes, fresh bakes, and some old favourites are back!",
    date: 'June 18, 2026',
  },
  {
    title: 'A Little Look in the Bakery',
    image: PEXELS(5702761),
    excerpt:
      'A peek behind the scenes at our Jaiaw bakery — see the gorgeous cakes our team has been working on this week.',
    date: 'June 14, 2026',
  },
  {
    title: 'Recent Cakes from Our Bakery!',
    image: PEXELS(140831),
    excerpt:
      "There have been so many gorgeous cakes flying out of the bakery this week — here's a look at a few of our favourites.",
    date: 'June 10, 2026',
  },
  {
    title: 'The Cutest New Cakes on Our Menu!',
    image: PEXELS(1793037),
    excerpt:
      "We're obsessed with these new cakes and we think you will be too! Available to order now for pickup or delivery.",
    date: 'June 5, 2026',
  },
]

export const SIGNATURE_ITEMS_DEFAULTS = [
  {
    name: 'Tiramisu',
    desc: 'Our signature — bittersweet coffee-soaked layers with silky mascarpone cream. The best in Shillong, hands down.',
    highlight: 'Customer Favorite',
    price: '₹250',
    image: PEXELS(14766327),
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    name: 'Cream Puffs',
    desc: 'Light, airy choux pastry filled with velvety vanilla cream. Perfectly portioned for a quick indulgence.',
    highlight: 'Best Seller',
    price: '₹180',
    image: PEXELS(16402099),
    badge: 'bg-green-100 text-green-700',
  },
  {
    name: 'Cheesecake',
    desc: 'New York-style baked cheesecake with a buttery graham crust. Available in multiple rotating flavours.',
    highlight: 'Must Try',
    price: '₹350',
    image: PEXELS(38058461),
    badge: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'Cookies',
    desc: 'Chewy, gooey, and loaded with chocolate chunks. Made with real butter and love in every batch.',
    highlight: 'Perfect Pair',
    price: '₹120',
    image: PEXELS(37353913),
    badge: 'bg-orange-100 text-orange-700',
  },
  {
    name: 'Hot Snacks',
    desc: 'From savoury puffs to warm sandwiches — everything served hot, fresh, and satisfying.',
    highlight: 'Quick Bite',
    price: '₹150',
    image: PEXELS(32916204),
    badge: 'bg-green-100 text-green-700',
  },
  {
    name: 'Custom Cakes',
    desc: 'Birthday, anniversary, or just because. Order a custom-designed cake for your special occasion.',
    highlight: 'Celebrate',
    price: '₹500+',
    image: PEXELS(1793037),
    badge: 'bg-rose-100 text-rose-700',
  },
]

export const PROMO_CARDS_DEFAULTS = [
  {
    title: 'BAKE CLUB',
    desc: 'PDF Recipes, Behind-the-Scenes content, site-wide discounts.',
    cta: 'SIGN UP NOW',
    href: '#',
    image: PEXELS(140831),
  },
  {
    title: 'YOUTUBE',
    desc: 'New Recipe videos uploaded every week on our channel.',
    cta: 'CHECK IT OUT',
    href: '#',
    image: PEXELS(2144200),
  },
  {
    title: 'COOKIE CLUB',
    desc: 'Everything in Bake Club plus a box of Cookies delivered every month!',
    cta: 'GET THOSE COOKIES',
    href: '#',
    image: PEXELS(37353913),
  },
]

export const IMAGE_CAROUSEL_DEFAULTS = [
  { image: PEXELS(2144200), label: 'Artisanal Bakes' },
  { image: PEXELS(132694), label: 'Fresh Daily' },
  { image: PEXELS(2067396), label: 'Crafted with Love' },
  { image: PEXELS(14766327), label: "Shillong's Finest" },
]

export const DELIVERY_DEFAULTS = {
  heading: 'WE OFFER CAKE DELIVERY IN SHILLONG',
  description:
    'Whether you need cake delivery in Shillong or nearby areas we deliver our incredible Cakes and Cupcakes to all parts of the city. Safe delivery of your cake is guaranteed.',
  areas: [
    { name: 'CENTRAL SHILLONG', image: PEXELS(5702761) },
    { name: 'JAIAW & LAITUMKHRAH', image: PEXELS(32916204) },
    { name: "POLICE BAZAR & WARD'S LAKE", image: PEXELS(5702761) },
    { name: 'GREATER SHILLONG AREA', image: PEXELS(5702761) },
  ],
  footer_text:
    "Can't see your area? We deliver to almost all areas within Shillong. Use our location selector at checkout or visit us for pickup at our Jaiaw cafe.",
  cta_text: 'SHILLONG CAKE DELIVERY',
  cta_href: '#contact',
}

export const FAQ_DEFAULTS = [
  {
    title: "OVER 10 YEARS AS SHILLONG'S BEST BAKERY",
    image: PEXELS(2144200),
    content:
      "Crumbs Bakery began life in the heart of Jaiaw way back in 2014 and we've dedicated ourselves to making incredible Cakes, Cupcakes, Cookies and Brownies ever since. We're known as one of the best bakeries in Shillong and every member of our team works tirelessly every day to ensure all our bakes are perfect.",
  },
  {
    title: 'CUSTOMER SERVICE THAT GOES ABOVE & BEYOND',
    image: PEXELS(2144200),
    content:
      'Our team is passionate about cake, and even more passionate about offering exceptional customer service. We understand every order is special and will always go above and beyond to ensure your experience is perfect.',
  },
  {
    title: 'EVERYTHING FRESHLY BAKED IN SMALL BATCHES',
    image: PEXELS(140831),
    content:
      "We only ever bake to order and we always work in small batches — it takes longer but it means we can keep a fastidious eye on the quality of everything that goes into our cakes and bakes.",
  },
  {
    title: 'USING THE FINEST INGREDIENTS AVAILABLE',
    image: PEXELS(2067396),
    content:
      'All our Cakes, Cupcakes, Cookies and Brownies are made using the best ingredients we can get — from free-range eggs to the finest chocolate, the quality of ingredients has always been at the forefront of what we do.',
  },
  {
    title: 'TRUSTED BY THOUSANDS OF HAPPY CUSTOMERS',
    image: PEXELS(14105),
    content:
      "With hundreds of five-star reviews, we take pride in delivering exceptional treats every time. Whether it's a custom cake, a box of cookies, or a cupcake from our cafe, you can be sure the quality will be unmatched.",
  },
  {
    title: 'DESIGN YOUR OWN CAKE ONLINE',
    image: PEXELS(1793037),
    content:
      "You can use our custom cake builder to design your dream cake. Choose flavours, fillings, frosting, and decorations — make it uniquely yours and our bakers will bring your creation to life.",
  },
  {
    title: 'SAFE & SPEEDY DELIVERY IN SHILLONG',
    image: PEXELS(5702761),
    content:
      'We offer guaranteed safe delivery anywhere in Shillong, so you can be sure your cake will arrive looking just as perfect as when it left the bakery.',
  },
  {
    title: 'INDEPENDENTLY OWNED & OPERATED',
    image: PEXELS(38058461),
    content:
      "Since we started out, Crumbs Bakery has been independently owned and operated. We're a local Shillong business, and every order supports local families and the community.",
  },
  {
    title: 'BESPOKE CAKE OPTIONS AVAILABLE',
    image: PEXELS(132694),
    content:
      'From fully custom cakes to edible printed images and piped messages, we offer the widest range of customisations to ensure your cake is perfect for you. Contact us — we love to talk cake!',
  },
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
    PEXELS(140831),
    PEXELS(2144200),
    PEXELS(1793037),
    PEXELS(132694),
    PEXELS(14105),
    PEXELS(2067396),
    PEXELS(32421567),
    PEXELS(32916204),
    PEXELS(37353913),
    PEXELS(32421567),
    PEXELS(14766327),
    PEXELS(38058461),
  ],
}

export const FOOTER_DEFAULTS = {
  brand_name: 'Crumbs Bakery & Cafe',
  brand_description:
    'Handcrafted treats made from scratch daily in the heart of Jaiaw, Shillong. Bringing warmth and sweetness to your table since day one.',
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

export const MENUS_DEFAULTS = [
  { label: 'Cakes Menu', image: LOCAL('cakes menu.jpeg') },
  { label: 'Cheesecake Menu', image: LOCAL('cheese cakes menu.jpeg') },
  { label: 'Fruit Cake Menu', image: LOCAL('fruit cakes menu.jpeg') },
]

// Structured menu data for the interactive menu component
export const MENU_CATEGORIES_DEFAULTS = [
  {
    id: 'cakes',
    name: 'Cakes',
    subtitle: 'Price Per 500g',
    emoji: '🎂',
    accent: 'rose',
    items: [
      { name: 'Chocolate truffle', price: '₹ 950/-', desc: 'Moist chocolate sponge filled with dark chocolate ganache', highlight: 'Best Seller' },
      { name: 'Marble cake', price: '₹ 1000/-', desc: 'A fluffy and moist chocolate and vanilla marbled cake with a chocolate buttercream filling' },
      { name: 'Classic Red Velvet', price: '₹ 1000/-', desc: 'Moist red velvet sponge layers filled with a decadent creamcheese frosting', highlight: 'Popular' },
      { name: 'Salted caramel cake', price: '₹ 1000/-', desc: 'A fluffy salted caramel sponge filled with Swiss meringue buttercream and a thick delicious salted caramel' },
      { name: 'Peanut butter and Banana', price: '₹ 1100/-', desc: 'A peanut butter sponge filled with a banana caramel filling and frosted with Swiss meringue buttercream' },
      { name: 'Snickers cake', price: '₹ 1100/-', desc: 'Chocolate sponge filled with peanut butter Swiss meringue buttercream, chocolate ganache and salted caramel' },
      { name: 'Tiramisu', price: '₹ 1100/-', desc: 'Vanilla cake layers soaked in espresso and filled with mascarpone cream filling', highlight: 'Signature' },
      { name: "Matilda's classic chocolate cake", price: '₹ 1000/-', desc: 'A dark chocolate layered sponge cake filled and covered with chocolate fudge frosting' },
      { name: 'Coffee and salted caramel', price: '₹ 1000/-', desc: 'Coffee flavoured sponge soaked in espresso and filled with salted caramel Swiss meringue buttercream and salted caramel' },
      { name: 'Vanilla and chocolate', price: '₹ 900/-', desc: 'Vanilla pound cake filled with chocolate fudge frosting' },
    ],
  },
  {
    id: 'cheesecakes',
    name: 'Cheesecakes',
    subtitle: 'Price Per 500g',
    emoji: '🧀',
    accent: 'amber',
    items: [
      { name: 'A New York Cheesecake', price: '₹ 1000/-', desc: 'A classic baked cheesecake', highlight: 'Classic' },
      { name: 'Fruit variation of NY cheesecake', price: '₹ 1100/-', desc: 'Your choice of fruit topping: Strawberry, Blueberry, Mango, Cherry' },
      { name: 'Burnt Basque Cheesecake', price: '₹ 1100/-', desc: 'A spanish version of the baked cheesecake with a caramelized top and creamy center' },
      { name: 'Lemon curd Cheesecake', price: '₹ 1200/-', desc: 'A baked cheesecake topped with some tangy lemon curd' },
      { name: 'Japanese cheesecake', price: '₹ 1100/-', desc: 'The classic jiggly Japanese cheesecake, so soft and airy it melts in your mouth', highlight: 'Must Try' },
    ],
  },
  {
    id: 'fruit-cakes',
    name: 'Fruit Cakes',
    subtitle: 'Price Per 500g',
    emoji: '🍓',
    accent: 'purple',
    items: [
      { name: 'Apple spiced cake', price: '₹ 1000/-', desc: 'Moist apple sponge filled with brown butter buttercream' },
      { name: 'Lemon cake', price: '₹ 1000/-', desc: 'A soft and fragrant lemon sponge filled with lemon curd and frosted in Swiss meringue buttercream' },
      { name: 'Pina Colada cake', price: '₹ 1100/-', desc: 'Moist coconut sponge filled with pineapple filling with a touch of rum (available in alcoholic / non alcoholic version)' },
      { name: 'Lemon and blueberry', price: '₹ 1100/-', desc: 'A light and moist lemon sponge with blueberries filled with creamcheese frosting' },
      { name: 'Strawberry and cream', price: '₹ 1000/-', desc: 'A fluffy strawberry sponge cake filled with cream and strawberry compote', highlight: 'Favorite' },
      { name: 'Peaches and cream', price: '₹ 1000/-', desc: 'A moist peach sponge filled with peach compote and cream' },
      { name: 'Lime and coconut cake with mango', price: '₹ 1100/-', desc: 'A lime and coconut sponge filled with a mango curd and frosted with Swiss meringue buttercream' },
      { name: 'Sohiong and white chocolate', price: '₹ 1000/-', desc: 'A moist sponge swirled with sohiong compote filled with white chocolate swiss meringue buttercream' },
      { name: 'Raspberry and white chocolate', price: '₹ 1100/-', desc: 'Chocolate and orange sponge filled with orange infused chocolate ganache' },
      { name: 'Black Forest', price: '₹ 900/-', desc: 'Chocolate sponge soaked in cherry kirsh filled with cream and cherries', highlight: 'Classic' },
    ],
  },
]

export const PRODUCT_CAROUSEL_DEFAULTS = [
  { name: 'VINTAGE HEART CAKE', price: '₹1,200', image: PEXELS(140831) },
  {
    name: 'DESIGN YOUR OWN BESPOKE CAKE',
    price: '₹2,500',
    image: PEXELS(2144200),
  },
  {
    name: 'VINTAGE CAKE - SINGLE COLOUR',
    price: '₹1,500',
    image: PEXELS(1793037),
  },
  {
    name: 'EDIBLE IMAGE PHOTO CAKE',
    price: '₹1,800',
    image: PEXELS(37110821),
  },
  {
    name: 'CLASSIC CHOCOLATE CAKE',
    price: '₹1,000',
    image: PEXELS(132694),
  },
  {
    name: 'FUNFETTI SPRINKLE CAKE',
    price: '₹1,400',
    image: PEXELS(34155188),
  },
  {
    name: 'RASPBERRY RIPPLE CAKE',
    price: '₹1,600',
    image: PEXELS(29230134),
  },
  { name: 'BIRTHDAY CAKE', price: '₹1,200', image: PEXELS(7328340) },
  {
    name: 'CHOCOLATE BIRTHDAY CAKE',
    price: '₹1,300',
    image: PEXELS(34155188),
  },
  {
    name: 'CUSTOM CUPCAKES (DOZEN)',
    price: '₹900',
    image: PEXELS(14105),
  },
  { name: 'COOKIE BOX (6 PACK)', price: '₹600', image: PEXELS(37353913) },
  { name: 'BROWNIE BOX (6 PACK)', price: '₹700', image: PEXELS(2067396) },
]
