-- ============================================
-- MELODIX - Schéma PostgreSQL v003
-- Catalogue, Stocks, Commandes, Promo Codes, stock_product, products_with_stock, generate_order_number
-- ============================================
-- ============================================
-- TABLE: categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id SMALLINT NULL,
    image VARCHAR(255) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) 
    REFERENCES categories(id) ON DELETE SET NULL
);

-- Index pour categories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    id_category SMALLINT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    monthly DECIMAL(10, 2) NULL CHECK (monthly >= 0),
    badge VARCHAR(50) NULL CHECK (badge IN ('TOP VENTES', 'NOUVEAUTÉ', 'PROMO')),
    image VARCHAR(500) NOT NULL,
    description TEXT,
    specifications JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_category FOREIGN KEY (id_category) 
        REFERENCES categories(id) ON DELETE RESTRICT
);

-- Index pour products
CREATE INDEX IF NOT EXISTS idx_products_category ON products(id_category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_badge ON products(badge);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Index full-text pour recherche
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN (
    to_tsvector('french', COALESCE(brand, '') || ' ' || COALESCE(model, '') || ' ' || COALESCE(description, ''))
);

-- Trigger pour updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE: stocks
-- ============================================
CREATE TABLE IF NOT EXISTS stocks (
    id SMALLSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('magasin', 'entrepot', 'internet')),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour stocks
CREATE INDEX IF NOT EXISTS idx_stocks_type ON stocks(type);
CREATE INDEX IF NOT EXISTS idx_stocks_is_active ON stocks(is_active);

-- ============================================
-- TABLE: stock_product
-- ============================================
CREATE TABLE IF NOT EXISTS stock_product (
    stock_id SMALLINT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reserved_quantity INT DEFAULT 0 CHECK (reserved_quantity >= 0),
    min_threshold INT DEFAULT 5 CHECK (min_threshold >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (stock_id, product_id),
    CONSTRAINT fk_stock_product_stock FOREIGN KEY (stock_id) 
        REFERENCES stocks(id) ON DELETE CASCADE,
    CONSTRAINT fk_stock_product_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT chk_reserved_quantity CHECK (reserved_quantity <= quantity)
);

-- Index pour stock_product
CREATE INDEX IF NOT EXISTS idx_stock_product_product_id ON stock_product(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_product_quantity ON stock_product(quantity);
CREATE INDEX IF NOT EXISTS idx_stock_product_low_stock ON stock_product(quantity) 
    WHERE quantity <= min_threshold;

-- Trigger pour updated_at
CREATE TRIGGER update_stock_product_updated_at BEFORE UPDATE ON stock_product
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE: orders
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL, -- ID MongoDB (ObjectId en string)
    order_number VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    vat DECIMAL(10, 2) NOT NULL CHECK (vat >= 0),
    shipping DECIMAL(10, 2) NOT NULL CHECK (shipping >= 0),
    discount DECIMAL(10, 2) DEFAULT 0 CHECK (discount >= 0),
    total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    payment_method VARCHAR(20) NULL CHECK (payment_method IN ('card', 'paypal', 'bank_transfer')),
    payment_status VARCHAR(20) DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- Trigger pour updated_at
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE: order_items
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) 
        REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) 
        REFERENCES products(id) ON DELETE RESTRICT
);

-- Index pour order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);


-- ============================================
-- TABLE: promo_codes (Optionnel)
-- ============================================
CREATE TABLE IF NOT EXISTS promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed')),
    value DECIMAL(10, 2) NOT NULL CHECK (value >= 0),
    min_purchase DECIMAL(10, 2) DEFAULT 0 CHECK (min_purchase >= 0),
    max_discount DECIMAL(10, 2) NULL CHECK (max_discount >= 0),
    usage_limit INT NULL CHECK (usage_limit >= 0),
    used_count INT DEFAULT 0 CHECK (used_count >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_valid_dates CHECK (valid_until > valid_from),
    CONSTRAINT chk_usage_limit CHECK (used_count <= COALESCE(usage_limit, 999999))
);

-- Index pour promo_codes
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_is_active ON promo_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_promo_codes_valid_dates ON promo_codes(valid_from, valid_until);

-- ============================================
-- VUES UTILES (Optionnel)
-- ============================================

-- Vue pour les produits avec leurs stocks totaux
CREATE OR REPLACE VIEW products_with_stock AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    COALESCE(SUM(sp.quantity), 0) as total_stock,
    COALESCE(SUM(sp.reserved_quantity), 0) as total_reserved,
    COALESCE(SUM(sp.quantity - sp.reserved_quantity), 0) as available_stock
FROM products p
LEFT JOIN categories c ON p.id_category = c.id
LEFT JOIN stock_product sp ON p.id = sp.product_id
WHERE p.is_active = TRUE
GROUP BY p.id, c.name, c.slug;

-- ============================================
-- FONCTIONS UTILES (Optionnel)
-- ============================================

-- Fonction pour générer un numéro de commande unique
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR(50) AS $$
DECLARE
    new_number VARCHAR(50);
    year_part VARCHAR(4);
    seq_part VARCHAR(6);
BEGIN
    year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
    seq_part := LPAD((
        SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 10) AS INT)), 0) + 1
        FROM orders
        WHERE order_number LIKE 'CMD-' || year_part || '-%'
    )::TEXT, 6, '0');
    new_number := 'CMD-' || year_part || '-' || seq_part;
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- DONNÉES INITIALES (Exemples)
-- ============================================

-- Insertion de catégories de base
INSERT INTO categories (name, slug, description) VALUES
    ('Guitares Électriques', 'guitares-electriques', 'Guitares électriques de toutes marques'),
    ('Guitares Acoustiques', 'guitares-acoustiques', 'Guitares acoustiques'),
    ('Guitares Classiques', 'guitares-classiques', 'Guitares classiques'),
    ('Basses Électriques', 'basses-electriques', 'Basses électriques'),
    ('Basses Fretless', 'basses-fretless', 'Basses sans frettes'),
    ('Effets Guitare', 'effets-guitare', 'Pédales et effets pour guitare'),
    ('Effets Basse', 'effets-basse', 'Pédales et effets pour basse'),
    ('Batteries', 'batteries', 'Batteries acoustiques et électroniques'),
    ('Pianos & Claviers', 'pianos-claviers', 'Pianos et claviers'),
    ('Home Studio', 'home-studio', 'Équipement home studio')
ON CONFLICT (name) DO NOTHING;

-- Insertion de stocks de base
INSERT INTO stocks (name, type, address) VALUES
    ('Stock Internet', 'internet', 'Entrepôt central'),
    ('Magasin Paris', 'magasin', '123 Rue de la Musique, 75001 Paris')
ON CONFLICT (name) DO NOTHING;


