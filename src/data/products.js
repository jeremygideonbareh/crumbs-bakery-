const base = 'https://images.unsplash.com'

const w = (id) => `${base}/photo-${id}?w=400&q=80`

export const cakes = [
  { id: 'c1', name: 'VINTAGE HEART CAKE', price: '₹1,200', image: w('1558636508-e0db3814bd1d'), desc: 'Layered sponge with pink piped Swiss Meringue buttercream', variants: ['Ivory', 'Pink', 'Lilac', 'Green', 'Peach', 'Yellow', 'Blue'] },
  { id: 'c2', name: 'BESPOKE CAKE', price: '₹2,500', image: w('1558301211-0d8c8ddee6ec'), desc: 'Design your own — choose flavours, fillings, and decorations' },
  { id: 'c3', name: 'VINTAGE CAKE — SINGLE COLOUR', price: '₹1,500', image: w('1578985545062-69928b1d9587'), desc: 'Classic vintage style in your choice of colour', variants: ['Ivory', 'Blue', 'Peach', 'Lilac', 'Green', 'Pink', 'Yellow'] },
  { id: 'c4', name: 'EDIBLE IMAGE PHOTO CAKE', price: '₹1,800', image: w('1528975604071-b4dc52a2d18c'), desc: 'Personalised edible photo printed on your cake', variants: ['Pink', 'Ivory', 'Yellow', 'Blue', 'Green', 'Peach', 'Lilac'] },
  { id: 'c5', name: 'CLASSIC CHOCOLATE CAKE', price: '₹1,000', image: w('1606890737304-57a1ca8a5b62'), desc: 'Four rich layers with smooth chocolate buttercream' },
  { id: 'c6', name: 'FUNFETTI SPRINKLE SHEET CAKE', price: '₹1,400', image: w('1464349095431-e9a21285b5f3'), desc: 'White frosting with colourful sprinkles — perfect for parties' },
  { id: 'c7', name: 'RASPBERRY RIPPLE CAKE', price: '₹1,600', image: w('1565958011703-44f9829ba187'), desc: 'Vanilla sponge swirled with raspberry and creamy frosting' },
  { id: 'c8', name: 'BIRTHDAY CAKE', price: '₹1,200', image: w('1558301211-0d8c8ddee6ec'), desc: 'Classic birthday cake with confetti sponge and buttercream', variants: ['Pink Skirt', 'Turquoise Skirt', 'Yellow Skirt'] },
  { id: 'c9', name: 'CHOCOLATE BIRTHDAY CAKE', price: '₹1,300', image: w('1606890737304-57a1ca8a5b62'), desc: 'Chocolate drip cake with piped icing and sprinkles' },
  { id: 'c10', name: 'CLASSIC LEMON DRIZZLE CAKE', price: '₹1,100', image: w('1464349095431-e9a21285b5f3'), desc: 'Four layers with lemon meringue buttercream' },
  { id: 'c11', name: 'CLASSIC RED VELVET CAKE', price: '₹1,200', image: w('1565958011703-44f9829ba187'), desc: 'Smooth cream cheese frosting on moist red velvet layers' },
  { id: 'c12', name: 'CLASSIC CARROT CAKE', price: '₹1,100', image: w('1558636508-e0db3814bd1d'), desc: 'Moist carrot cake with cream cheese icing and walnuts' },
]

export const cupcakes = [
  { id: 'cp1', name: 'VANILLA CUPCAKES (DOZEN)', price: '₹600', image: w('1614707267537-b85aaf00c4b7'), desc: 'Classic vanilla sponge with silky vanilla buttercream' },
  { id: 'cp2', name: 'CHOCOLATE CUPCAKES (DOZEN)', price: '₹650', image: w('1606890737304-57a1ca8a5b62'), desc: 'Rich chocolate sponge with chocolate ganache frosting' },
  { id: 'cp3', name: 'RED VELVET CUPCAKES (DOZEN)', price: '₹700', image: w('1565958011703-44f9829ba187'), desc: 'Red velvet with cream cheese frosting' },
  { id: 'cp4', name: 'CORPORATE LOGO CUPCAKES (DOZEN)', price: '₹900', image: w('1528975604071-b4dc52a2d18c'), desc: 'Edible logo printed on each cupcake — perfect for events', badge: 'Corporate' },
  { id: 'cp5', name: 'EDIBLE PHOTO CUPCAKES (DOZEN)', price: '₹800', image: w('1558301211-0d8c8ddee6ec'), desc: 'Personalised edible photo toppers on vanilla cupcakes' },
  { id: 'cp6', name: 'PRIDE CUPCAKES (DOZEN)', price: '₹750', image: w('1464349095431-e9a21285b5f3'), desc: 'Rainbow-frosted cupcakes celebrating Pride' },
  { id: 'cp7', name: 'GLUTEN FREE VANILLA CUPCAKES', price: '₹850', image: w('1614707267537-b85aaf00c4b7'), desc: 'Gluten-free vanilla sponge with buttercream', badge: 'GF' },
  { id: 'cp8', name: 'CUSTOM DESIGN CUPCAKES', price: '₹950', image: w('1571877227200-a0d98ea607e9'), desc: 'Fully custom design — send us your theme!' },
]

