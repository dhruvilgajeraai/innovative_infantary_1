-- =============================================================================
-- ARENAFLOW / THE CHAMPIONS CLUB ENTERPRISE DATABASE SCHEMA
-- Database: PostgreSQL 14+
-- =============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE (Authentication with bcrypt password hashing)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL DEFAULT 'normal', -- 'superadmin', 'admin', 'staff', 'normal'
    assigned_authorities TEXT[] DEFAULT '{}',
    membership_tier VARCHAR(50) NOT NULL DEFAULT 'none', -- 'gold', 'silver', 'junior', 'none'
    phone VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. COURTS TABLE (3D Arena Facility Matrix)
CREATE TABLE IF NOT EXISTS courts (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sport VARCHAR(50) NOT NULL, -- 'football', 'tennis', 'cricket', 'badminton', 'padel', 'running', 'volleyball', 'pool'
    court_number INT NOT NULL,
    indoor BOOLEAN DEFAULT FALSE,
    hourly_rate NUMERIC(10, 2) NOT NULL,
    member_hourly_rate NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'maintenance'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. BOOKINGS TABLE (Zero-Collision 30-Minute Engine)
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY,
    court_id VARCHAR(64) REFERENCES courts(id) ON DELETE CASCADE,
    court_name VARCHAR(255) NOT NULL,
    sport VARCHAR(50) NOT NULL,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time VARCHAR(10) NOT NULL, -- e.g. '14:00'
    end_time VARCHAR(10) NOT NULL,   -- e.g. '15:00'
    price NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'confirmed', -- 'confirmed', 'checked-in', 'cancelled'
    payment_status VARCHAR(50) DEFAULT 'unpaid', -- 'paid', 'unpaid', 'refunded'
    razorpay_payment_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_court_slot UNIQUE (court_id, date, start_time)
);

-- 5. PRODUCTS TABLE (Pro Gear Shop & Shared Shelf Inventory)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'shoes', 'apparel', 'rackets', 'accessories', 'nutrition'
    sport VARCHAR(50) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    sku VARCHAR(100) UNIQUE NOT NULL,
    image VARCHAR(500),
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. POS TABS TABLE (Courtside Bar & Cafeteria Running Tabs)
CREATE TABLE IF NOT EXISTS pos_tabs (
    id VARCHAR(64) PRIMARY KEY,
    table_number INT NOT NULL,
    member_name VARCHAR(255) NOT NULL,
    membership_tier VARCHAR(50) DEFAULT 'none',
    discount_percent INT DEFAULT 0,
    items JSONB NOT NULL DEFAULT '[]',
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'settled', 'cancelled'
    payment_method VARCHAR(50), -- 'razorpay', 'upi', 'cash', 'card'
    razorpay_payment_id VARCHAR(255),
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    settled_at TIMESTAMP WITH TIME ZONE
);

-- 7. RAZORPAY TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    payment_id VARCHAR(255),
    signature VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(50) NOT NULL, -- 'created', 'captured', 'failed'
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
    booking_id VARCHAR(64),
    item_type VARCHAR(50), -- 'booking', 'shop', 'pos_tab', 'membership'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64),
    user_email VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    entity VARCHAR(100),
    entity_id VARCHAR(64),
    ip_address VARCHAR(100),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_bookings_date_court ON bookings(date, court_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
