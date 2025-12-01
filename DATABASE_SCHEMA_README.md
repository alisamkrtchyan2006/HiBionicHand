# Database Schema Documentation
## Production-Ready SQL Schemas

This directory contains production-ready database schemas for the hiBionicHand platform, available in both PostgreSQL and MySQL formats.

---

## 📁 Files

- **database-schema-postgresql.sql** - PostgreSQL 12+ schema (Recommended)
- **database-schema-mysql.sql** - MySQL 8.0+ schema

---

## 🗄️ Database Tables

### Core Tables

1. **users** - User accounts and authentication
2. **product_categories** - Product category hierarchy
3. **products** - Product catalog with hierarchical structure
4. **news** - News articles and blog posts
5. **reviews** - Product reviews and ratings
6. **partners** - Partner and affiliate information
7. **contacts** - Contact information
8. **media** - Centralized media file management
9. **settings** - Application settings and configuration

### Translation Tables (Multilanguage Support)

- **product_translations** - Product content in EN, RU, ARM
- **product_category_translations** - Category names in multiple languages
- **news_translations** - News content in multiple languages
- **review_translations** - Review content in multiple languages
- **partner_translations** - Partner descriptions in multiple languages
- **contact_translations** - Contact labels in multiple languages
- **setting_translations** - Settings values in multiple languages

### Junction Tables

- **product_media** - Product media gallery (images and videos)
- **product_specs** - Product specifications
- **contact_form_submissions** - Contact form submissions

---

## 🚀 Quick Start

### PostgreSQL

```bash
# Connect to PostgreSQL
psql -U postgres -d hibionichand

# Run the schema
\i database-schema-postgresql.sql

# Or from command line
psql -U postgres -d hibionichand -f database-schema-postgresql.sql
```

### MySQL

```bash
# Connect to MySQL
mysql -u root -p hibionichand

# Run the schema
source database-schema-mysql.sql;

# Or from command line
mysql -u root -p hibionichand < database-schema-mysql.sql
```

---

## 📊 Schema Features

### ✅ Production-Ready Features

1. **UUID Primary Keys** - All tables use UUID for better distribution
2. **Foreign Key Constraints** - Referential integrity enforced
3. **Check Constraints** - Data validation at database level
4. **Indexes** - Optimized for common queries
5. **Full-Text Search** - PostgreSQL GIN indexes, MySQL FULLTEXT indexes
6. **Auto-Updated Timestamps** - `updated_at` automatically maintained
7. **Cascade Deletes** - Proper cleanup of related records
8. **Comments** - Table and column documentation

### 🔐 Security Features

- Email format validation
- URL format validation
- Rating range validation (1-5)
- Positive number constraints
- Status enum constraints

### 🌍 Multilanguage Support

All content tables have corresponding translation tables:
- Unique constraint on `(entity_id, language)`
- Supports: English (en), Russian (ru), Armenian (arm)
- Easy to extend to additional languages

---

## 📋 Table Structure Overview

### Users Table
```sql
- id (UUID)
- email (unique)
- password_hash
- role (admin, editor, user)
- first_name, last_name
- avatar_url
- is_active
- timestamps
```

### Products Table
```sql
- id (UUID)
- category_id (FK → product_categories)
- parent_id (FK → products, for hierarchy)
- type (upper_limb, lower_limb)
- slug (unique, SEO-friendly)
- sku
- status (draft, published, archived)
- featured_image_id (FK → media)
- created_by (FK → users)
- timestamps
```

### Product Categories Table
```sql
- id (UUID)
- parent_id (FK → product_categories, for hierarchy)
- slug (unique)
- display_order
- is_active
- timestamps
```

### News Table
```sql
- id (UUID)
- slug (unique)
- featured_image_id (FK → media)
- author_id (FK → users)
- status (draft, published, archived)
- published_at
- views_count
- timestamps
```

### Reviews Table
```sql
- id (UUID)
- product_id (FK → products, nullable)
- author_name
- author_email
- author_avatar_url
- rating (1-5)
- status (pending, approved, rejected)
- is_featured
- timestamps
```

### Partners Table
```sql
- id (UUID)
- name
- logo_id (FK → media)
- website_url
- display_order
- is_active
- timestamps
```

### Media Table
```sql
- id (UUID)
- filename
- original_filename
- mime_type
- file_size
- storage_type (local, s3, cloudinary)
- storage_path
- url
- thumbnail_url
- width, height (for images)
- duration (for videos)
- uploaded_by (FK → users)
- timestamps
```

---

## 🔍 Indexes

### Performance Indexes

All foreign keys are indexed for join performance:
- `idx_products_category_id`
- `idx_products_parent_id`
- `idx_news_author_id`
- `idx_reviews_product_id`
- And many more...

### Composite Indexes

For common query patterns:
- `idx_product_translations_product_lang` - (product_id, language)
- `idx_news_translations_news_lang` - (news_id, language)
- `idx_product_specs_display_order` - (product_id, display_order)

### Full-Text Search

**PostgreSQL:**
- GIN indexes on product_translations (name, description)
- GIN indexes on news_translations (title, content)