export const cookies = [
  { id: 'co1', name: 'CHOC CHIP NY COOKIE', price: '₹120', image: w('1499636136210-6f4ee915583e'), desc: 'Classic New York-style loaded with dark chocolate chunks' },
  { id: 'co2', name: 'RED VELVET NY COOKIE', price: '₹130', image: w('1499636136210-6f4ee915583e'), desc: 'Red velvet cookie with white chocolate chips' },
  { id: 'co3', name: 'SALTED CARAMEL PECAN COOKIE', price: '₹150', image: w('1499636136210-6f4ee915583e'), desc: 'Salted caramel sauce, pecans, and dark chocolate' },
]

export const brownies = [
  { id: 'b1', name: 'CLASSIC BROWNIE (BOX OF 6)', price: '₹600', image: w('1606313564200-e75d5e30476c'), desc: 'Rich, fudgy Belgian chocolate brownies', badge: 'Best Seller' },
  { id: 'b2', name: 'CARAMEL CORNFLAKE BROWNIE (BOX OF 6)', price: '₹700', image: w('1606313564200-e75d5e30476c'), desc: 'Crunchy cornflake topping with caramel drizzle' },
  { id: 'b3', name: 'BROWNIE GIFT BOX', price: '₹1,000', image: w('1606313564200-e75d5e30476c'), desc: 'Assorted brownies in a beautiful gift box' },
]

const extraDesserts = [
  { id: 'd2', name: 'BLUEBERRY CHEESECAKE', price: '₹1,900', image: w('1533134242443-d4fd215305ad'), desc: 'Silky cheesecake topped with house-made blueberry compote' },
  { id: 'd3', name: 'TIRAMISU', price: '₹1,500', image: w('1571877227200-a0d98ea607e9'), desc: 'Classic Italian tiramisu — espresso-soaked ladyfingers with mascarpone cream' },
  { id: 'd5', name: 'CHOCOLATE ÉCLAIRS (BOX OF 4)', price: '₹700', image: w('1606890737304-57a1ca8a5b62'), desc: 'Choux pastry filled with chocolate cream topped with ganache' },
  { id: 'd6', name: 'FRENCH MACARONS (BOX OF 6)', price: '₹850', image: w('1464349095431-e9a21285b5f3'), desc: 'Almond macarons — assorted flavours in a beautiful box', badge: 'Artisanal' },
  { id: 'd7', name: 'BANANA BREAD (LOAF)', price: '₹500', image: w('1578985545062-69928b1d9587'), desc: 'Moist, buttery banana bread. Perfect with your morning coffee.' },
  { id: 'd8', name: 'LEMON BARS (BOX OF 4)', price: '₹450', image: w('1558636508-e0db3814bd1d'), desc: 'Tangy lemon curd on a buttery shortbread base, dusted with sugar' },
  { id: 'd9', name: 'BLUEBERRY MUFFINS (BOX OF 4)', price: '₹500', image: w('1614707267537-b85aaf00c4b7'), desc: 'Light, fluffy muffins bursting with fresh blueberries' },
  { id: 'd10', name: 'CHOCOLATE CHIP MUFFINS (BOX OF 4)', price: '₹500', image: w('1614707267537-b85aaf00c4b7'), desc: 'Classic muffins loaded with dark chocolate chips' },
]

export const desserts = [...cookies, ...brownies, ...extraDesserts]
