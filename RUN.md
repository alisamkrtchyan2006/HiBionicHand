# 🚀 How to Run the Project

## Quick Start (Easiest Way)

### 1. Install All Dependencies
```bash
npm run install:all
```

### 2. Setup Environment Files
The `.env` files are already created with defaults. Edit them if needed:
- `backend/.env` - Database and JWT configuration
- `frontend/.env.local` - API URL configuration

### 3. Run Both Servers
```bash
npm run dev
```

This will start:
- **Backend** on http://localhost:3000
- **Frontend** on http://localhost:3001

## Alternative Methods

### Method 1: Using the Shell Script
```bash
./start.sh
```

### Method 2: Run Separately

**Terminal 1:**
```bash
cd backend
npm run dev
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

## 📋 Prerequisites

Before running, make sure you have:

1. **Node.js 20+** installed
2. **PostgreSQL** running (or update DATABASE_URL in backend/.env)
3. **Database created** (or it will be created on first run with Prisma)

## 🎯 What You'll See

1. **Homepage**: http://localhost:3001
   - Beautiful homepage with hero section
   - Technology features
   - User reviews
   - Team members

2. **Admin Panel**: http://localhost:3001/admin
   - Products management
   - News management
   - Reviews management
   - Partners management
   - Team management

3. **API**: http://localhost:3000/api/v1
   - RESTful API endpoints
   - Health check: http://localhost:3000/health

## 🛠️ Material-UI

Material-UI is fully installed and configured! All components use MUI styling.

## ⚠️ Important Notes

1. **Database**: You need to set up PostgreSQL and update `DATABASE_URL` in `backend/.env`
2. **First Run**: The backend will need Prisma client generated:
   ```bash
   cd backend
   npm run prisma:generate
   ```
3. **Ports**: If ports 3000 or 3001 are in use, change them in the respective `.env` files

## 🐛 Troubleshooting

### "Cannot find module"
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

### "Port already in use"
- Backend: Change `PORT=3000` in `backend/.env`
- Frontend: Run `npm run dev -- -p 3002` in frontend directory

### "Database connection error"
- Make sure PostgreSQL is running
- Check `DATABASE_URL` in `backend/.env`
- Create the database: `CREATE DATABASE hibionichand;`

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Backend shows: `🚀 Server is running on http://localhost:3000`
- ✅ Frontend shows: `Ready on http://localhost:3001`
- ✅ You can access http://localhost:3001 and see the homepage
- ✅ http://localhost:3000/health returns JSON response

Enjoy! 🎉

