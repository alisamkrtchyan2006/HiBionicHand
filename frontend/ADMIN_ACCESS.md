# 🔐 Admin Panel Access Guide

## How to Access the Admin Panel

### Option 1: Direct URL Access
Simply navigate to:
```
http://localhost:3001/admin
```

If you're not logged in, you'll be redirected to:
```
http://localhost:3001/admin/login
```

### Option 2: Login Page
Navigate directly to the login page:
```
http://localhost:3001/admin/login
```

## Admin Routes

All admin routes are accessible at `/admin/*` (no locale prefix needed):

- **Dashboard**: `/admin`
- **Products**: `/admin/products`
- **News**: `/admin/news`
- **Team**: `/admin/team`
- **Partners**: `/admin/partners`
- **Reviews**: `/admin/reviews`

## Authentication

### Current Setup
The admin panel currently has a **login page** but authentication is **optional** for development. The backend should have authentication endpoints configured.

### Backend Authentication Endpoint
```
POST /api/v1/auth/login
Body: {
  "email": "admin@example.com",
  "password": "password123"
}
```

### Token Storage
- Token is stored in `localStorage` with key `token`
- Token is automatically added to API requests via `apiClient`
- Token is cleared on logout

## Creating an Admin User

To create an admin user, you need to:

1. **Via Database** (PostgreSQL/MySQL):
   ```sql
   INSERT INTO users (id, email, password_hash, role, is_active, created_at, updated_at)
   VALUES (
     gen_random_uuid(), -- or UUID() for MySQL
     'admin@hibionichand.com',
     '$2b$10$...', -- bcrypt hash of password
     'admin',
     true,
     NOW(),
     NOW()
   );
   ```

2. **Via Backend API** (if register endpoint exists):
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@hibionichand.com",
       "password": "yourpassword",
       "role": "admin"
     }'
   ```

3. **Via Prisma Studio**:
   ```bash
   cd backend
   npm run prisma:studio
   ```
   Then manually create a user in the `users` table.

## Default Credentials (Development)

For development, you can use any credentials if the backend is configured to accept them. The login page will attempt to authenticate against:

```
POST http://localhost:3000/api/v1/auth/login
```

## Features Available

Once logged in, you can:

1. **Dashboard** (`/admin`)
   - View statistics
   - Quick navigation to all sections

2. **Products Management** (`/admin/products`)
   - List all products
   - Create new products
   - Edit existing products
   - Delete products

3. **News Management** (`/admin/news`)
   - List all news articles
   - Create new articles
   - Edit existing articles
   - Delete articles

4. **Team Management** (`/admin/team`)
   - List all users/team members
   - View user details
   - Edit user information

5. **Partners Management** (`/admin/partners`)
   - List all partners
   - Create new partners
   - Edit existing partners
   - Delete partners

6. **Reviews Management** (`/admin/reviews`)
   - List all reviews
   - Edit review status
   - Mark reviews as featured
   - Delete reviews

## Troubleshooting

### Can't Access Admin Panel

1. **Check if backend is running**:
   ```bash
   curl http://localhost:3000/health
   ```

2. **Check if frontend is running**:
   ```bash
   curl http://localhost:3001
   ```

3. **Check browser console** for errors

4. **Verify API URL** in `.env`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
   ```

### Login Not Working

1. **Check backend auth endpoint**:
   ```bash
   curl -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test"}'
   ```

2. **Check if user exists in database**

3. **Verify JWT_SECRET is set** in backend `.env`

4. **Check browser Network tab** for API errors

### Token Issues

- Token is stored in `localStorage`
- Clear token: Open browser console → `localStorage.removeItem('token')`
- Check token: `localStorage.getItem('token')`

## Security Notes

⚠️ **For Production**:
- Implement proper authentication middleware
- Add route protection
- Use httpOnly cookies for tokens
- Implement refresh token mechanism
- Add rate limiting
- Add CSRF protection

## Quick Start

1. **Start backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Navigate to admin**:
   ```
   http://localhost:3001/admin
   ```

4. **Login** (or access directly if auth is disabled for dev)

5. **Start managing content!**

