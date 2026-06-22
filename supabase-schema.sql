-- ============================================================
-- SEDAP RESTAURANT - Database Schema & RLS Policies
-- ============================================================

-- ============================================================
-- 1. TABLES
-- ============================================================

-- 2.1 profiles (1:1 with auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text NOT NULL DEFAULT '',
    role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'guest')),
    points integer NOT NULL DEFAULT 0,
    tier text NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 2.2 customers
CREATE TABLE IF NOT EXISTS customers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text,
    phone text,
    address text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 2.3 products
CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    price numeric NOT NULL DEFAULT 0,
    stock integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 2.4 orders
CREATE TABLE IF NOT EXISTS orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
    total_amount numeric NOT NULL DEFAULT 0,
    discount_percent numeric NOT NULL DEFAULT 0,
    final_amount numeric NOT NULL DEFAULT 0,
    points_earned integer NOT NULL DEFAULT 0,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 2.5 order_items
CREATE TABLE IF NOT EXISTS order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity integer NOT NULL DEFAULT 1,
    unit_price numeric NOT NULL DEFAULT 0,
    subtotal numeric NOT NULL DEFAULT 0
);

-- ============================================================
-- 2. HELPER FUNCTION: is_admin()
-- (Must be created AFTER profiles table exists)
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND role = 'admin'
    );
$$;

-- ============================================================
-- 3. TRIGGER: Auto-create profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 'member');
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4.1 profiles policies
-- User can SELECT/UPDATE own row. Admin can SELECT/UPDATE all.
-- ============================================================
CREATE POLICY "profiles_select_own"
    ON profiles FOR SELECT
    USING (auth.uid() = id OR is_admin());

CREATE POLICY "profiles_update_own"
    ON profiles FOR UPDATE
    USING (auth.uid() = id OR is_admin())
    WITH CHECK (auth.uid() = id OR is_admin());

-- ============================================================
-- 4.2 customers policies
-- Admin only: SELECT, INSERT, UPDATE, DELETE
-- ============================================================
CREATE POLICY "customers_select_admin"
    ON customers FOR SELECT
    USING (is_admin());

CREATE POLICY "customers_insert_admin"
    ON customers FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "customers_update_admin"
    ON customers FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "customers_delete_admin"
    ON customers FOR DELETE
    USING (is_admin());

-- ============================================================
-- 4.3 products policies
-- All authenticated: SELECT. Admin only: INSERT, UPDATE, DELETE.
-- ============================================================
CREATE POLICY "products_select_authenticated"
    ON products FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "products_insert_admin"
    ON products FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "products_update_admin"
    ON products FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "products_delete_admin"
    ON products FOR DELETE
    USING (is_admin());

-- ============================================================
-- 4.4 orders policies
-- Member: SELECT/INSERT own orders (user_id = auth.uid())
-- Admin: SELECT all, UPDATE all (for status changes)
-- ============================================================
CREATE POLICY "orders_select"
    ON orders FOR SELECT
    USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "orders_insert_member"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "orders_update_admin"
    ON orders FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- ============================================================
-- 4.5 order_items policies
-- Follows parent orders access
-- ============================================================
CREATE POLICY "order_items_select"
    ON order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = auth.uid() OR is_admin())
        )
    );

CREATE POLICY "order_items_insert"
    ON order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "order_items_update_admin"
    ON order_items FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "order_items_delete_admin"
    ON order_items FOR DELETE
    USING (is_admin());

-- ============================================================
-- 5. SEED DATA: Sample products
-- ============================================================
INSERT INTO products (name, description, price, stock) VALUES
    ('Nasi Goreng Spesial', 'Nasi goreng dengan telur, ayam, dan sayuran', 35000, 50),
    ('Mie Goreng Seafood', 'Mie goreng dengan udang, cumi, dan sayuran', 40000, 40),
    ('Ayam Bakar Madu', 'Ayam bakar dengan saus madu spesial', 45000, 30),
    ('Sate Ayam (10 tusuk)', 'Sate ayam dengan bumbu kacang', 30000, 60),
    ('Gado-Gado', 'Salad sayuran dengan bumbu kacang', 25000, 45),
    ('Soto Ayam', 'Soto ayam dengan nasi dan kerupuk', 28000, 35),
    ('Rendang Sapi', 'Rendang daging sapi empuk dan kaya rempah', 55000, 25),
    ('Es Teh Manis', 'Es teh manis segar', 8000, 100),
    ('Jus Alpukat', 'Jus alpukat dengan susu coklat', 15000, 50),
    ('Nasi Uduk Komplit', 'Nasi uduk dengan lauk lengkap', 32000, 40)
ON CONFLICT DO NOTHING;
