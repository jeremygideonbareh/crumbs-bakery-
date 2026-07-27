-- Seed the products table with defaults from hardcoded data.
-- Only inserts if the table is empty so admin-entered data is never overwritten.
BEGIN;

DO $$
BEGIN
  IF (SELECT count(*) FROM products) = 0 THEN
    INSERT INTO products (name, slug, price, image, description, variants, badge, category_slug, active, sort_order) VALUES
      -- Cakes (12 items)
      ('Japanese cheesecake', 'japanese-cheesecake', '₹1,100', '/images/japanese-cheesecake.jpeg', 'The classic jiggly Japanese cheesecake, soft and airy', '[]'::jsonb, '', 'cakes', true, 1),
      ('BESPOKE CAKE', 'bespoke-cake', '₹2,500', '/images/bespoke-cake.jpeg', 'Design your own — choose flavours, fillings, and decorations', '[]'::jsonb, '', 'cakes', true, 2),
      ('VINTAGE CAKE — SINGLE COLOUR', 'vintage-cake-single-colour', '₹1,500', '/images/vintage-custom.jpeg', 'Classic vintage style in your choice of colour', '["Ivory","Blue","Peach","Lilac","Green","Pink","Yellow"]'::jsonb, '', 'cakes', true, 3),
      ('EDIBLE IMAGE PHOTO CAKE', 'edible-image-photo-cake', '₹1,800', '/images/edible-photo-cake.jpeg', 'Personalised edible photo printed on your cake', '["Pink","Ivory","Yellow","Blue","Green","Peach","Lilac"]'::jsonb, '', 'cakes', true, 4),
      ('CLASSIC CHOCOLATE CAKE', 'classic-chocolate-cake', '₹1,000', '/images/chocolate-cake.jpeg', 'Four rich layers with smooth chocolate buttercream', '[]'::jsonb, '', 'cakes', true, 5),
      ('FUNFETTI SPRINKLE SHEET CAKE', 'funfetti-sprinkle-sheet-cake', '₹1,400', '/images/funfetti-sheet.jpeg', 'White frosting with colourful sprinkles — perfect for parties', '[]'::jsonb, '', 'cakes', true, 6),
      ('RASPBERRY RIPPLE CAKE', 'raspberry-ripple-cake', '₹1,600', '/images/raspberry-ripple.jpeg', 'Vanilla sponge swirled with raspberry and creamy frosting', '[]'::jsonb, '', 'cakes', true, 7),
      ('BIRTHDAY CAKE', 'birthday-cake', '₹1,200', '/images/cakes-menu.jpeg', 'Classic birthday cake with confetti sponge and buttercream', '["Pink Skirt","Turquoise Skirt","Yellow Skirt"]'::jsonb, '', 'cakes', true, 8),
      ('CHOCOLATE BIRTHDAY CAKE', 'chocolate-birthday-cake', '₹1,300', '/images/funfetti-sheet.jpeg', 'Chocolate drip cake with piped icing and sprinkles', '[]'::jsonb, '', 'cakes', true, 9),
      ('CLASSIC LEMON DRIZZLE CAKE', 'classic-lemon-drizzle-cake', '₹1,100', '/images/lemon-drizzle.jpeg', 'Four layers with lemon meringue buttercream', '[]'::jsonb, '', 'cakes', true, 10),
      ('CLASSIC RED VELVET CAKE', 'classic-red-velvet-cake', '₹1,200', '/images/red-velvet-cake.jpeg', 'Smooth cream cheese frosting on moist red velvet layers', '[]'::jsonb, '', 'cakes', true, 11),
      ('CLASSIC CARROT CAKE', 'classic-carrot-cake', '₹1,100', '/images/carrot-cake.jpeg', 'Moist carrot cake with cream cheese icing and walnuts', '[]'::jsonb, '', 'cakes', true, 12),
      -- Cupcakes (9 items)
      ('VANILLA CUPCAKES (DOZEN)', 'vanilla-cupcakes-dozen', '₹600', '/images/vanilla-cupcake.jpeg', 'Classic vanilla sponge with silky vanilla buttercream', '[]'::jsonb, '', 'cupcakes', true, 1),
      ('CHOCOLATE CUPCAKES (DOZEN)', 'chocolate-cupcakes-dozen', '₹650', '/images/chocolate-cupcake.jpeg', 'Rich chocolate sponge with chocolate ganache frosting', '[]'::jsonb, '', 'cupcakes', true, 2),
      ('RED VELVET CUPCAKE', 'red-velvet-cupcake', '₹50', '/images/red-velvet-cupcake.jpeg', 'Red velvet with cream cheese frosting — per piece', '[]'::jsonb, '', 'cupcakes', true, 3),
      ('CORPORATE LOGO CUPCAKES (DOZEN)', 'corporate-logo-cupcakes-dozen', '₹900', '/images/edible-photo-cupcake.jpeg', 'Edible logo printed on each cupcake — perfect for events', '[]'::jsonb, 'Corporate', 'cupcakes', true, 4),
      ('EDIBLE PHOTO CUPCAKES (DOZEN)', 'edible-photo-cupcakes-dozen', '₹800', '/images/edible-photo-cupcake.jpeg', 'Personalised edible photo toppers on vanilla cupcakes', '[]'::jsonb, '', 'cupcakes', true, 5),
      ('PRIDE CUPCAKES (DOZEN)', 'pride-cupcakes-dozen', '₹750', 'https://images.pexels.com/photos/7358362/pexels-photo-7358362.jpeg', 'Rainbow-frosted cupcakes celebrating Pride', '[]'::jsonb, '', 'cupcakes', true, 6),
      ('GLUTEN FREE VANILLA CUPCAKES', 'gluten-free-vanilla-cupcakes', '₹850', '/images/vanilla-cupcake-800.jpeg', 'Gluten-free vanilla sponge with buttercream', '[]'::jsonb, 'GF', 'cupcakes', true, 7),
      ('CUSTOM DESIGN CUPCAKES', 'custom-design-cupcakes', '₹950', '/images/red-velvet-cupcake.jpeg', 'Fully custom design — send us your theme!', '[]'::jsonb, '', 'cupcakes', true, 8),
      ('LEMON CURD CUPCAKE', 'lemon-curd-cupcake', '₹50', '/images/lemon-curd-cupcake.jpeg', 'Tangy lemon curd topped cupcake — per piece', '[]'::jsonb, '', 'cupcakes', true, 9);
  END IF;
END;
$$;

COMMIT;
