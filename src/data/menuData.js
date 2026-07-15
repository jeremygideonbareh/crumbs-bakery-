// Structured menu data for the interactive menu page
// This replaces the old menu board image gallery

export const MENU_HEADER = {
  bakery: "Lily's Ccake",
  address: 'Jaiaw Laitdom',
  phone: '9612772089',
  social: '@lilysccake',
  tagline: 'Freshly baked from the finest ingredients',
}

export const MENU_CATEGORIES = [
  {
    id: 'cakes',
    name: 'Cakes',
    subtitle: 'Price Per 500g',
    emoji: '🎂',
    color: 'from-pink-100 to-rose-100',
    accent: 'rose',
    items: [
      {
        name: 'Chocolate truffle',
        price: '₹ 950/-',
        desc: 'Moist chocolate sponge filled with dark chocolate ganache',
        highlight: 'Best Seller',
      },
      {
        name: 'Marble cake',
        price: '₹ 1000/-',
        desc: 'A fluffy and moist chocolate and vanilla marbled cake with a chocolate buttercream filling',
      },
      {
        name: 'Classic Red Velvet',
        price: '₹ 1000/-',
        desc: 'Moist red velvet sponge layers filled with a decadent creamcheese frosting',
        highlight: 'Popular',
      },
      {
        name: 'Salted caramel cake',
        price: '₹ 1000/-',
        desc: 'A fluffy salted caramel sponge filled with Swiss meringue buttercream and a thick delicious salted caramel',
      },
      {
        name: 'Peanut butter and Banana',
        price: '₹ 1100/-',
        desc: 'A peanut butter sponge filled with a banana caramel filling and frosted with Swiss meringue buttercream',
      },
      {
        name: 'Snickers cake',
        price: '₹ 1100/-',
        desc: 'Chocolate sponge filled with peanut butter Swiss meringue buttercream, chocolate ganache and salted caramel',
      },
      {
        name: 'Tiramisu',
        price: '₹ 1100/-',
        desc: 'Vanilla cake layers soaked in espresso and filled with mascarpone cream filling',
        highlight: 'Signature',
      },
      {
        name: "Matilda's classic chocolate cake",
        price: '₹ 1000/-',
        desc: 'A dark chocolate layered sponge cake filled and covered with chocolate fudge frosting',
      },
      {
        name: 'Coffee and salted caramel',
        price: '₹ 1000/-',
        desc: 'Coffee flavoured sponge soaked in espresso and filled with salted caramel Swiss meringue buttercream and salted caramel',
      },
      {
        name: 'Vanilla and chocolate',
        price: '₹ 900/-',
        desc: 'Vanilla pound cake filled with chocolate fudge frosting',
      },
    ],
  },
  {
    id: 'cheesecakes',
    name: 'Cheesecakes',
    subtitle: 'Price Per 500g',
    emoji: '🧀',
    color: 'from-amber-100 to-yellow-100',
    accent: 'amber',
    items: [
      {
        name: 'A New York Cheesecake',
        price: '₹ 1000/-',
        desc: 'A classic baked cheesecake',
        highlight: 'Classic',
      },
      {
        name: 'Fruit variation of NY cheesecake',
        price: '₹ 1100/-',
        desc: 'Your choice of fruit topping: Strawberry, Blueberry, Mango, Cherry',
      },
      {
        name: 'Burnt Basque Cheesecake',
        price: '₹ 1100/-',
        desc: 'A spanish version of the baked cheesecake with a caramelized top and creamy center',
      },
      {
        name: 'Lemon curd Cheesecake',
        price: '₹ 1200/-',
        desc: 'A baked cheesecake topped with some tangy lemon curd',
      },
      {
        name: 'Japanese cheesecake',
        price: '₹ 1100/-',
        desc: 'The classic jiggly Japanese cheesecake, so soft and airy it melts in your mouth',
        highlight: 'Must Try',
      },
    ],
  },
  {
    id: 'fruit-cakes',
    name: 'Fruit Cakes',
    subtitle: 'Price Per 500g',
    emoji: '🍓',
    color: 'from-purple-100 to-pink-100',
    accent: 'purple',
    items: [
      {
        name: 'Apple spiced cake',
        price: '₹ 1000/-',
        desc: 'Moist apple sponge filled with brown butter buttercream',
      },
      {
        name: 'Lemon cake',
        price: '₹ 1000/-',
        desc: 'A soft and fragrant lemon sponge filled with lemon curd and frosted in Swiss meringue buttercream',
      },
      {
        name: 'Pina Colada cake',
        price: '₹ 1100/-',
        desc: 'Moist coconut sponge filled with pineapple filling with a touch of rum (available in alcoholic / non alcoholic version)',
      },
      {
        name: 'Lemon and blueberry',
        price: '₹ 1100/-',
        desc: 'A light and moist lemon sponge with blueberries filled with creamcheese frosting',
      },
      {
        name: 'Strawberry and cream',
        price: '₹ 1000/-',
        desc: 'A fluffy strawberry sponge cake filled with cream and strawberry compote',
        highlight: 'Favorite',
      },
      {
        name: 'Peaches and cream',
        price: '₹ 1000/-',
        desc: 'A moist peach sponge filled with peach compote and cream',
      },
      {
        name: 'Lime and coconut cake with mango',
        price: '₹ 1100/-',
        desc: 'A lime and coconut sponge filled with a mango curd and frosted with Swiss meringue buttercream',
      },
      {
        name: 'Sohiong and white chocolate',
        price: '₹ 1000/-',
        desc: 'A moist sponge swirled with sohiong compote filled with white chocolate swiss meringue buttercream',
      },
      {
        name: 'Raspberry and white chocolate',
        price: '₹ 1100/-',
        desc: 'Chocolate and orange sponge filled with orange infused chocolate ganache',
      },
      {
        name: 'Black Forest',
        price: '₹ 900/-',
        desc: 'Chocolate sponge soaked in cherry kirsh filled with cream and cherries',
        highlight: 'Classic',
      },
    ],
  },
]
