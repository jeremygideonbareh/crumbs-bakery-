// Seed page_sections table with defaults from contentDefaults.js
// Safe by default — uses admin_ensure_page_section which NEVER overwrites data.
// Use --force to call admin_upsert_page_section and overwrite everything.
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load env vars
const envPath = path.resolve('.env')
const env = fs.readFileSync(envPath, 'utf-8')
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.+)/)?.[1]?.trim()
const supabaseKey = env.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1]?.trim()
const adminPw = env.match(/VITE_ADMIN_PASSWORD=(.+)/)?.[1]?.trim() || 'admin123'

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env')
  process.exit(1)
}

const BASE_URL = '/images/'
const supabase = createClient(supabaseUrl, supabaseKey)

async function rpc(name, params = {}) {
  const { data, error } = await supabase.rpc(name, { admin_token: adminPw, ...params })
  if (error) throw new Error(`${name}: ${error.message}`)
  return data
}

// Map content defaults to image paths that exist
function local(name) {
  // Use encodeURIComponent to match the LOCAL() helper behavior
  return `${BASE_URL}${encodeURIComponent(name)}`
}

const sections = [
  {
    key: 'home_hero', label: 'Home Hero Section', type: 'hero',
    data: {
      slogan: "SHILLONG'S BEST-KEPT SECRET",
      title: 'Where every <br> <span class="text-foreground italic">crumb</span> tells a story',
      subtitle: 'Handcrafted tiramisu, cream puffs, cheesecakes, and artisanal bakes — made fresh daily in the heart of Shillong.',
      cta_text: 'ORDER CUSTOM CAKE',
      background_image: local('bespoke-cake.jpeg'),
      contact_website: 'crumbsbakery.in',
      contact_phone: '+91 96127 72089',
      contact_address: 'Jaiaw, Shillong, Meghalaya',
    },
  },
  {
    key: 'hero_stats', label: 'Hero Social Proof Stats', type: 'stats',
    data: [
      { number: '4.9 ★', label: 'Google Reviews' },
      { number: '500+', label: 'Happy Customers' },
      { number: '7+ Years', label: 'Serving Shillong' },
    ],
  },
  {
    key: 'category_grid', label: 'Category Grid', type: 'card_grid',
    data: [
      { name: 'AMAZING CAKES', desc: "Shillong's best cakes — freshly baked, expertly decorated", cta: 'SHOP CAKES', href: '/cakes', isRoute: true, image: local('chocolate-cake-800.jpeg') },
      { name: 'PERFECT CUPCAKES', desc: "Cupcake perfection from Shillong's finest bakery", cta: 'SHOP CUPCAKES', href: '/cupcakes', isRoute: true, image: local('vanilla-cupcake-800.jpeg') },
      { name: 'DECADENT DESSERTS', desc: 'Cookies, brownies, cheesecakes & more sweet treats', cta: 'SHOP DESSERTS', href: '/desserts', isRoute: true, image: local('choc-chip-cookie-800.jpeg') },
      { name: 'CUSTOM ORDERS', desc: 'Design your dream cake for any celebration', cta: 'ORDER NOW', href: '#order', isRoute: false, image: local('bespoke-cake.jpeg') },
      { name: 'CAFE EXPERIENCE', desc: 'Visit our Jaiaw cafe for a cozy treat', cta: 'FIND US', href: '/contact', isRoute: true, image: local('delivery-bakery-800.jpeg') },
    ],
  },
  {
    key: 'about', label: 'About Section', type: 'content_columns',
    data: [
      { image: local('fresh-bakes-1.jpeg'), heading: 'CRUMBS BAKERY & CAFE, SHILLONG', body: 'Founded in the heart of Jaiaw, we make amazing Cakes, Cupcakes, Cookies and Brownies.', cta: 'VISIT OUR CAFE', href: '#contact' },
      { image: local('bespoke-cake.jpeg'), heading: 'CAKES & BAKES IN SHILLONG', body: 'You can order our exceptional Cakes and Cupcakes for pickup or delivery.', cta: 'ORDER NOW', href: '#order' },
      { image: local('delivery-bakery-800.jpeg'), heading: 'DELIVERY ACROSS SHILLONG', body: 'Enjoy fresh delivery on our Cakes anywhere in Shillong.', cta: 'ORDER DELIVERY', href: '#order' },
    ],
  },
  {
    key: 'gallery', label: 'Photo Gallery', type: 'gallery',
    data: [
      { src: local('fresh-bakes-1.jpeg'), alt: 'Assortment of cakes', caption: 'Artisanal Cakes' },
      { src: local('fresh-bakes-2.jpeg'), alt: 'Fresh pastries', caption: 'Fresh Pastries' },
      { src: local('fresh-bakes-3.jpeg'), alt: 'Cakes and macarons', caption: 'Cakes & Macarons' },
      { src: local('tiramisu-800.jpeg'), alt: 'Tiramisu dessert', caption: 'Signature Tiramisu' },
      { src: local('cream-puffs.jpeg'), alt: 'Cream puffs', caption: 'Cream Puffs' },
      { src: local('ny-cheesecake.jpeg'), alt: 'Cheesecake', caption: 'Cheesecakes' },
      { src: local('japanese-cheesecake-slice.jpeg'), alt: 'Japanese cheesecake', caption: 'Japanese Cheesecake' },
      { src: local('chocolate-cake.jpeg'), alt: 'Chocolate cake', caption: 'Chocolate Cake' },
    ],
  },
  {
    key: 'signature_items', label: 'Signature Menu Items', type: 'menu_items',
    data: [
      { name: 'Tiramisu', desc: 'Our signature — bittersweet coffee-soaked layers with silky mascarpone cream.', highlight: 'Customer Favorite', price: '₹250', image: local('tiramisu-800.jpeg'), badge: 'bg-amber-100 text-amber-700' },
      { name: 'Cream Puffs', desc: 'Light, airy choux pastry filled with velvety vanilla cream.', highlight: 'Best Seller', price: '₹180', image: local('cream-puffs.jpeg'), badge: 'bg-green-100 text-green-700' },
      { name: 'Cheesecake', desc: 'New York-style baked cheesecake with a buttery graham crust.', highlight: 'Must Try', price: '₹350', image: local('ny-cheesecake.jpeg'), badge: 'bg-purple-100 text-purple-700' },
      { name: 'Cookies', desc: 'Chewy, gooey, and loaded with chocolate chunks.', highlight: 'Perfect Pair', price: '₹120', image: local('choc-chip-cookie.jpeg'), badge: 'bg-orange-100 text-orange-700' },
      { name: 'Hot Snacks', desc: 'From savoury puffs to warm sandwiches.', highlight: 'Quick Bite', price: '₹150', image: local('chicken-pizza.jpeg'), badge: 'bg-green-100 text-green-700' },
      { name: 'Custom Cakes', desc: 'Birthday, anniversary, or just because.', highlight: 'Celebrate', price: '₹500+', image: local('bespoke-cake.jpeg'), badge: 'bg-rose-100 text-rose-700' },
    ],
  },
  {
    key: 'promo_cards', label: 'Promo / Perk Cards', type: 'card_grid',
    data: [
      { title: 'BAKE CLUB', desc: 'PDF Recipes, Behind-the-Scenes content, site-wide discounts.', cta: 'SIGN UP NOW', href: '#', image: local('fresh-bakes-1.jpeg') },
      { title: 'YOUTUBE', desc: 'New Recipe videos uploaded every week.', cta: 'CHECK IT OUT', href: '#', image: local('bespoke-cake.jpeg') },
      { title: 'COOKIE CLUB', desc: 'Everything in Bake Club plus a box of Cookies every month!', cta: 'GET THOSE COOKIES', href: '#', image: local('choc-chip-cookie-800.jpeg') },
    ],
  },
  {
    key: 'image_carousel', label: 'Image Carousel', type: 'carousel',
    data: [
      { image: local('bespoke-cake.jpeg'), label: 'Artisanal Bakes' },
      { image: local('chocolate-cake-800.jpeg'), label: 'Fresh Daily' },
      { image: local('fresh-bakes-2.jpeg'), label: 'Crafted with Love' },
      { image: local('tiramisu-800.jpeg'), label: "Shillong's Finest" },
      { image: local('japanese-cheesecake-slice.jpeg'), label: 'Japanese Cheesecake' },
      { image: local('fresh-bakes-3.jpeg'), label: 'Fresh Bakes' },
    ],
  },
  {
    key: 'delivery', label: 'Delivery Areas', type: 'delivery',
    data: {
      heading: 'WE OFFER CAKE DELIVERY IN SHILLONG',
      description: 'Whether you need cake delivery in Shillong or nearby areas we deliver our incredible Cakes.',
      areas: [
        { name: 'CENTRAL SHILLONG', image: local('delivery-bakery-800.jpeg') },
        { name: 'JAIAW & LAITUMKHRAH', image: local('muffin-800.jpeg') },
        { name: "POLICE BAZAR & WARD'S LAKE", image: local('delivery-bakery-800.jpeg') },
        { name: 'GREATER SHILLONG AREA', image: local('delivery-bakery-800.jpeg') },
      ],
      footer_text: "Can't see your area? We deliver to almost all areas within Shillong.",
      cta_text: 'SHILLONG CAKE DELIVERY',
      cta_href: '#contact',
    },
  },
  {
    key: 'faq_section', label: 'FAQ / About Text', type: 'faq',
    data: [
      { title: "OVER 10 YEARS AS SHILLONG'S BEST BAKERY", image: local('bespoke-cake.jpeg'), content: "Crumbs Bakery began life in the heart of Jaiaw way back in 2014." },
      { title: 'CUSTOMER SERVICE THAT GOES ABOVE & BEYOND', image: local('bespoke-cake.jpeg'), content: 'Our team is passionate about cake and exceptional customer service.' },
      { title: 'EVERYTHING FRESHLY BAKED IN SMALL BATCHES', image: local('cinnamon-rolls-800.jpeg'), content: 'We only ever bake to order in small batches.' },
      { title: 'USING THE FINEST INGREDIENTS AVAILABLE', image: local('brownies.jpeg'), content: 'All our bakes use the best ingredients available.' },
    ],
  },
  {
    key: 'browse_by_bake', label: 'Browse By Bake', type: 'image_grid',
    data: [
      { label: 'CAKES', image: local('chocolate-cake.jpeg') },
      { label: 'CUPCAKES', image: local('vanilla-cupcake.jpeg') },
      { label: 'COOKIES', image: local('choc-chip-cookie.jpeg') },
      { label: 'BROWNIES', image: local('brownies.jpeg') },
      { label: 'CORPORATE', image: local('bespoke-cake.jpeg') },
    ],
  },
  {
    key: 'instagram', label: 'Instagram Section', type: 'social',
    data: {
      heading: 'INSTAGRAM',
      description: 'Tag us in your photos for a chance to be featured!',
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
        local('cinnamon-rolls-800.jpeg'), local('bespoke-cake.jpeg'), local('vintage-custom-800.jpeg'),
        local('chocolate-cake-800.jpeg'), local('vanilla-cupcake-800.jpeg'), local('brownies.jpeg'),
        local('chocolate-cupcake-800.jpeg'), local('muffin-800.jpeg'), local('choc-chip-cookie-800.jpeg'),
        local('chocolate-cupcake-800.jpeg'), local('tiramisu-800.jpeg'), local('ny-cheesecake.jpeg'),
        local('japanese-cheesecake-slice.jpeg'), local('fresh-bakes-1.jpeg'), local('delivery-bakery-800.jpeg'),
        local('quiche-2.jpeg'),
      ],
    },
  },
  {
    key: 'footer', label: 'Footer', type: 'footer',
    data: {
      brand_name: 'Crumbs Bakery & Cafe',
      brand_description: 'Handcrafted treats made from scratch daily in Jaiaw, Shillong.',
      quick_links: [
        { label: 'HOME', href: '/' }, { label: 'CAKES', href: '/cakes' },
        { label: 'CUPCAKES', href: '/cupcakes' }, { label: 'DESSERTS', href: '/desserts' },
        { label: 'ABOUT', href: '/about' }, { label: 'REVIEWS', href: '/reviews' },
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
    },
  },
  {
    key: 'news', label: 'News & Updates', type: 'news_list',
    data: [
      { title: 'Fresh Bakes Just Out of the Oven!', image: local('fresh-bakes-1.jpeg'), excerpt: "There's something special fresh out of the bakery today!", date: 'July 15, 2026' },
      { title: 'New Menu Items Have Landed!', image: local('bespoke-cake.jpeg'), excerpt: "New cakes, fresh flavours, and exciting treats!", date: 'June 24, 2026' },
      { title: 'Valrhona Chocolate Cookies Are Here!!', image: local('choc-chip-cookie-800.jpeg'), excerpt: "Limited edition Valrhona Choc Chip cookie.", date: 'June 20, 2026' },
      { title: "What's Happening in Store This Week", image: local('vanilla-cupcake-800.jpeg'), excerpt: "Malteser Cupcakes and old favourites are back!", date: 'June 18, 2026' },
    ],
  },
  {
    key: 'product_carousel', label: 'Product Carousel', type: 'product_carousel',
    data: [
      { name: 'Japanese cheesecake', price: '₹1,100', image: local('japanese-cheesecake-slice.jpeg') },
      { name: 'DESIGN YOUR OWN BESPOKE CAKE', price: '₹2,500', image: local('bespoke-cake.jpeg') },
      { name: 'VINTAGE CAKE - SINGLE COLOUR', price: '₹1,500', image: local('vintage-custom-800.jpeg') },
      { name: 'EDIBLE IMAGE PHOTO CAKE', price: '₹1,800', image: local('edible-photo-cake-800.jpeg') },
      { name: 'CLASSIC CHOCOLATE CAKE', price: '₹1,000', image: local('chocolate-cake-800.jpeg') },
      { name: 'FUNFETTI SPRINKLE CAKE', price: '₹1,400', image: local('funfetti-sheet-800.jpeg') },
      { name: 'RASPBERRY RIPPLE CAKE', price: '₹1,600', image: local('raspberry-ripple-800.jpeg') },
      { name: 'BIRTHDAY CAKE', price: '₹1,200', image: local('cakes-menu.jpeg') },
      { name: 'CUSTOM CUPCAKES (DOZEN)', price: '₹900', image: local('vanilla-cupcake-800.jpeg') },
      { name: 'COOKIE BOX (6 PACK)', price: '₹600', image: local('choc-chip-cookie-800.jpeg') },
      { name: 'BROWNIE BOX (6 PACK)', price: '₹700', image: local('brownies.jpeg') },
    ],
  },
  {
    key: 'cakes_product_grid', label: 'Cakes & Products', type: 'product_grid',
    data: [
      { name: 'Japanese cheesecake', price: '₹1,100', image: local('japanese-cheesecake.jpeg'), desc: 'The classic jiggly Japanese cheesecake, soft and airy' },
      { name: 'BESPOKE CAKE', price: '₹2,500', image: local('bespoke-cake.jpeg'), desc: 'Design your own — choose flavours, fillings, and decorations' },
      { name: 'VINTAGE CAKE — SINGLE COLOUR', price: '₹1,500', image: local('vintage-custom.jpeg'), desc: 'Classic vintage style in your choice of colour', variants: 'Ivory, Blue, Peach, Lilac, Green, Pink, Yellow' },
      { name: 'EDIBLE IMAGE PHOTO CAKE', price: '₹1,800', image: local('edible-photo-cake.jpeg'), desc: 'Personalised edible photo printed on your cake', variants: 'Pink, Ivory, Yellow, Blue, Green, Peach, Lilac' },
      { name: 'CLASSIC CHOCOLATE CAKE', price: '₹1,000', image: local('chocolate-cake.jpeg'), desc: 'Four rich layers with smooth chocolate buttercream' },
      { name: 'FUNFETTI SPRINKLE SHEET CAKE', price: '₹1,400', image: local('funfetti-sheet.jpeg'), desc: 'White frosting with colourful sprinkles — perfect for parties' },
      { name: 'RASPBERRY RIPPLE CAKE', price: '₹1,600', image: local('raspberry-ripple.jpeg'), desc: 'Vanilla sponge swirled with raspberry and creamy frosting' },
      { name: 'BIRTHDAY CAKE', price: '₹1,200', image: local('cakes-menu.jpeg'), desc: 'Classic birthday cake with confetti sponge and buttercream', variants: 'Pink Skirt, Turquoise Skirt, Yellow Skirt' },
      { name: 'CHOCOLATE BIRTHDAY CAKE', price: '₹1,300', image: local('funfetti-sheet.jpeg'), desc: 'Chocolate drip cake with piped icing and sprinkles' },
      { name: 'CLASSIC LEMON DRIZZLE CAKE', price: '₹1,100', image: local('lemon-drizzle.jpeg'), desc: 'Four layers with lemon meringue buttercream' },
      { name: 'CLASSIC RED VELVET CAKE', price: '₹1,200', image: local('red-velvet-cake.jpeg'), desc: 'Smooth cream cheese frosting on moist red velvet layers' },
      { name: 'CLASSIC CARROT CAKE', price: '₹1,100', image: local('carrot-cake.jpeg'), desc: 'Moist carrot cake with cream cheese icing and walnuts' },
    ],
  },
  {
    key: 'cupcakes_product_grid', label: 'Cupcakes & Products', type: 'product_grid',
    data: [
      { name: 'VANILLA CUPCAKES (DOZEN)', price: '₹600', image: local('vanilla-cupcake.jpeg'), desc: 'Classic vanilla sponge with silky vanilla buttercream' },
      { name: 'CHOCOLATE CUPCAKES (DOZEN)', price: '₹650', image: local('chocolate-cupcake.jpeg'), desc: 'Rich chocolate sponge with chocolate ganache frosting' },
      { name: 'RED VELVET CUPCAKE', price: '₹50', image: local('red-velvet-cupcake.jpeg'), desc: 'Red velvet with cream cheese frosting — per piece' },
      { name: 'CORPORATE LOGO CUPCAKES (DOZEN)', price: '₹900', image: local('edible-photo-cupcake.jpeg'), desc: 'Edible logo printed on each cupcake — perfect for events', badge: 'Corporate' },
      { name: 'EDIBLE PHOTO CUPCAKES (DOZEN)', price: '₹800', image: local('edible-photo-cupcake.jpeg'), desc: 'Personalised edible photo toppers on vanilla cupcakes' },
      { name: 'PRIDE CUPCAKES (DOZEN)', price: '₹750', image: 'https://images.pexels.com/photos/7358362/pexels-photo-7358362.jpeg?auto=compress&cs=tinysrgb&w=400&q=80&fit=crop', desc: 'Rainbow-frosted cupcakes celebrating Pride' },
      { name: 'GLUTEN FREE VANILLA CUPCAKES', price: '₹850', image: local('vanilla-cupcake-800.jpeg'), desc: 'Gluten-free vanilla sponge with buttercream', badge: 'GF' },
      { name: 'CUSTOM DESIGN CUPCAKES', price: '₹950', image: local('red-velvet-cupcake.jpeg'), desc: 'Fully custom design — send us your theme!' },
      { name: 'LEMON CURD CUPCAKE', price: '₹50', image: local('lemon-curd-cupcake.jpeg'), desc: 'Tangy lemon curd topped cupcake — per piece' },
    ],
  },
  {
    key: 'desserts_product_grid', label: 'Desserts & Products', type: 'product_grid',
    data: [
      { name: 'CHOC CHIP NY COOKIE', price: '₹120', image: local('choc-chip-cookie.jpeg'), desc: 'Classic New York-style loaded with dark chocolate chunks' },
      { name: 'RED VELVET NY COOKIE', price: '₹130', image: local('choc-chip-cookie.jpeg'), desc: 'Red velvet cookie with white chocolate chips' },
      { name: 'SALTED CARAMEL PECAN COOKIE', price: '₹150', image: local('choc-chip-cookie.jpeg'), desc: 'Salted caramel sauce, pecans, and dark chocolate' },
      { name: 'CLASSIC BROWNIE', price: '₹60', image: local('brownies.jpeg'), desc: 'Rich, fudgy Belgian chocolate brownie — per piece', badge: 'Best Seller' },
      { name: 'CARAMEL CORNFLAKE BROWNIE (BOX OF 6)', price: '₹700', image: local('brownies-2.jpeg'), desc: 'Crunchy cornflake topping with caramel drizzle' },
      { name: 'BROWNIE GIFT BOX', price: '₹1,000', image: local('brownies-2.jpeg'), desc: 'Assorted brownies in a beautiful gift box' },
      { name: 'BLUEBERRY CHEESECAKE', price: '₹1,900', image: local('blueberry-cheesecake.jpeg'), desc: 'Silky cheesecake topped with house-made blueberry compote' },
      { name: 'TIRAMISU', price: '₹80', image: local('tiramisu.jpeg'), desc: 'Classic Italian tiramisu — espresso-soaked ladyfingers with mascarpone cream — per piece' },
      { name: 'CHOCOLATE ÉCLAIR', price: '₹50', image: local('eclair.jpeg'), desc: 'Choux pastry filled with chocolate cream topped with ganache — per piece' },
      { name: 'FRENCH MACARONS (BOX OF 6)', price: '₹850', image: local('french-macarons.jpeg'), desc: 'Almond macarons — assorted flavours in a beautiful box', badge: 'Artisanal' },
      { name: 'BANANA BREAD (LOAF)', price: '₹500', image: local('banana-bread.jpeg'), desc: 'Moist, buttery banana bread. Perfect with your morning coffee.' },
      { name: 'LEMON BARS (BOX OF 4)', price: '₹450', image: local('lemon-drizzle.jpeg'), desc: 'Tangy lemon curd on a buttery shortbread base, dusted with sugar' },
      { name: 'CHOCOLATE CHIP MUFFINS (BOX OF 4)', price: '₹500', image: local('muffin.jpeg'), desc: 'Classic muffins loaded with dark chocolate chips' },
      { name: 'JAPANESE CHEESECAKE', price: '₹180', image: local('japanese-cheesecake-slice.jpeg'), desc: 'Light, fluffy Japanese-style cheesecake — per slice' },
      { name: 'NEW YORK CHEESECAKE', price: '₹150', image: local('ny-cheesecake-slice.jpeg'), desc: 'Classic creamy New York-style cheesecake — per slice' },
      { name: 'BURNT BASQUE CHEESECAKE', price: '₹180', image: local('burnt-basque-cheesecake.jpeg'), desc: 'Caramelised Basque-style cheesecake with creamy centre — per slice' },
      { name: 'CARAMEL CUSTARD', price: '₹80', image: local('brownies.jpeg'), desc: 'Silky caramel custard dessert — per piece' },
      { name: 'CHOCOLATE WITH WHIPPED CARAMEL', price: '₹200', image: local('chocolate-whipped-caramel.jpeg'), desc: 'Rich chocolate dessert topped with whipped caramel — per piece' },
      { name: 'QUICHE', price: '₹50', image: local('quiche.jpeg'), desc: 'Savory egg and cheese quiche with buttery crust — per piece', badge: 'Savory' },
      { name: 'CINNAMON ROLLS', price: '₹50', image: local('cinnamon-rolls.jpeg'), desc: 'Soft cinnamon rolls with cream cheese glaze — per piece' },
      { name: 'BERLINERS', price: '₹50', image: local('edible-photo-cupcake.jpeg'), desc: 'Jam-filled German-style Berliner doughnuts — per piece' },
      { name: 'LEMON & BLUEBERRY MUFFINS', price: '₹60', image: local('lemon-blueberry-muffin.jpeg'), desc: 'Light, fluffy muffins bursting with lemon and blueberries — per piece' },
      { name: 'BANANA & CHOCOLATE MUFFIN', price: '₹60', image: local('banana-choc-muffin.jpeg'), desc: 'Moist banana muffin with dark chocolate chunks — per piece' },
      { name: 'CREAM PUFFS', price: '₹40', image: local('cream-puffs.jpeg'), desc: 'Light choux pastry filled with silky cream — per piece' },
      { name: 'BLUEBERRY SCONES', price: '₹50', image: local('blueberry-cheesecake.jpeg'), desc: 'Buttery scones bursting with fresh blueberries — per piece' },
      { name: 'HUMMINGBIRD CAKE SLICES', price: '₹50', image: local('hummingbird-slice.jpeg'), desc: 'Pineapple, banana, and pecan cake with cream cheese frosting — per slice' },
      { name: 'MARBLE CAKE', price: '₹50', image: local('chocolate-cake.jpeg'), desc: 'Classic vanilla and chocolate swirled marble cake — per slice' },
      { name: 'BANANA PUDDING BRIOCHE', price: '₹120', image: local('fresh-bakes-1.jpeg'), desc: 'Soft brioche filled with banana pudding — per piece' },
      { name: 'CHICKEN PIZZA', price: '₹80', image: local('chicken-pizza.jpeg'), desc: 'House-made chicken pizza on a fresh baked base — per piece', badge: 'Savory' },
      { name: 'CHICKEN POT PIES', price: '₹50', image: local('chicken-pot-pies.jpeg'), desc: 'Flaky pie crust filled with creamy chicken — per piece', badge: 'Savory' },
      { name: 'CARROT CAKE SLICE', price: '₹50', image: local('carrot-cake-slice.jpeg'), desc: 'Moist carrot cake with cream cheese icing — per slice' },
    ],
  },
]

const isForceMode = process.argv.includes('--force')

// Seed each section
for (const section of sections) {
  try {
    if (isForceMode) {
      await rpc('admin_upsert_page_section', {
        p_key: section.key,
        p_label: section.label,
        p_type: section.type,
        p_data: section.data,
      })
      console.log(`✅ ${section.key}`)
    } else {
      await rpc('admin_ensure_page_section', {
        p_key: section.key,
        p_label: section.label,
        p_type: section.type,
      })
      console.log(`✅ ${section.key}`)
    }
  } catch (err) {
    console.error(`❌ ${section.key}: ${err.message}`)
  }
}

console.log(`\nDone! ${sections.length} sections seeded${isForceMode ? ' (--force mode — data overwritten)' : ' (safe mode — data untouched)'}.`)
