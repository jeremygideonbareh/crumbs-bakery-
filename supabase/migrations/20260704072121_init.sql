-- Paste this in Supabase Dashboard → SQL Editor → New Query → Run

-- 1. CATEGORIES
CREATE TABLE categories (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  hero_image text
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);

INSERT INTO categories (slug, name, description, hero_image) VALUES
  ('cakes', 'CAKES', 'Custom & classic cakes for every occasion', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80'),
  ('cupcakes', 'CUPCAKES', 'Hand-decorated cupcakes by the dozen', 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=1200&q=80'),
  ('desserts', 'DESSERTS', 'Cookies, brownies, cheesecakes & more', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1200&q=80');

-- 2. PRODUCTS
CREATE TABLE products (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  price text NOT NULL,
  image text,
  description text,
  variants jsonb DEFAULT '[]'::jsonb,
  badge text,
  category_slug text REFERENCES categories(slug),
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read products" ON products FOR SELECT USING (true);

INSERT INTO products (name, slug, price, image, description, variants, badge, category_slug, sort_order)
SELECT * FROM jsonb_to_recordset('[
  {"name":"VINTAGE HEART CAKE","slug":"vintage-heart-cake","price":"₹1,200","image":"https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&q=80","description":"Layered sponge with pink piped Swiss Meringue buttercream","variants":["Ivory","Pink","Lilac","Green","Peach","Yellow","Blue"],"category_slug":"cakes","sort_order":1},
  {"name":"BESPOKE CAKE","slug":"bespoke-cake","price":"₹2,500","image":"https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&q=80","description":"Design your own","category_slug":"cakes","sort_order":2},
  {"name":"VINTAGE CAKE — SINGLE COLOUR","slug":"vintage-cake-single-colour","price":"₹1,500","image":"https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80","description":"Classic vintage style in your choice of colour","variants":["Ivory","Blue","Peach","Lilac","Green","Pink","Yellow"],"category_slug":"cakes","sort_order":3},
  {"name":"CLASSIC CHOCOLATE CAKE","slug":"classic-chocolate-cake","price":"₹1,000","image":"https://images.unsplash.com/photo-1588195538326-c5b1e9f80a01?w=400&q=80","description":"Four rich layers with smooth chocolate buttercream","category_slug":"cakes","sort_order":4},
  {"name":"CLASSIC LEMON DRIZZLE CAKE","slug":"classic-lemon-drizzle-cake","price":"₹1,100","image":"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80","description":"Four layers with lemon meringue buttercream","category_slug":"cakes","sort_order":5},
  {"name":"CLASSIC RED VELVET CAKE","slug":"classic-red-velvet-cake","price":"₹1,200","image":"https://images.unsplash.com/photo-1775210603506-201ed7bec326?w=400&q=80","description":"Smooth cream cheese frosting on moist red velvet layers","category_slug":"cakes","sort_order":6},
  {"name":"CLASSIC CARROT CAKE","slug":"classic-carrot-cake","price":"₹1,100","image":"https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&q=80","description":"Moist carrot cake with cream cheese icing and walnuts","category_slug":"cakes","sort_order":7},

  {"name":"VANILLA CUPCAKES (DOZEN)","slug":"vanilla-cupcakes-dozen","price":"₹600","image":"https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&q=80","description":"Classic vanilla sponge with silky vanilla buttercream","category_slug":"cupcakes","sort_order":1},
  {"name":"CHOCOLATE CUPCAKES (DOZEN)","slug":"chocolate-cupcakes-dozen","price":"₹650","image":"https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&q=80","description":"Rich chocolate sponge with chocolate ganache frosting","category_slug":"cupcakes","sort_order":2},
  {"name":"RED VELVET CUPCAKES (DOZEN)","slug":"red-velvet-cupcakes-dozen","price":"₹700","image":"https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&q=80","description":"Red velvet with cream cheese frosting","category_slug":"cupcakes","sort_order":3},
  {"name":"CUSTOM DESIGN CUPCAKES","slug":"custom-design-cupcakes","price":"₹950","image":"https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&q=80","description":"Fully custom design — send us your theme!","category_slug":"cupcakes","sort_order":4},

  {"name":"CHOC CHIP NY COOKIE","slug":"choc-chip-ny-cookie","price":"₹120","image":"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80","description":"Classic New York-style loaded with dark chocolate chunks","category_slug":"desserts","sort_order":1},
  {"name":"RED VELVET NY COOKIE","slug":"red-velvet-ny-cookie","price":"₹130","image":"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80","description":"Red velvet cookie with white chocolate chips","category_slug":"desserts","sort_order":2},
  {"name":"CLASSIC BROWNIE (BOX OF 6)","slug":"classic-brownie-box-of-6","price":"₹600","image":"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80","description":"Rich, fudgy Belgian chocolate brownies","category_slug":"desserts","sort_order":3},
  {"name":"NEW YORK CHEESECAKE","slug":"new-york-cheesecake","price":"₹1,800","image":"https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&q=80","description":"Classic New York-style baked cheesecake with a buttery graham crust","badge":"Best Seller","category_slug":"desserts","sort_order":4},
  {"name":"TIRAMISU","slug":"tiramisu","price":"₹1,500","image":"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80","description":"Classic Italian tiramisu — espresso-soaked ladyfingers with mascarpone cream","category_slug":"desserts","sort_order":5},
  {"name":"FRENCH MACARONS (BOX OF 6)","slug":"french-macarons-box-of-6","price":"₹850","image":"https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80","description":"Almond macarons — assorted flavours in a beautiful box","badge":"Artisanal","category_slug":"desserts","sort_order":6}
]'::jsonb) AS x(name text, slug text, price text, image text, description text, variants jsonb, badge text, category_slug text, sort_order integer);

-- 3. ORDERS
CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  customer jsonb NOT NULL DEFAULT '{}'::jsonb,
  total integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  message text,
  date text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
-- SELECT is NOT allowed via direct table access.
-- Admin panel uses SECURITY DEFINER RPC functions (admin_read_orders, etc.)
-- Run supabase/migrations/20260705000001_admin_rpc_security.sql to set up RPCs.

-- 4. CONTACT MESSAGES
CREATE TABLE contact_messages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact messages" ON contact_messages FOR INSERT WITH CHECK (true);
-- SELECT is NOT allowed via direct table access.
-- Admin panel uses SECURITY DEFINER RPC functions (admin_read_messages, etc.)
-- Run supabase/migrations/20260705000001_admin_rpc_security.sql to set up RPCs.

-- 5. REVIEWS
CREATE TABLE reviews (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  text text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  source text DEFAULT 'Google',
  approved boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read approved reviews" ON reviews FOR SELECT USING (approved = true);
CREATE POLICY "Anyone can submit reviews" ON reviews FOR INSERT WITH CHECK (true);
