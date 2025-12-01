# 🎯 How to Access Admin Panel

## Quick Access

Simply open your browser and navigate to:

```
http://localhost:3001/admin
```

Or directly to the login page:

```
http://localhost:3001/admin/login
```

## Admin Routes (No Locale Prefix Needed)

All admin routes work **without** locale prefix:

- ✅ `/admin` - Dashboard
- ✅ `/admin/login` - Login page
- ✅ `/admin/products` - Products management
- ✅ `/admin/news` - News management
- ✅ `/admin/team` - Team management
- ✅ `/admin/partners` - Partners management
- ✅ `/admin/reviews` - Reviews management

## Important Notes

1. **Admin routes are separate from locale routes**
   - Public pages: `/en/products`, `/ru/products`, `/arm/products`
   - Admin pages: `/admin/products` (no locale)

2. **Middleware Configuration**
   - Admin routes (`/admin/*`) are excluded from i18n middleware
   - They work independently of language routing

3. **Authentication**
   - Login page: `/admin/login`
   - Token stored in `localStorage`
   - Auto-redirect on 401 errors

## Step-by-Step

1. **Start the servers** (if not running):
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Open browser**:
   ```
   http://localhost:3001/admin
   ```

3. **You'll see**:
   - If not logged in: Login page
   - If logged in: Admin dashboard

4. **Login** (if needed):
   - Email: Your admin email
   - Password: Your admin password
   - Click "Sign In"

5. **Navigate**:
   - Use sidebar to access different sections
   - Click on dashboard cards for quick navigation

## Troubleshooting

### Can't Access `/admin`

**Problem**: Getting 404 or redirect

**Solution**:
1. Check if frontend is running: `npm run dev` in frontend folder
2. Clear browser cache
3. Check URL: Should be `/admin` not `/en/admin`
4. Check middleware is excluding admin routes

### Login Not Working

**Problem**: Can't login

**Solution**:
1. Check backend is running: `http://localhost:3000/health`
2. Check API URL in `.env`: `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1`
3. Check browser console for errors
4. Verify user exists in database

### See Login Page But Want Dashboard

**Problem**: Always redirected to login

**Solution**:
1. Check if token exists: Open console → `localStorage.getItem('token')`
2. If no token, login first
3. If token exists but still redirects, check backend auth endpoint

## Direct URLs

Copy and paste these in your browser:

- Dashboard: `http://localhost:3001/admin`
- Login: `http://localhost:3001/admin/login`
- Products: `http://localhost:3001/admin/products`
- News: `http://localhost:3001/admin/news`
- Team: `http://localhost:3001/admin/team`
- Partners: `http://localhost:3001/admin/partners`
- Reviews: `http://localhost:3001/admin/reviews`

## That's It! 🎉

Just go to `http://localhost:3001/admin` and you're there!

