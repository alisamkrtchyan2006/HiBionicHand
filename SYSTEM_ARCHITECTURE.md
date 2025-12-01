# System Architecture Flow
## hiBionicHand Platform

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Web App    │  │  Admin Panel │  │  Mobile Web  │          │
│  │  (Next.js)   │  │  (Next.js)   │  │  (Next.js)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                  │                  │
│         └──────────────────┼──────────────────┘                  │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                             │ HTTPS/REST API
                             │
┌────────────────────────────┼──────────────────────────────────────┐
│                    API GATEWAY LAYER                              │
├────────────────────────────┼──────────────────────────────────────┤
│                            │                                      │
│  ┌──────────────────────────────────────────────────────┐        │
│  │              Nginx / Load Balancer                    │        │
│  │  - Rate Limiting                                      │        │
│  │  - SSL Termination                                    │        │
│  │  - Request Routing                                    │        │
│  └──────────────────────────────────────────────────────┘        │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                             │
┌────────────────────────────┼──────────────────────────────────────┐
│                    APPLICATION LAYER                              │
├────────────────────────────┼──────────────────────────────────────┤
│                            │                                      │
│  ┌──────────────────────────────────────────────────────┐        │
│  │              Node.js/Express Application              │        │
│  │                                                        │        │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │        │
│  │  │   Auth   │  │ Products │  │   News   │           │        │
│  │  │  Module  │  │  Module  │  │  Module  │           │        │
│  │  └──────────┘  └──────────┘  └──────────┘           │        │
│  │                                                        │        │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │        │
│  │  │ Reviews  │  │ Partners │  │ Contacts │           │        │
│  │  │  Module  │  │  Module  │  │  Module  │           │        │
│  │  └──────────┘  └──────────┘  └──────────┘           │        │
│  │                                                        │        │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │        │
│  │  │  Media   │  │    i18n   │  │  Admin   │           │        │
│  │  │  Module  │  │  Module   │  │  Module  │           │        │
│  │  └──────────┘  └──────────┘  └──────────┘           │        │
│  └──────────────────────────────────────────────────────┘        │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                             │
┌────────────────────────────┼──────────────────────────────────────┐
│                      DATA LAYER                                   │
├────────────────────────────┼──────────────────────────────────────┤
│                            │                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  PostgreSQL  │  │    Redis     │  │  AWS S3 /    │          │
│  │   Database   │  │    Cache     │  │  Cloudinary  │          │
│  │              │  │              │  │              │          │
│  │  - Prisma    │  │  - Sessions  │  │  - Images    │          │
│  │  - Migrations│  │  - Cache     │  │  - Videos    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
```

---

## Request Flow: User Views Product

```
1. User Request
   │
   ├─> Browser: GET /en/products/bionic-hand-pro
   │
2. Next.js Frontend
   │
   ├─> App Router: /[locale]/products/[slug]/page.tsx
   │
   ├─> Component: ProductDetail
   │   │
   │   ├─> Hook: useProduct(slug, locale)
   │   │
   │   └─> API Call: GET /api/v1/products/:slug?lang=en
   │
3. API Gateway (Nginx)
   │
   ├─> Rate Limiting Check
   ├─> SSL Termination
   └─> Route to: Node.js/Express Backend
   │
4. Node.js/Express Backend
   │
   ├─> productsController.getBySlug()
   │   │
   │   ├─> Validation: slug, language
   │   │
   │   ├─> productsService.findOne()
   │   │   │
   │   │   ├─> Check Redis Cache
   │   │   │   └─> Cache Hit? Return cached data
   │   │   │
   │   │   ├─> productsRepository.findBySlug()
   │   │   │   │
   │   │   │   └─> Prisma Query:
   │   │   │       - products (where: slug)
   │   │   │       - product_translations (where: language)
   │   │   │       - product_media
   │   │   │       - product_specs
   │   │   │
   │   │   ├─> Cache Result in Redis (TTL: 1 hour)
   │   │   │
   │   │   └─> Return Product Data
   │   │
   │   └─> Response: JSON Product Object
   │
5. Frontend Receives Data
   │
   ├─> React Query Cache Update
   │
   ├─> Component Re-render with Data
   │
   └─> Display: ProductDetail Component
       - ProductGallery
       - ProductSpecs
       - ProductDescription
