# Quick Start Guide

## 🚀 Run Everything at Once

### Option 1: Using the Script (Easiest)
```bash
./start.sh
```

### Option 2: Using npm (Recommended)
```bash
# From root directory
npm run dev
```

This will start both backend and frontend servers simultaneously.

### Option 3: Manual (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 📍 URLs

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health

## ⚙️ First Time Setup

1. **Install Dependencies:**
   ```bash
   npm run install:all
   ```

2. **Setup Backend Environment:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Setup Frontend Environment:**
   ```bash
   cd frontend
   cp .env.local.example .env.local
   # Edit if needed (default should work)
   ```

4. **Setup Database:**
   - Create PostgreSQL database
   - Run the SQL schema: `psql -U postgres -d hibionichand -f database-schema-postgresql.sql`
   - Or use Prisma: `cd backend && npm run prisma:generate`

5. **Start Servers:**
   ```bash
   npm run dev
   ```

## 🎨 Material-UI

Material-UI is already installed and configured! All components are ready to use.

## ✅ Verify Installation

1. Check backend: http://localhost:3000/health
   - Should return: `{"status":"ok","message":"hiBionicHand API is running"}`

2. Check frontend: http://localhost:3001
   - Should show the homepage

3. Check admin panel: http://localhost:3001/admin
   - Should show admin login (if auth is set up)

## 🐛 Troubleshooting

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: `cd frontend && npm run dev -- -p 3002`

### Database Connection Error
- Make sure PostgreSQL is running
- Check `DATABASE_URL` in `backend/.env`
- Verify database exists

### Module Not Found
```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install
```

### MUI Styles Not Working
- Already configured in `frontend/src/app/layout.tsx`
- Check that `@emotion/react` and `@emotion/styled` are installed

## 📚 Next Steps

1. Set up your database
2. Configure environment variables
3. Run `npm run dev`
4. Visit http://localhost:3001
5. Explore the admin panel at http://localhost:3001/admin

Happy coding! 🎉

