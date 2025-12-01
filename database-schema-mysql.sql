-- ============================================================================
-- hiBionicHand Platform - MySQL Database Schema
-- Production-Ready Schema with Multilanguage Support
-- MySQL 8.0+ Recommended
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users Table
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'editor', 'user') NOT NULL DEFAULT 'user',
    first_name VARCHAR(100) DEFAULT NULL,
    last_name VARCHAR(100) DEFAULT NULL,
    avatar_url TEXT DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_is_active (is_active),
    
    CONSTRAINT users_email_format CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Categories Table
CREATE TABLE product_categories (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    parent_id CHAR(36) DEFAULT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_product_categories_parent_id (parent_id),
    INDEX idx_product_categories_slug (slug),
    INDEX idx_product_categories_is_active (is_active),
    
    FOREIGN KEY (parent_id) REFERENCES product_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products Table
CREATE TABLE products (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    category_id CHAR(36) DEFAULT NULL,
    parent_id CHAR(36) DEFAULT NULL,
    type ENUM('upper_limb', 'lower_limb') NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    sku VARCHAR(100) DEFAULT NULL,
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    featured_image_id CHAR(36) DEFAULT NULL,
    created_by CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_products_category_id (category_id),
    INDEX idx_products_parent_id (parent_id),
    INDEX idx_products_type (type),
    INDEX idx_products_status (status),
    INDEX idx_products_slug (slug),
    INDEX idx_products_created_by (created_by),
    INDEX idx_products_featured_image_id (featured_image_id),
    
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT products_slug_format CHECK (slug REGEXP '^[a-z0-9]+(?:-[a-z0-9]+)*$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Translations Table
CREATE TABLE product_translations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id CHAR(36) NOT NULL,
    language ENUM('en', 'ru', 'arm') NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    short_description TEXT DEFAULT NULL,
    meta_title VARCHAR(255) DEFAULT NULL,
    meta_description TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY product_translations_unique (product_id, language),
    INDEX idx_product_translations_product_id (product_id),
    INDEX idx_product_translations_language (language),
    INDEX idx_product_translations_product_lang (product_id, language),
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Category Translations Table
CREATE TABLE product_category_translations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    category_id CHAR(36) NOT NULL,
    language ENUM('en', 'ru', 'arm') NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY product_category_translations_unique (category_id, language),
    INDEX idx_product_category_translations_category_id (category_id),
    INDEX idx_product_category_translations_language (language),
    
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Specifications Table
CREATE TABLE product_specs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id CHAR(36) NOT NULL,
    spec_key VARCHAR(100) NOT NULL,
    spec_value TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_product_specs_product_id (product_id),
    INDEX idx_product_specs_display_order (product_id, display_order),
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- News Table
CREATE TABLE news (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    slug VARCHAR(255) NOT NULL UNIQUE,
    featured_image_id CHAR(36) DEFAULT NULL,
    author_id CHAR(36) NOT NULL,
    status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP NULL DEFAULT NULL,
    views_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_news_slug (slug),
    INDEX idx_news_author_id (author_id),
    INDEX idx_news_status (status),
    INDEX idx_news_published_at (published_at),
    INDEX idx_news_featured_image_id (featured_image_id),
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT news_slug_format CHECK (slug REGEXP '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    CONSTRAINT news_views_count_positive CHECK (views_count >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- News Translations Table
CREATE TABLE news_translations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    news_id CHAR(36) NOT NULL,
    language ENUM('en', 'ru', 'arm') NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT DEFAULT NULL,
    meta_title VARCHAR(255) DEFAULT NULL,
    meta_description TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY news_translations_unique (news_id, language),
    INDEX idx_news_translations_news_id (news_id),
    INDEX idx_news_translations_language (language),
    INDEX idx_news_translations_news_lang (news_id, language),
    
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reviews Table
CREATE TABLE reviews (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id CHAR(36) DEFAULT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255) DEFAULT NULL,
    author_avatar_url TEXT DEFAULT NULL,
    rating INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_reviews_product_id (product_id),
    INDEX idx_reviews_status (status),
    INDEX idx_reviews_rating (rating),
    INDEX idx_reviews_is_featured (is_featured),
    INDEX idx_reviews_created_at (created_at),
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
    CONSTRAINT reviews_rating_range CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT reviews_email_format CHECK (author_email IS NULL OR author_email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Review Translations Table
CREATE TABLE review_translations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    review_id CHAR(36) NOT NULL,
    language ENUM('en', 'ru', 'arm') NOT NULL,
    title VARCHAR(255) DEFAULT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY review_translations_unique (review_id, language),
    INDEX idx_review_translations_review_id (review_id),
    INDEX idx_review_translations_language (language),
    
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Partners Table
CREATE TABLE partners (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    logo_id CHAR(36) DEFAULT NULL,
    website_url TEXT DEFAULT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_partners_logo_id (logo_id),
    INDEX idx_partners_is_active (is_active),
    INDEX idx_partners_display_order (display_order),
    
    CONSTRAINT partners_website_url_format CHECK (website_url IS NULL OR website_url REGEXP '^https?://')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Partner Translations Table
CREATE TABLE partner_translations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    partner_id CHAR(36) NOT NULL,
    language ENUM('en', 'ru', 'arm') NOT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY partner_translations_unique (partner_id, language),
    INDEX idx_partner_translations_partner_id (partner_id),
    INDEX idx_partner_translations_language (language),
    
    FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contacts Table
CREATE TABLE contacts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    type ENUM('phone', 'email', 'address', 'social') NOT NULL,
    value TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_contacts_type (type),
    INDEX idx_contacts_is_active (is_active),
    INDEX idx_contacts_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Translations Table
CREATE TABLE contact_translations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    contact_id CHAR(36) NOT NULL,
    language ENUM('en', 'ru', 'arm') NOT NULL,
    label VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY contact_translations_unique (contact_id, language),
    INDEX idx_contact_translations_contact_id (contact_id),
    INDEX idx_contact_translations_language (language),
    
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact Form Submissions Table
CREATE TABLE contact_form_submissions (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    subject VARCHAR(255) DEFAULT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_contact_form_submissions_status (status),
    INDEX idx_contact_form_submissions_created_at (created_at),
    INDEX idx_contact_form_submissions_email (email),
    
    CONSTRAINT contact_form_submissions_email_format CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT contact_form_submissions_status_check CHECK (status IN ('new', 'read', 'replied', 'archived'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Media Table
CREATE TABLE media (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    storage_type ENUM('local', 's3', 'cloudinary') NOT NULL,
    storage_path TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT DEFAULT NULL,
    width INT DEFAULT NULL,
    height INT DEFAULT NULL,
    duration INT DEFAULT NULL,
    uploaded_by CHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_media_storage_type (storage_type),
    INDEX idx_media_uploaded_by (uploaded_by),
    INDEX idx_media_created_at (created_at),
    INDEX idx_media_mime_type (mime_type),
    
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT media_file_size_positive CHECK (file_size > 0),
    CONSTRAINT media_width_positive CHECK (width IS NULL OR width > 0),
    CONSTRAINT media_height_positive CHECK (height IS NULL OR height > 0),
    CONSTRAINT media_duration_positive CHECK (duration IS NULL OR duration > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Product Media Junction Table
CREATE TABLE product_media (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id CHAR(36) NOT NULL,
    media_id CHAR(36) NOT NULL,
    media_type ENUM('image', 'video') NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY product_media_unique (product_id, media_id),
    INDEX idx_product_media_product_id (product_id),
    INDEX idx_product_media_media_id (media_id),
    INDEX idx_product_media_display_order (product_id, display_order),
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings Table
CREATE TABLE settings (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    `key` VARCHAR(100) NOT NULL UNIQUE,
    value JSON NOT NULL,
    type ENUM('string', 'number', 'boolean', 'json') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_settings_key (`key`),
    INDEX idx_settings_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings Translations Table
CREATE TABLE setting_translations (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    setting_id CHAR(36) NOT NULL,
    language ENUM('en', 'ru', 'arm') NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY setting_translations_unique (setting_id, language),
    INDEX idx_setting_translations_setting_id (setting_id),
    INDEX idx_setting_translations_language (language),
    
    FOREIGN KEY (setting_id) REFERENCES settings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- ADDITIONAL FOREIGN KEY CONSTRAINTS
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

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- FULL-TEXT SEARCH INDEXES (MySQL)
-- ============================================================================

-- Product translations full-text search
ALTER TABLE product_translations 
ADD FULLTEXT INDEX idx_product_translations_search (name, description);

-- News translations full-text search
ALTER TABLE news_translations 
ADD FULLTEXT INDEX idx_news_translations_search (title, content);

-- ============================================================================
-- INITIAL DATA / SEED DATA (Optional)
-- ============================================================================

-- Insert default admin user (password should be hashed in production)
-- Password: 'admin123' (bcrypt hash - replace with actual hash)
-- INSERT INTO users (id, email, password_hash, role, first_name, last_name) 
-- VALUES (UUID(), 'admin@hibionichand.com', '$2b$10$...', 'admin', 'Admin', 'User');

-- Insert default languages settings
-- INSERT INTO settings (`key`, value, type) VALUES 
-- ('default_language', '"en"', 'string'),
-- ('supported_languages', '["en", "ru", "arm"]', 'json');

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

