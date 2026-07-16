const PEXELS = (id, w = 400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&q=80&fit=crop`

const LOCAL = (name) => `${import.meta.env.BASE_URL}images/${encodeURIComponent(name)}`

export const cakes = [
  { id: 'c1', name: 'Japanese cheesecake', price: '₹1,100', image: LOCAL('Japanese cheesecake.jpeg'), desc: 'The classic jiggly Japanese cheesecake, soft and airy' },
  { id: 'c2', name: 'BESPOKE CAKE', price: '₹2,500', image: PEXELS(2144200), desc: 'Design your own — choose flavours, fillings, and decorations' },
  { id: 'c3', name: 'VINTAGE CAKE — SINGLE COLOUR', price: '₹1,500', image: PEXELS(1793037), desc: 'Classic vintage style in your choice of colour', variants: ['Ivory', 'Blue', 'Peach', 'Lilac', 'Green', 'Pink', 'Yellow'] },
  { id: 'c4', name: 'EDIBLE IMAGE PHOTO CAKE', price: '₹1,800', image: PEXELS(37110821), desc: 'Personalised edible photo printed on your cake', variants: ['Pink', 'Ivory', 'Yellow', 'Blue', 'Green', 'Peach', 'Lilac'] },
  { id: 'c5', name: 'CLASSIC CHOCOLATE CAKE', price: '₹1,000', image: PEXELS(132694), desc: 'Four rich layers with smooth chocolate buttercream' },
  { id: 'c6', name: 'FUNFETTI SPRINKLE SHEET CAKE', price: '₹1,400', image: PEXELS(34155188), desc: 'White frosting with colourful sprinkles — perfect for parties' },
  { id: 'c7', name: 'RASPBERRY RIPPLE CAKE', price: '₹1,600', image: PEXELS(29230134), desc: 'Vanilla sponge swirled with raspberry and creamy frosting' },
  { id: 'c8', name: 'BIRTHDAY CAKE', price: '₹1,200', image: PEXELS(7328340), desc: 'Classic birthday cake with confetti sponge and buttercream', variants: ['Pink Skirt', 'Turquoise Skirt', 'Yellow Skirt'] },
  { id: 'c9', name: 'CHOCOLATE BIRTHDAY CAKE', price: '₹1,300', image: PEXELS(34155188), desc: 'Chocolate drip cake with piped icing and sprinkles' },
  { id: 'c10', name: 'CLASSIC LEMON DRIZZLE CAKE', price: '₹1,100', image: PEXELS(9820), desc: 'Four layers with lemon meringue buttercream' },
  { id: 'c11', name: 'CLASSIC RED VELVET CAKE', price: '₹1,200', image: PEXELS(14969996), desc: 'Smooth cream cheese frosting on moist red velvet layers' },
  { id: 'c12', name: 'CLASSIC CARROT CAKE', price: '₹1,100', image: PEXELS(37110821), desc: 'Moist carrot cake with cream cheese icing and walnuts' },
]

export const cupcakes = [
  { id: 'cp1', name: 'VANILLA CUPCAKES (DOZEN)', price: '₹600', image: PEXELS(14105), desc: 'Classic vanilla sponge with silky vanilla buttercream' },
  { id: 'cp2', name: 'CHOCOLATE CUPCAKES (DOZEN)', price: '₹650', image: PEXELS(32421567), desc: 'Rich chocolate sponge with chocolate ganache frosting' },
  { id: 'cp3', name: 'RED VELVET CUPCAKE', price: '₹50', image: PEXELS(1055271), desc: 'Red velvet with cream cheese frosting — per piece' },
  { id: 'cp4', name: 'CORPORATE LOGO CUPCAKES (DOZEN)', price: '₹900', image: PEXELS(35224342), desc: 'Edible logo printed on each cupcake — perfect for events', badge: 'Corporate' },
  { id: 'cp5', name: 'EDIBLE PHOTO CUPCAKES (DOZEN)', price: '₹800', image: PEXELS(20677473), desc: 'Personalised edible photo toppers on vanilla cupcakes' },
  { id: 'cp6', name: 'PRIDE CUPCAKES (DOZEN)', price: '₹750', image: PEXELS(7358362), desc: 'Rainbow-frosted cupcakes celebrating Pride' },
  { id: 'cp7', name: 'GLUTEN FREE VANILLA CUPCAKES', price: '₹850', image: PEXELS(7358386), desc: 'Gluten-free vanilla sponge with buttercream', badge: 'GF' },
  { id: 'cp8', name: 'CUSTOM DESIGN CUPCAKES', price: '₹950', image: PEXELS(1055271), desc: 'Fully custom design — send us your theme!' },
  { id: 'cp9', name: 'LEMON CURD CUPCAKE', price: '₹50', image: PEXELS(14105), desc: 'Tangy lemon curd topped cupcake — per piece' },
]

export const cookies = [
  { id: 'co1', name: 'CHOC CHIP NY COOKIE', price: '₹120', image: PEXELS(37353913), desc: 'Classic New York-style loaded with dark chocolate chunks' },
  { id: 'co2', name: 'RED VELVET NY COOKIE', price: '₹130', image: PEXELS(34979324), desc: 'Red velvet cookie with white chocolate chips' },
  { id: 'co3', name: 'SALTED CARAMEL PECAN COOKIE', price: '₹150', image: PEXELS(20558713), desc: 'Salted caramel sauce, pecans, and dark chocolate' },
]

export const brownies = [
  { id: 'b1', name: 'CLASSIC BROWNIE', price: '₹60', image: PEXELS(2067396), desc: 'Rich, fudgy Belgian chocolate brownie — per piece', badge: 'Best Seller' },
  { id: 'b2', name: 'CARAMEL CORNFLAKE BROWNIE (BOX OF 6)', price: '₹700', image: PEXELS(2067396), desc: 'Crunchy cornflake topping with caramel drizzle' },
  { id: 'b3', name: 'BROWNIE GIFT BOX', price: '₹1,000', image: PEXELS(2067396), desc: 'Assorted brownies in a beautiful gift box' },
]

const extraDesserts = [
  { id: 'd2', name: 'BLUEBERRY CHEESECAKE', price: '₹1,900', image: PEXELS(38058461), desc: 'Silky cheesecake topped with house-made blueberry compote' },
  { id: 'd3', name: 'TIRAMISU', price: '₹80', image: PEXELS(14766327), desc: 'Classic Italian tiramisu — espresso-soaked ladyfingers with mascarpone cream — per piece' },
  { id: 'd5', name: 'CHOCOLATE ÉCLAIR', price: '₹50', image: PEXELS(16402099), desc: 'Choux pastry filled with chocolate cream topped with ganache — per piece' },
  { id: 'd6', name: 'FRENCH MACARONS (BOX OF 6)', price: '₹850', image: PEXELS(32706248), desc: 'Almond macarons — assorted flavours in a beautiful box', badge: 'Artisanal' },
  { id: 'd7', name: 'BANANA BREAD (LOAF)', price: '₹500', image: PEXELS(4242130), desc: 'Moist, buttery banana bread. Perfect with your morning coffee.' },
  { id: 'd8', name: 'LEMON BARS (BOX OF 4)', price: '₹450', image: PEXELS(9820), desc: 'Tangy lemon curd on a buttery shortbread base, dusted with sugar' },
  { id: 'd10', name: 'CHOCOLATE CHIP MUFFINS (BOX OF 4)', price: '₹500', image: PEXELS(32916204), desc: 'Classic muffins loaded with dark chocolate chips' },
  { id: 'd11', name: 'JAPANESE CHEESECAKE', price: '₹180', image: LOCAL('Japanese cheesecake.jpeg'), desc: 'Light, fluffy Japanese-style cheesecake — per slice' },
  { id: 'd12', name: 'NEW YORK CHEESECAKE', price: '₹150', image: PEXELS(38058461), desc: 'Classic creamy New York-style cheesecake — per slice' },
  { id: 'd13', name: 'BURNT BASQUE CHEESECAKE', price: '₹180', image: PEXELS(38058461), desc: 'Caramelised Basque-style cheesecake with creamy centre — per slice' },
  { id: 'd14', name: 'CARAMEL CUSTARD', price: '₹80', image: PEXELS(2067396), desc: 'Silky caramel custard dessert — per piece' },
  { id: 'd15', name: 'CHOCOLATE WITH WHIPPED CARAMEL', price: '₹180', image: PEXELS(132694), desc: 'Rich chocolate dessert topped with whipped caramel — per piece' },
  { id: 'd16', name: 'QUICHE', price: '₹50', image: LOCAL('Quiche.jpeg'), desc: 'Savory egg and cheese quiche with buttery crust — per piece', badge: 'Savory' },
  { id: 'd17', name: 'CINNAMON ROLLS', price: '₹50', image: PEXELS(140831), desc: 'Soft cinnamon rolls with cream cheese glaze — per piece' },
  { id: 'd18', name: 'BERLINERS', price: '₹50', image: PEXELS(20677473), desc: 'Jam-filled German-style Berliner doughnuts — per piece' },
  { id: 'd20', name: 'LEMON & BLUEBERRY MUFFINS', price: '₹60', image: LOCAL('Lemon and blueberry muffins.jpeg'), desc: 'Light, fluffy muffins bursting with lemon and blueberries — per piece' },
  { id: 'd21', name: 'BANANA & CHOCOLATE MUFFIN', price: '₹60', image: PEXELS(4242130), desc: 'Moist banana muffin with dark chocolate chunks — per piece' },
  { id: 'd22', name: 'CREAM PUFFS', price: '₹40', image: LOCAL('Cream puffs.jpeg'), desc: 'Light choux pastry filled with silky cream — per piece' },
  { id: 'd23', name: 'BLUEBERRY SCONES', price: '₹50', image: PEXELS(38058461), desc: 'Buttery scones bursting with fresh blueberries — per piece' },
  { id: 'd24', name: 'HUMMINGBIRD CAKE SLICES', price: '₹50', image: PEXELS(29230134), desc: 'Pineapple, banana, and pecan cake with cream cheese frosting — per slice' },
  { id: 'd25', name: 'MARBLE CAKE', price: '₹50', image: PEXELS(132694), desc: 'Classic vanilla and chocolate swirled marble cake — per slice' },
  { id: 'd26', name: 'BANANA PUDDING BRIOCHE', price: '₹120', image: LOCAL('Banana pudding brioche.jpeg'), desc: 'Soft brioche filled with banana pudding — per piece' },
]

export const desserts = [...cookies, ...brownies, ...extraDesserts]
