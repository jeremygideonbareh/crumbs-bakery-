-- Migration: Add new cafe menu items & update pricing to per-piece
-- Run: supabase db push
-- Re-applies safely: idempotent (uses ON CONFLICT and exact name matching)

--- 1. UPDATE existing items to per-piece pricing ---

UPDATE products SET
  name = 'CLASSIC BROWNIE',
  price = '₹60',
  description = 'Rich, fudgy Belgian chocolate brownie — per piece'
WHERE name = 'CLASSIC BROWNIE (BOX OF 6)';

UPDATE products SET
  name = 'RED VELVET CUPCAKE',
  price = '₹50',
  description = 'Red velvet with cream cheese frosting — per piece'
WHERE name = 'RED VELVET CUPCAKES (DOZEN)';

UPDATE products SET
  price = '₹80',
  description = 'Classic Italian tiramisu — espresso-soaked ladyfingers with mascarpone cream — per piece'
WHERE name = 'TIRAMISU';

UPDATE products SET
  name = 'CHOCOLATE ÉCLAIR',
  price = '₹50',
  description = 'Choux pastry filled with chocolate cream topped with ganache — per piece'
WHERE name = 'CHOCOLATE ÉCLAIRS (BOX OF 4)';

--- 2. REMOVE d9 BLUEBERRY MUFFINS (BOX OF 4) — superseded by LEMON & BLUEBERRY MUFFINS ---

DELETE FROM products WHERE name = 'BLUEBERRY MUFFINS (BOX OF 4)';

--- 3. INSERT new items ---

INSERT INTO products (name, slug, price, image, description, badge, category_slug, active, sort_order)
VALUES
  ('LEMON CURD CUPCAKE', 'lemon-curd-cupcake', '₹50',
   'https://images.pexels.com/photos/14105/pexels-photo-14105.jpeg?auto=compress&cs=tinysrgb&w=400&q=80',
   'Tangy lemon curd topped cupcake — per piece', NULL, 'cupcakes', true, 10),

  ('JAPANESE CHEESECAKE', 'japanese-cheesecake', '₹180',
   '/crumbs-bakery-/images/Japanese%20cheesecake.jpeg',
   'Light, fluffy Japanese-style cheesecake — per slice', NULL, 'desserts', true, 20),

  ('NEW YORK CHEESECAKE', 'new-york-cheesecake', '₹150',
   'https://images.pexels.com/photos/38058461/pexels-photo-38058461.jpeg?auto=compress&cs=tinysrgb&w=400&q=80',
   'Classic creamy New York-style cheesecake — per slice', NULL, 'desserts', true, 21),

  ('BURNT BASQUE CHEESECAKE', 'burnt-basque-cheesecake', '₹180',
   'https://images.pexels.com/photos/38058461/pexels-photo-38058461.jpeg?auto=compress&cs=tinysrgb&w=400&q=80',
   'Caramelised Basque-style cheesecake with creamy centre — per slice', NULL, 'desserts', true, 22),

  ('CARAMEL CUSTARD', 'caramel-custard', '₹80',
   'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=400&q=80',
   'Silky caramel custard dessert — per piece', NULL, 'desserts', true, 23),

  ('CHOCOLATE WITH WHIPPED CARAMEL', 'chocolate-with-whipped-caramel', '₹180',
   'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=400&q=80',
   'Rich chocolate dessert topped with whipped caramel — per piece', NULL, 'desserts', true, 24),

  ('QUICHE', 'quiche', '₹50',
   '/crumbs-bakery-/images/Quiche.jpeg',
   'Savory egg and cheese quiche with buttery crust — per piece',
   'Savory', 'desserts', true, 25),

  ('CINNAMON ROLLS', 'cinnamon-rolls', '₹50',
   'https://images.pexels.com/photos/140831/pexels-photo-140831.jpeg?auto=compress&cs=tinysrgb&w=400&q=80',
   'Soft cinnamon rolls with cream cheese glaze — per piece', NULL, 'desserts', true, 26),

  ('BERLINERS', 'berliners', '₹50',
   'https://images.pexels.com/photos/20677473/pexels-photo-20677473.jpeg?auto=compress&cs=tinysrgb&w=400&q=80',
   'Jam-filled German-style Berliner doughnuts — per piece', NULL, 'desserts', true, 27),

  ('LEMON & BLUEBERRY MUFFINS', 'lemon-blueberry-muffins', '₹60',
   '/crumbs-bakery-/images/Lemon%20and%20blueberry%20muffins.jpeg',
   'Light, fluffy muffins bursting with lemon and blueberries — per piece', NULL, 'desserts', true, 28),

  ('BANANA & CHOCOLATE MUFFIN', 'banana-chocolate-muffin', '₹60',
   'https://images.pexels.com/photos/4242130/pexels-photo-4242130.jpeg?auto=compress&cs=tinysrgb&w=400&q=80',
   'Moist banana muffin with dark chocolate chunks — per piece', NULL, 'desserts', true, 29),

  ('CREAM PUFFS', 'cream-puffs', '₹40',
   '/crumbs-bakery-/images/Cream%20puffs.jpeg',
   'Light choux pastry filled with silky cream — per piece', NULL, 'desserts', true, 30),

  ('BLUEBERRY SCONES', 'blueberry-scones', '₹50',
   'https://images.pexels.com/photos/38058461/pexels-photo-38058461.jpeg?auto=compress&cs=tinysrgb&w=400&q=80',
   'Buttery scones bursting with fresh blueberries — per piece', NULL, 'desserts', true, 31),

  ('HUMMINGBIRD CAKE SLICES', 'hummingbird-cake-slices', '₹50',
   'https://images.pexels.com/photos/29230134/pexels-photo-29230134.jpeg?auto=compress&cs=tinysrgb&w=400&q=80',
   'Pineapple, banana, and pecan cake with cream cheese frosting — per slice', NULL, 'desserts', true, 32),

  ('MARBLE CAKE', 'marble-cake', '₹50',
   'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=400&q=80',
   'Classic vanilla and chocolate swirled marble cake — per slice', NULL, 'desserts', true, 33),

  ('BANANA PUDDING BRIOCHE', 'banana-pudding-brioche', '₹120',
   '/crumbs-bakery-/images/Banana%20pudding%20brioche.jpeg',
   'Soft brioche filled with banana pudding — per piece', NULL, 'desserts', true, 34)
ON CONFLICT (slug) DO NOTHING;
