# 🚀 Admin Panel Quick Start

## How to Access Admin Panel

### Step 1: Navigate to Admin
Open your browser and go to:
```
http://localhost:3001/admin
```

### Step 2: Login
You'll be redirected to the login page:
```
http://localhost:3001/admin/login
```

### Step 3: Enter Credentials
- **Email**: Use any admin email (e.g., `admin@hibionichand.com`)
- **Password**: Use the password for that user

> **Note**: For development, authentication may be optional. If the backend isn't configured yet, you might be able to access admin pages directly.

## Admin URLs

- **Dashboard**: `http://localhost:3001/admin`
- **Products**: `http://localhost:3001/admin/products`
- **News**: `http://localhost:3001/admin/news`
- **Team**: `http://localhost:3001/admin/team`
- **Partners**: `http://localhost:3001/admin/partners`
- **Reviews**: `http://localhost:3001/admin/reviews`
- **Login**: `http://localhost:3001/admin/login`

## What's Available

✅ **Dashboard** - Overview with statistics  
✅ **Products Management** - Full CRUD  
✅ **News Management** - Full CRUD  
✅ **Team Management** - User list  
✅ **Partners Management** - Full CRUD  
✅ **Reviews Management** - Review moderation  

## Creating Your First Admin User

If you need to create an admin user, you can:

1. **Use Prisma Studio**:
   ```bash
   cd backend
   npm run prisma:studio
   ```
   Then add a user manually in the `users` table.

2. **Use SQL directly**:
   ```sql
   INSERT INTO users (id, email, password_hash, role, is_active)
   VALUES (
     gen_random_uuid(),
     'admin@hibionichand.com',
     '$2b$10$...', -- Use bcrypt to hash your password
     'admin',
     true
   );
   ```

3. **Check if backend has a register endpoint** (if implemented)

## Troubleshooting

**Can't see admin pages?**
- Make sure frontend is running: `npm run dev` in frontend folder
- Check URL: Should be `/admin` not `/en/admin`

**Login not working?**
- Check if backend is running
- Check browser console for errors
- Verify API URL in `.env`

**Want to bypass auth for development?**
- You can modify the admin layout to skip auth checks temporarily
- Or access pages directly via URL

## Next Steps

1. ✅ Access `/admin/login`
2. ✅ Login (or access directly if auth disabled)
3. ✅ Explore the dashboard
4. ✅ Try creating a product or news article
5. ✅ Test all CRUD operations

Enjoy managing your content! 🎉

