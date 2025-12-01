# Quick Reference Guide
## hiBionicHand Platform Architecture

---

## 🚀 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | Next.js | 14+ |
| UI Library | React | 18+ |
| Styling | Tailwind CSS | 3+ |
| Backend Framework | Node.js + Express | 4.18+ |
| Runtime | Node.js | 20+ LTS |
| Database | PostgreSQL | 15+ |
| ORM | Prisma | 5+ |
| File Storage | AWS S3 / Cloudinary | - |
| Cache | Redis | 7+ |
| Language | TypeScript | 5+ |

---

## 📁 Key Directories

### Backend
```
backend/src/
├── auth/          # Authentication & authorization
├── users/         # User management
├── products/      # Product CRUD
├── news/          # News articles
├── reviews/       # Product reviews
├── partners/      # Partner management
├── contacts/      # Contact information
├── media/         # File uploads
├── translations/  # i18n support
└── admin/         # Admin panel API
```

### Frontend
```
frontend/src/
├── app/           # Next.js pages (App Router)
├── components/    # React components
│   ├── ui/        # Base components
│   ├── products/  # Product components
│   ├── news/      # News components
│   ├── admin/     # Admin components
│   └── shared/    # Shared components
├── lib/           # Utilities & hooks
└── types/         # TypeScript definitions
```

---

## 🌐 Supported Languages

- **en** - English
- **ru** - Russian
- **arm** - Armenian

All content entities support translations via separate translation tables.

---

## 🔑 Key Features

### Product System
- Hierarchical structure (parent → children)
- Types: Upper Limb, Lower Limb
- Multilanguage support
- Media gallery (images + videos)
- Specifications system
- SEO-friendly URLs (slugs)

### Content Management
- News module with categories
- Reviews with rating system
- Partners showcase
- Contact forms
- Media library

### Admin Panel
- Dashboard with analytics
- Product management
- News editor
- Review moderation
- Media uploader
- Translation management
- User management

---

## 📊 Database Entities

| Entity | Purpose | Key Fields |
|--------|---------|------------|
| **users** | Authentication | email, role, password_hash |
| **products** | Product catalog | type, parent_id, slug, status |
| **product_translations** | Product i18n | name, description, language |
| **news** | Blog/articles | slug, author_id, published_at |
| **news_translations** | News i18n | title, content, language |
| **reviews** | Product reviews | rating, status, product_id |
| **partners** | Partner info | name, logo_id, website_url |
| **contacts** | Contact details | type, value |
| **media** | File storage | filename, url, storage_type |
| **settings** | Configuration | key, value (JSONB) |

---

## 🔐 Authentication Flow

1. User submits credentials
2. Backend validates → generates JWT
3. Frontend stores token (httpOnly cookie)
4. Protected routes check token
5. Refresh token for extended sessions

**Roles:**
- `admin` - Full access
- `editor` - Content management
- `user` - Public access

---

## 📤 File Upload Flow

1. Frontend: User selects file
2. Backend: Validates file (type, size)
3. Storage: Uploads to S3/Cloudinary
4. Database: Saves media record
5. Response: Returns media URL

**Supported:**
- Images: JPG, PNG, WebP, GIF
- Videos: MP4, WebM
- Max size: Configurable per type

---

## 🎨 Component Structure

### Atomic Design Pattern
```
Atoms → Molecules → Organisms → Templates → Pages

Button (atom)
  → SearchBar (molecule)
    → Header (organism)
      → Layout (template)
        → HomePage (page)
```

---

## 🔄 API Endpoints Structure

```
/api/v1/
├── auth/
│   ├── POST /login
│   ├── POST /register
│   └── POST /refresh
├── products/
│   ├── GET /              # List products
│   ├── GET /:slug         # Get product
│   ├── POST /             # Create (admin)
│   ├── PUT /:id           # Update (admin)
│   └── DELETE /:id        # Delete (admin)
├── news/
│   ├── GET /
│   ├── GET /:slug
│   └── ... (CRUD)
├── reviews/
│   ├── GET /
│   ├── POST /             # Submit review
│   └── ... (CRUD)
├── partners/
│   └── GET /
├── contacts/
│   ├── GET /
│   └── POST /submit       # Contact form
└── media/
    ├── POST /upload
    └── GET /:id
```

---

## 🧪 Testing Strategy

### Backend
- Unit tests: Services, utilities
- Integration tests: API endpoints
- E2E tests: Critical user flows

### Frontend
- Component tests: React Testing Library
- E2E tests: Playwright
- Visual regression: Chromatic (optional)

---

## 🚢 Deployment

### Environments
- **Development**: Local Docker
- **Staging**: Cloud provider (Vercel/Railway)
- **Production**: Cloud provider with CDN

### CI/CD Pipeline
1. Code push → GitHub
2. Run tests
3. Build Docker images
4. Deploy to staging
5. Manual approval
6. Deploy to production

---

## 📈 Performance Targets

- **Page Load**: < 2s (First Contentful Paint)
- **API Response**: < 200ms (p95)
- **Image Load**: < 1s (with optimization)
- **Database Query**: < 50ms (p95)

---

## 🔒 Security Checklist

- [x] JWT authentication
- [x] Role-based access control
- [x] Input validation (Zod)
- [x] SQL injection prevention (Prisma)
- [x] XSS protection (React escaping)
- [x] CSRF tokens
- [x] File upload validation
- [x] Rate limiting
- [x] HTTPS only
- [x] Environment variable security

---

## 📝 Development Commands

### Backend
```bash
npm run start:dev      # Development server
npm run build          # Build for production
npm run test           # Run tests
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run migrations
npm run prisma:seed     # Seed database
```

### Frontend
```bash
npm run dev            # Development server
npm run build          # Production build
npm run start          # Start production server
npm run test           # Run tests
npm run lint           # Lint code
```

---

## 🐛 Common Issues & Solutions

### Database Connection
- Check `.env` file for DATABASE_URL
- Ensure PostgreSQL is running
- Verify network access

### File Uploads
- Check AWS credentials (if using S3)
- Verify file size limits
- Check CORS settings

### i18n Routing
- Ensure locale is in URL path
- Check `next.config.js` i18n config
- Verify translation files exist

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 🎯 Next Steps

1. Set up project structure
2. Initialize database with Prisma
3. Create authentication system
4. Build product module
5. Implement admin panel
6. Add multilanguage support
7. Deploy to staging
8. Performance optimization
9. Security audit
10. Production deployment