**MySQL:**
- FULLTEXT indexes on product_translations (name, description)
- FULLTEXT indexes on news_translations (title, content)

---

## 🔄 Triggers (PostgreSQL Only)

Automatic `updated_at` timestamp updates:
- Trigger function: `update_updated_at_column()`
- Applied to all tables with `updated_at` column
- MySQL uses `ON UPDATE CURRENT_TIMESTAMP` instead

---

## 📝 Data Types

### Enums

- **user_role**: admin, editor, user
- **product_type**: upper_limb, lower_limb
- **product_status**: draft, published, archived
- **news_status**: draft, published, archived
- **review_status**: pending, approved, rejected
- **contact_type**: phone, email, address, social
- **media_type**: image, video
- **storage_type**: local, s3, cloudinary
- **language_code**: en, ru, arm
- **setting_type**: string, number, boolean, json

### UUIDs

All primary keys use UUID:
- **PostgreSQL**: `uuid_generate_v4()`
- **MySQL**: `UUID()` function

### Timestamps

- **PostgreSQL**: `TIMESTAMP WITH TIME ZONE`
- **MySQL**: `TIMESTAMP`
- Both auto-update `updated_at` on row changes

---

## 🔗 Relationships

### One-to-Many
- Users → Products (created_by)
- Users → News (author_id)
- Users → Media (uploaded_by)
- Products → Product Translations
- Products → Product Specs
- Products → Product Media
- News → News Translations
- Reviews → Review Translations
- Partners → Partner Translations
- Contacts → Contact Translations

### Many-to-Many
- Products ↔ Media (via product_media junction table)

### Self-Referential
- Products → Products (parent_id for hierarchy)
- Product Categories → Product Categories (parent_id for hierarchy)

---

## 🛠️ Usage Examples

### Query Product with Translations

```sql
-- PostgreSQL/MySQL
SELECT 
    p.id,
    p.slug,
    p.status,
    pt.name,
    pt.description
FROM products p
INNER JOIN product_translations pt ON p.id = pt.product_id
WHERE p.slug = 'bionic-hand-pro'
  AND pt.language = 'en'
  AND p.status = 'published';
```

### Query Products by Category

```sql
SELECT 
    p.id,
    p.slug,
    pt.name,
    pc.slug as category_slug,
    pct.name as category_name
FROM products p
INNER JOIN product_translations pt ON p.id = pt.product_id
INNER JOIN product_categories pc ON p.category_id = pc.id
INNER JOIN product_category_translations pct ON pc.id = pct.category_id
WHERE pc.slug = 'upper-limb'
  AND pt.language = 'en'
  AND pct.language = 'en'
  AND p.status = 'published'
ORDER BY p.created_at DESC;
```

### Full-Text Search (PostgreSQL)

```sql
SELECT 
    pt.product_id,
    pt.name,
    pt.description
FROM product_translations pt
WHERE to_tsvector('english', pt.name || ' ' || pt.description) 
      @@ to_tsquery('english', 'bionic & hand')
  AND pt.language = 'en';
```

### Full-Text Search (MySQL)

```sql
SELECT 
    pt.product_id,
    pt.name,
    pt.description
FROM product_translations pt
WHERE MATCH(pt.name, pt.description) 
      AGAINST('bionic hand' IN NATURAL LANGUAGE MODE)
  AND pt.language = 'en';
```

---

## 🔒 Security Considerations

1. **Password Hashing**: Store only hashed passwords (bcrypt recommended)
2. **SQL Injection**: Use parameterized queries
3. **Input Validation**: Validate at application level AND database level
4. **Access Control**: Implement row-level security if needed
5. **Backups**: Regular automated backups
6. **Encryption**: Encrypt sensitive data at rest

---

## 📈 Performance Tips

1. **Use Indexes**: All foreign keys and common query fields are indexed
2. **Connection Pooling**: Use connection pooling (PgBouncer, MySQL Connection Pool)
3. **Read Replicas**: Use read replicas for read-heavy operations
4. **Query Optimization**: Use EXPLAIN to analyze query plans
5. **Caching**: Cache frequently accessed data (Redis)
6. **Pagination**: Always paginate large result sets

---

## 🔄 Migration Strategy

### Initial Setup
1. Create database
2. Run schema SQL file
3. Run seed data (if any)
4. Verify all tables and indexes

### Future Migrations
1. Use migration tools (Prisma Migrate, Knex, etc.)
2. Test migrations on staging first
3. Backup production before migration
4. Run migrations during low-traffic periods

---

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [UUID Best Practices](https://www.postgresql.org/docs/current/datatype-uuid.html)

---

## ✅ Checklist Before Production

- [ ] All tables created successfully
- [ ] All indexes created
- [ ] Foreign key constraints working
- [ ] Check constraints validated
- [ ] Triggers functioning (PostgreSQL)
- [ ] Full-text search indexes created
- [ ] Test data inserted
- [ ] Performance tested
- [ ] Backups configured
- [ ] Monitoring set up

---

**Schema Version**: 1.0.0  
**Last Updated**: 2024  
**Compatible With**: PostgreSQL 12+, MySQL 8.0+

