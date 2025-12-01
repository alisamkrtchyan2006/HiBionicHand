-- ============================================================================
-- hiBionicHand Platform - PostgreSQL Database Schema
-- Production-Ready Schema with Multilanguage Support
-- ============================================================================

-- Enable UUID extension (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('admin', 'editor', 'user');
CREATE TYPE product_type AS ENUM ('upper_limb', 'lower_limb');
CREATE TYPE product_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE news_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE contact_type AS ENUM ('phone', 'email', 'address', 'social');
CREATE TYPE media_type AS ENUM ('image', 'video');
CREATE TYPE storage_type AS ENUM ('local', 's3', 'cloudinary');
CREATE TYPE language_code AS ENUM ('en', 'ru', 'arm');
CREATE TYPE setting_type AS ENUM ('string', 'number', 'boolean', 'json');

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

COMMENT ON TABLE users IS 'User accounts for authentication and authorization';
COMMENT ON COLUMN users.role IS 'User role: admin, editor, or user';
COMMENT ON COLUMN users.is_active IS 'Whether the user account is active';

-- Product Categories Table
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE product_categories IS 'Product category hierarchy for organizing products';
COMMENT ON COLUMN product_categories.parent_id IS 'Parent category for hierarchical structure';

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES products(id) ON DELETE SET NULL,
    type product_type NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    sku VARCHAR(100),
    status product_status NOT NULL DEFAULT 'draft',
    featured_image_id UUID,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT products_slug_format CHECK (slug ~* '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

COMMENT ON TABLE products IS 'Product catalog with hierarchical structure';
COMMENT ON COLUMN products.category_id IS 'Product category reference';
COMMENT ON COLUMN products.parent_id IS 'Parent product for product variants/hierarchy';
COMMENT ON COLUMN products.type IS 'Product type: upper_limb or lower_limb';
COMMENT ON COLUMN products.status IS 'Product publication status';

-- Product Translations Table
CREATE TABLE product_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    language language_code NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    short_description TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT product_translations_unique UNIQUE (product_id, language)
);

COMMENT ON TABLE product_translations IS 'Multilanguage product content';
COMMENT ON COLUMN product_translations.language IS 'Language code: en, ru, or arm';

-- Product Category Translations Table
CREATE TABLE product_category_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
    language language_code NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT product_category_translations_unique UNIQUE (category_id, language)
);

COMMENT ON TABLE product_category_translations IS 'Multilanguage product category content';

-- Product Specifications Table
CREATE TABLE product_specs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    spec_key VARCHAR(100) NOT NULL,
    spec_value TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE product_specs IS 'Product specifications and technical details';

-- News Table
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    featured_image_id UUID,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status news_status NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    views_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT news_slug_format CHECK (slug ~* '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    CONSTRAINT news_views_count_positive CHECK (views_count >= 0)
);

COMMENT ON TABLE news IS 'News articles and blog posts';
COMMENT ON COLUMN news.published_at IS 'Publication date and time';

-- News Translations Table
CREATE TABLE news_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    language language_code NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT news_translations_unique UNIQUE (news_id, language)
);

COMMENT ON TABLE news_translations IS 'Multilanguage news content';

-- Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255),
    author_avatar_url TEXT,
    rating INTEGER NOT NULL,
    status review_status NOT NULL DEFAULT 'pending',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT reviews_rating_range CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT reviews_email_format CHECK (author_email IS NULL OR author_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

COMMENT ON TABLE reviews IS 'Product reviews and ratings';
COMMENT ON COLUMN reviews.rating IS 'Rating from 1 to 5 stars';
COMMENT ON COLUMN reviews.status IS 'Review moderation status';

-- Review Translations Table
CREATE TABLE review_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    language language_code NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT review_translations_unique UNIQUE (review_id, language)
);

COMMENT ON TABLE review_translations IS 'Multilanguage review content';

-- Partners Table
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_id UUID,
    website_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT partners_website_url_format CHECK (website_url IS NULL OR website_url ~* '^https?://')
);

COMMENT ON TABLE partners IS 'Partner and affiliate information';

