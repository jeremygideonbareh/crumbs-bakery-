export const MENU_HEADER = {
  bakery: "Lily's Ccake",
  address: 'Jaiaw Laitdom',
  phone: '9612772089',
  social: '@lilysccake',
  tagline: 'Handcrafted celebration cakes & bakes',
}

export const MENU_CATEGORIES = [
  {
    id: 'all-cakes',
    name: 'All Cakes',
    subtitle: 'Handcrafted celebration cakes',
    emoji: '🎂',
    accent: 'rose',
    subcategories: [
      'Birthday Cakes',
      'Celebration Cakes',
      'Sheet Cakes',
      'Bespoke Cakes',
      'Classic Cakes',
      'Vintage Cakes',
      'Kids Cakes',
      'Corporate Cakes',
    ],
    items: [
      {
        name: 'Vintage Heart Cake',
        price: '₹1,200',
        desc: 'Layered sponge with pink piped Swiss Meringue buttercream',
        subcategory: 'Vintage Cakes',
        options: ['Ivory', 'Pink', 'Lilac', 'Green', 'Peach', 'Yellow'],
      },
      {
        name: 'Bespoke Cake',
        price: '₹2,500',
        desc: 'Design your own — get in touch to create your perfect cake',
        subcategory: 'Bespoke Cakes',
      },
      {
        name: 'Vintage Cake — Single Colour',
        price: '₹1,500',
        desc: 'Classic vintage style in your choice of colour',
        subcategory: 'Vintage Cakes',
        options: ['Ivory', 'Blue', 'Peach', 'Lilac', 'Green', 'Pink'],
      },
      {
        name: 'Classic Chocolate Cake',
        price: '₹1,000',
        desc: 'Four rich layers with smooth chocolate buttercream',
        subcategory: 'Classic Cakes',
      },
      {
        name: 'Classic Lemon Drizzle Cake',
        price: '₹1,100',
        desc: 'Four layers with lemon meringue buttercream',
        subcategory: 'Classic Cakes',
      },
      {
        name: 'Classic Red Velvet Cake',
        price: '₹1,200',
        desc: 'Smooth cream cheese frosting on moist red velvet layers',
        subcategory: 'Classic Cakes',
      },
      {
        name: 'Classic Carrot Cake',
        price: '₹1,100',
        desc: 'Moist carrot cake with cream cheese icing and walnuts',
        subcategory: 'Classic Cakes',
      },
    ],
  },
  {
    id: 'bakes',
    name: 'Bakes & Bites',
    subtitle: 'Freshly baked treats & savouries',
    emoji: '🥐',
    accent: 'amber',
    items: [
      {
        name: 'Japanese cheesecake',
        price: '₹1,100',
        desc: 'The classic jiggly Japanese cheesecake, soft and airy',
        image: '/images/Japanese cheesecake.jpeg',
      },
      {
        name: 'Lemon and blueberry muffins',
        price: '₹450',
        desc: 'Freshly baked muffins bursting with lemon and blueberries',
        image: '/images/Lemon and blueberry muffins.jpeg',
      },
      {
        name: 'Banana pudding brioche',
        price: '₹350',
        desc: 'Soft brioche filled with creamy banana pudding',
        image: '/images/Banana pudding brioche.jpeg',
      },
      {
        name: 'Cream puffs',
        price: '₹300',
        desc: 'Light choux pastry filled with smooth vanilla cream',
        image: '/images/Cream puffs.jpeg',
      },
      {
        name: 'Quiche',
        price: '₹400',
        desc: 'Savory egg custard baked in a buttery, flaky crust',
        image: '/images/Quiche.jpeg',
      },
    ],
  },
]

export const DELIVERY_INFO = {
  title: 'Cake Delivery in Shillong',
  methods: [
    {
      name: 'Hand Delivery',
      desc: 'Safe, contact-free delivery anywhere in Shillong. Order by 2PM for same-day.',
    },
    {
      name: 'Collection',
      desc: 'Pick up from our Jaiaw cafe — open Mon–Sat 9AM–8PM, Sun 10AM–6PM.',
    },
  ],
}