```

---

## Request Flow: Admin Uploads Media

```
1. Admin Action
   │
   ├─> Admin Panel: MediaUploader Component
   │
   ├─> User selects file (image/video)
   │
   └─> FormData upload
   │
2. Frontend Upload
   │
   ├─> POST /api/v1/media/upload
   │   Headers: Authorization: Bearer <JWT>
   │   Body: FormData (file)
   │
3. API Gateway
   │
   ├─> Authentication Check
   ├─> Role Check (admin/editor)
   └─> Route to: Node.js/Express Backend
   │
4. Node.js/Express Backend
   │
   ├─> mediaController.upload()
   │   │
   │   ├─> authMiddleware: Verify token
   │   ├─> rolesMiddleware: Check admin/editor role
   │   │
   │   ├─> mediaService.upload()
   │   │   │
   │   │   ├─> Validation:
   │   │   │   - File type (image/video)
   │   │   │   - File size (< 50MB)
   │   │   │   - MIME type check
   │   │   │
   │   │   ├─> StorageService.upload()
   │   │   │   │
   │   │   │   ├─> If S3:
   │   │   │   │   - Generate unique filename
   │   │   │   │   - Upload to S3 bucket
   │   │   │   │   - Get public URL
   │   │   │   │
   │   │   │   ├─> If Cloudinary:
   │   │   │   │   - Upload with optimization
   │   │   │   │   - Generate thumbnail
   │   │   │   │   - Get URLs
   │   │   │   │
   │   │   │   └─> Return: storage info
   │   │   │
   │   │   ├─> MediaRepository.create()
   │   │   │   │
   │   │   │   └─> Prisma: Create media record
   │   │   │       - Save filename
   │   │   │       - Save URL
   │   │   │       - Save metadata
   │   │   │       - Link to user
   │   │   │
   │   │   └─> Return: Media object with ID
   │   │
   │   └─> Response: 201 Created + Media JSON
   │
5. Frontend Receives Response
   │
   ├─> Update Media Library
   ├─> Show success notification
   └─> Refresh media list
```

---

## Authentication Flow

```
1. User Login
   │
   ├─> POST /api/v1/auth/login
   │   Body: { email, password }
   │
2. Node.js/Express Auth Module
   │
   ├─> authController.login()
   │   │
   │   ├─> authService.validateUser()
   │   │   │
   │   │   ├─> Find user by email (Prisma)
   │   │   │
   │   │   ├─> Compare password (bcrypt)
   │   │   │
   │   │   └─> Return user or null
   │   │
   │   ├─> If valid:
   │   │   │
   │   │   ├─> Generate JWT Access Token (15 min)
   │   │   │
   │   │   ├─> Generate Refresh Token (7 days)
   │   │   │
   │   │   ├─> Store refresh token in Redis
   │   │   │   Key: refresh_token:{userId}
   │   │   TTL: 7 days
   │   │
   │   │   └─> Return: { accessToken, refreshToken, user }
   │   │
   │   └─> If invalid: 401 Unauthorized
   │
3. Frontend
   │
   ├─> Store tokens:
   │   - accessToken: Memory/State
   │   - refreshToken: httpOnly Cookie
   │
   ├─> Set Authorization header for future requests
   │
   └─> Redirect to admin panel
```

---

## Multilanguage Flow

```
1. User Visits Site
   │
   ├─> URL: /en/products or /ru/products or /arm/products
   │
2. Next.js i18n Routing
   │
   ├─> Extract locale from URL
   │
   ├─> Load translation files:
   │   - /locales/en/common.json
   │   - /locales/ru/common.json
   │   - /locales/arm/common.json
   │
3. API Request
   │
   ├─> Include locale in query: ?lang=en
   │
4. Backend Processing
   │
   ├─> ProductsService.findOne()
   │   │
   │   ├─> Query product (base table)
   │   │
   │   ├─> Query product_translations
   │   │   WHERE product_id = ? AND language = 'en'
   │   │
   │   ├─> Merge base + translation data
   │   │
   │   └─> Return localized product
   │
5. Frontend Display
   │
   ├─> Use translation hook: useTranslation()
   │
   ├─> Display localized content:
   │   - Product name (from API)
   │   - UI labels (from i18n files)
   │
   └─> Language switcher updates URL