-- Partner Translations Table
CREATE TABLE partner_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
    language language_code NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT partner_translations_unique UNIQUE (partner_id, language)
);

COMMENT ON TABLE partner_translations IS 'Multilanguage partner content';

-- Contacts Table
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type contact_type NOT NULL,
    value TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE contacts IS 'Contact information (phone, email, address, social)';

-- Contact Translations Table
CREATE TABLE contact_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    language language_code NOT NULL,
    label VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT contact_translations_unique UNIQUE (contact_id, language)
);

COMMENT ON TABLE contact_translations IS 'Multilanguage contact labels';

-- Contact Form Submissions Table
CREATE TABLE contact_form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT contact_form_submissions_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT contact_form_submissions_status_check CHECK (status IN ('new', 'read', 'replied', 'archived'))
);

COMMENT ON TABLE contact_form_submissions IS 'Contact form submissions from website visitors';

-- Media Table
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    storage_type storage_type NOT NULL,
    storage_path TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    width INTEGER,
    height INTEGER,
    duration INTEGER,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT media_file_size_positive CHECK (file_size > 0),
    CONSTRAINT media_width_positive CHECK (width IS NULL OR width > 0),
    CONSTRAINT media_height_positive CHECK (height IS NULL OR height > 0),
    CONSTRAINT media_duration_positive CHECK (duration IS NULL OR duration > 0)
);

COMMENT ON TABLE media IS 'Centralized media file management';
COMMENT ON COLUMN media.duration IS 'Video duration in seconds';

-- Product Media Junction Table
CREATE TABLE product_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    media_id UUID NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    media_type media_type NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT product_media_unique UNIQUE (product_id, media_id)
);

COMMENT ON TABLE product_media IS 'Product media gallery (images and videos)';

-- Settings Table
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    type setting_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE settings IS 'Application settings and configuration';
COMMENT ON COLUMN settings.value IS 'JSON value stored as JSONB for querying';

-- Settings Translations Table
CREATE TABLE setting_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_id UUID NOT NULL REFERENCES settings(id) ON DELETE CASCADE,
    language language_code NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT setting_translations_unique UNIQUE (setting_id, language)
);

COMMENT ON TABLE setting_translations IS 'Multilanguage settings values';

-- ============================================================================
-- FOREIGN KEY CONSTRAINTS (Additional)
-- ============================================================================

-- Add foreign key for products.featured_image_id
ALTER TABLE products 
ADD CONSTRAINT products_featured_image_fk 
FOREIGN KEY (featured_image_id) REFERENCES media(id) ON DELETE SET NULL;

-- Add foreign key for news.featured_image_id
ALTER TABLE news 
ADD CONSTRAINT news_featured_image_fk 
FOREIGN KEY (featured_image_id) REFERENCES media(id) ON DELETE SET NULL;

-- Add foreign key for partners.logo_id
ALTER TABLE partners 
ADD CONSTRAINT partners_logo_fk 
FOREIGN KEY (logo_id) REFERENCES media(id) ON DELETE SET NULL;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Product Categories indexes
CREATE INDEX idx_product_categories_parent_id ON product_categories(parent_id);
CREATE INDEX idx_product_categories_slug ON product_categories(slug);
CREATE INDEX idx_product_categories_is_active ON product_categories(is_active);

-- Products indexes
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_parent_id ON products(parent_id);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_created_by ON products(created_by);
CREATE INDEX idx_products_featured_image_id ON products(featured_image_id);

-- Product Translations indexes
CREATE INDEX idx_product_translations_product_id ON product_translations(product_id);
CREATE INDEX idx_product_translations_language ON product_translations(language);
CREATE INDEX idx_product_translations_product_lang ON product_translations(product_id, language);

-- Product Category Translations indexes
CREATE INDEX idx_product_category_translations_category_id ON product_category_translations(category_id);
CREATE INDEX idx_product_category_translations_language ON product_category_translations(language);

-- Product Specs indexes
CREATE INDEX idx_product_specs_product_id ON product_specs(product_id);
CREATE INDEX idx_product_specs_display_order ON product_specs(product_id, display_order);

