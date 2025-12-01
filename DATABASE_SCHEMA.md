# Database Schema Documentation

## Entity Relationship Overview

### Core Entities

#### 1. Users
- Manages authentication and authorization
- Roles: admin, editor, user
- Supports avatar uploads

#### 2. Products
- Hierarchical structure (parent-child relationships)
- Types: upper_limb, lower_limb
- Supports multiple translations
- Media gallery support
- Specifications system

#### 3. News
- Blog/news article system
- Author tracking
- View counter
- SEO metadata support

#### 4. Reviews
- Product reviews with ratings
- Moderation system (pending/approved/rejected)
- Featured reviews capability
- Guest author support

#### 5. Partners
- Partner/affiliate management
- Logo uploads
- Display ordering

#### 6. Contacts
- Multiple contact types (phone, email, address, social)
- Multilanguage labels

#### 7. Media
- Centralized media management
- Supports local, S3, and Cloudinary storage
- Image and video support
- Thumbnail generation

#### 8. Settings
- Key-value configuration
- Multilanguage support for settings

---

## Database Indexes

### Performance Indexes:
```sql
-- Products
CREATE INDEX idx_products_parent_id ON products(parent_id);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);

-- Translations
CREATE INDEX idx_product_translations_product_lang ON product_translations(product_id, language);
CREATE INDEX idx_news_translations_news_lang ON news_translations(news_id, language);

-- Media
CREATE INDEX idx_media_storage_type ON media(storage_type);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);

-- News
CREATE INDEX idx_news_published_at ON news(published_at);
CREATE INDEX idx_news_status ON news(status);

-- Reviews
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Full-text search (PostgreSQL)
CREATE INDEX idx_product_translations_search ON product_translations USING gin(to_tsvector('english', name || ' ' || description));
CREATE INDEX idx_news_translations_search ON news_translations USING gin(to_tsvector('english', title || ' ' || content));
```

---

## Database Relationships Summary

| Parent Entity | Child Entity | Relationship | Description |
|--------------|-------------|--------------|-------------|
| Users | Products | 1:N | User creates products |
| Users | News | 1:N | User authors news |
| Users | Media | 1:N | User uploads media |
| Products | Products | 1:N (self) | Product hierarchy |
| Products | ProductTranslations | 1:N | Multilanguage support |
| Products | ProductSpecs | 1:N | Product specifications |
| Products | ProductMedia | 1:N | Product media gallery |
| Products | Reviews | 1:N | Product reviews |
| News | NewsTranslations | 1:N | Multilanguage support |
| Reviews | ReviewTranslations | 1:N | Multilanguage support |
| Partners | PartnerTranslations | 1:N | Multilanguage support |
| Contacts | ContactTranslations | 1:N | Multilanguage support |
| Settings | SettingTranslations | 1:N | Multilanguage support |
| Media | Products | 1:N | Featured images |
| Media | News | 1:N | Featured images |
| Media | Partners | 1:N | Partner logos |

---

## Multilanguage Strategy

All content entities follow the same translation pattern:
- Main table stores non-translatable fields (IDs, status, dates)
- Translation table stores language-specific content
- Language enum: `en`, `ru`, `arm`
- Composite unique constraint: `(entity_id, language)`

### Translation Table Pattern:
```typescript
{
  id: UUID (PK)
  entity_id: UUID (FK to parent)
  language: ENUM('en', 'ru', 'arm')
  // ... translatable fields
  created_at: DateTime
  updated_at: DateTime
  UNIQUE(entity_id, language)
}
```

---

## Data Types

### UUIDs
- All primary keys use UUID v4
- Better for distributed systems
- Non-sequential (security)

### Enums
- Status fields: draft, published, archived
- Product types: upper_limb, lower_limb
- Media types: image, video
- Storage types: local, s3, cloudinary
- User roles: admin, editor, user

### JSONB (PostgreSQL)
- Settings value field
- Flexible schema for configuration
- Queryable with JSON operators

---

## Audit Fields

All tables include:
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

User tracking:
- `created_by`: User who created the record
- `author_id`: User who authored content

---

## Soft Deletes

Consider implementing soft deletes for:
- Products
- News
- Reviews
- Users

Add `deleted_at` timestamp field (nullable)

---

## Migration Strategy

1. Create base tables
2. Add foreign key constraints
3. Create indexes
4. Add seed data
5. Set up triggers for `updated_at` auto-update