```

---

## Caching Strategy

```
┌─────────────────────────────────────────────────────────┐
│                    Caching Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Browser Cache                                       │
│     - Static assets (images, CSS, JS)                   │
│     - Cache-Control headers                             │
│                                                          │
│  2. CDN Cache (CloudFront/Cloudflare)                   │
│     - Static files                                      │
│     - Media files                                       │
│     - Edge caching                                      │
│                                                          │
│  3. Next.js Cache                                       │
│     - Static page generation                            │
│     - ISR (Incremental Static Regeneration)             │
│     - API route caching                                 │
│                                                          │
│  4. Redis Cache                                         │
│     - API responses (products, news)                    │
│     - User sessions                                     │
│     - Refresh tokens                                    │
│     - TTL: 1 hour (configurable)                        │
│                                                          │
│  5. Database Query Cache                                │
│     - PostgreSQL query cache                            │
│     - Prisma connection pooling                        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Scalability Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Horizontal Scaling Strategy                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Load Balancer (Nginx)                                  │
│         │                                                │
│         ├──> Node.js Instance 1 (Port 3000)             │
│         ├──> Node.js Instance 2 (Port 3001)             │
│         ├──> Node.js Instance 3 (Port 3002)             │
│         └──> Node.js Instance N (Port 300N)             │
│                                                          │
│  Database: PostgreSQL                                   │
│         │                                                │
│         ├──> Primary (Write)                           │
│         ├──> Replica 1 (Read)                           │
│         ├──> Replica 2 (Read)                           │
│         └──> Replica N (Read)                           │
│                                                          │
│  Redis Cluster                                          │
│         │                                                │
│         ├──> Redis Node 1                               │
│         ├──> Redis Node 2                               │
│         └──> Redis Node 3                               │
│                                                          │
│  File Storage: S3                                       │
│         │                                                │
│         └──> Multiple regions for CDN                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                  Security Architecture                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Network Layer                                       │
│     - HTTPS/TLS encryption                              │
│     - DDoS protection (Cloudflare)                      │
│     - Firewall rules                                    │
│                                                          │
│  2. Application Layer                                   │
│     - JWT authentication                                │
│     - Role-based access control (RBAC)                  │
│     - Input validation (Zod)                           │
│     - SQL injection prevention (Prisma)                 │
│     - XSS protection (React escaping)                   │
│     - CSRF tokens                                       │
│     - Rate limiting                                     │
│                                                          │
│  3. Data Layer                                          │
│     - Encrypted database connections                    │
│     - Password hashing (bcrypt)                         │
│     - Sensitive data encryption                         │
│     - Database backups                                  │
│                                                          │
│  4. File Upload Security                                │
│     - File type validation                              │
│     - File size limits                                  │
│     - Virus scanning (optional)                          │
│     - Secure file storage (S3 with private buckets)     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Production Environment                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────┐              │
│  │         CI/CD Pipeline                │              │
│  │  GitHub → Tests → Build → Deploy     │              │
│  └──────────────────────────────────────┘              │
│                                                          │
│  ┌──────────────────────────────────────┐              │
│  │      Frontend (Vercel/Netlify)        │              │
│  │  - Next.js build                     │              │
│  │  - Edge functions                    │              │
│  │  - CDN distribution                  │              │
│  └──────────────────────────────────────┘              │
│                                                          │
│  ┌──────────────────────────────────────┐              │
│  │    Backend (AWS/Railway/DigitalOcean)│              │
│  │  - Docker containers                 │              │
│  │  - Auto-scaling                      │              │
│  │  - Load balancing                   │              │
│  └──────────────────────────────────────┘              │
│                                                          │
│  ┌──────────────────────────────────────┐              │
│  │      Database (Managed PostgreSQL)    │              │
│  │  - Automated backups                 │              │
│  │  - Read replicas                     │              │
│  │  - Point-in-time recovery            │              │
│  └──────────────────────────────────────┘              │
│                                                          │
│  ┌──────────────────────────────────────┐              │
│  │      Storage (AWS S3)                 │              │
│  │  - Media files                       │              │
│  │  - CDN integration                   │              │
│  └──────────────────────────────────────┘              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

This architecture provides a robust, scalable, and secure foundation for the hiBionicHand platform.