-- News indexes
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_author_id ON news(author_id);
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_published_at ON news(published_at);
CREATE INDEX idx_news_featured_image_id ON news(featured_image_id);

-- News Translations indexes
CREATE INDEX idx_news_translations_news_id ON news_translations(news_id);
CREATE INDEX idx_news_translations_language ON news_translations(language);
CREATE INDEX idx_news_translations_news_lang ON news_translations(news_id, language);

-- Reviews indexes
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_is_featured ON reviews(is_featured);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- Review Translations indexes
CREATE INDEX idx_review_translations_review_id ON review_translations(review_id);
CREATE INDEX idx_review_translations_language ON review_translations(language);

-- Partners indexes
CREATE INDEX idx_partners_logo_id ON partners(logo_id);
CREATE INDEX idx_partners_is_active ON partners(is_active);
CREATE INDEX idx_partners_display_order ON partners(display_order);

-- Partner Translations indexes
CREATE INDEX idx_partner_translations_partner_id ON partner_translations(partner_id);
CREATE INDEX idx_partner_translations_language ON partner_translations(language);

-- Contacts indexes
CREATE INDEX idx_contacts_type ON contacts(type);
CREATE INDEX idx_contacts_is_active ON contacts(is_active);
CREATE INDEX idx_contacts_display_order ON contacts(display_order);

-- Contact Translations indexes
CREATE INDEX idx_contact_translations_contact_id ON contact_translations(contact_id);
CREATE INDEX idx_contact_translations_language ON contact_translations(language);

-- Contact Form Submissions indexes
CREATE INDEX idx_contact_form_submissions_status ON contact_form_submissions(status);
CREATE INDEX idx_contact_form_submissions_created_at ON contact_form_submissions(created_at);
CREATE INDEX idx_contact_form_submissions_email ON contact_form_submissions(email);

-- Media indexes
CREATE INDEX idx_media_storage_type ON media(storage_type);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX idx_media_created_at ON media(created_at);
CREATE INDEX idx_media_mime_type ON media(mime_type);

-- Product Media indexes
CREATE INDEX idx_product_media_product_id ON product_media(product_id);
CREATE INDEX idx_product_media_media_id ON product_media(media_id);
CREATE INDEX idx_product_media_display_order ON product_media(product_id, display_order);

-- Settings indexes
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_type ON settings(type);

-- Setting Translations indexes
CREATE INDEX idx_setting_translations_setting_id ON setting_translations(setting_id);
CREATE INDEX idx_setting_translations_language ON setting_translations(language);

-- ============================================================================
-- FULL-TEXT SEARCH INDEXES (PostgreSQL)
-- ============================================================================

-- Product translations full-text search
CREATE INDEX idx_product_translations_search ON product_translations 
USING gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));

-- News translations full-text search
CREATE INDEX idx_news_translations_search ON news_translations 
USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON product_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_translations_updated_at BEFORE UPDATE ON product_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_category_translations_updated_at BEFORE UPDATE ON product_category_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_translations_updated_at BEFORE UPDATE ON news_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_translations_updated_at BEFORE UPDATE ON review_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_translations_updated_at BEFORE UPDATE ON partner_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_translations_updated_at BEFORE UPDATE ON contact_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_form_submissions_updated_at BEFORE UPDATE ON contact_form_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_setting_translations_updated_at BEFORE UPDATE ON setting_translations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA / SEED DATA (Optional)
-- ============================================================================

-- Insert default admin user (password should be hashed in production)
-- Password: 'admin123' (bcrypt hash - replace with actual hash)
-- INSERT INTO users (id, email, password_hash, role, first_name, last_name) 
-- VALUES (uuid_generate_v4(), 'admin@hibionichand.com', '$2b$10$...', 'admin', 'Admin', 'User');

-- Insert default languages settings
-- INSERT INTO settings (key, value, type) VALUES 
-- ('default_language', '"en"', 'string'),
-- ('supported_languages', '["en", "ru", "arm"]', 'json');

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

