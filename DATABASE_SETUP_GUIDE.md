# 🗄️ Database Setup Guide

## Quick Setup Options

You have **3 options** for setting up the database:

### Option 1: SQLite (Easiest - Recommended for Development) ⚡

SQLite requires no installation and works immediately!

1. **Update Prisma schema** to use SQLite:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. **Create `.env` file** in `backend/`:
   ```bash
   cd backend
   cp .env.example .env
   ```

3. **Set DATABASE_URL** in `.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

4. **Run migrations**:
   ```bash
   npm run prisma:migrate
   ```

✅ **Done!** No database server needed.

---

### Option 2: PostgreSQL (Recommended for Production) 🐘

#### Install PostgreSQL on macOS:

**Using Homebrew:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Or download from:**
https://www.postgresql.org/download/macosx/

#### Setup Steps:

1. **Create database**:
   ```bash
   createdb hibionichand
   ```

2. **Create `.env` file** in `backend/`:
   ```bash
   cd backend
   cp .env.example .env
   ```

3. **Set DATABASE_URL** in `.env`:
   ```env
   DATABASE_URL="postgresql://$(whoami)@localhost:5432/hibionichand?schema=public"
   ```
   
   Or if you set a password:
   ```env
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/hibionichand?schema=public"
   ```

4. **Run migrations**:
   ```bash
   npm run prisma:migrate
   ```

---

### Option 3: Cloud Database (No Local Installation) ☁️

Use a free cloud database service:

#### **Neon (PostgreSQL - Free Tier)**
1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Add to `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

#### **Supabase (PostgreSQL - Free Tier)**
1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Add to `.env`

#### **Railway (PostgreSQL - Free Tier)**
1. Sign up at https://railway.app
2. Create PostgreSQL service
3. Copy the connection string
4. Add to `.env`

---

## Step-by-Step: SQLite Setup (Easiest)

### 1. Update Prisma Schema

Edit `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"  // Change from "postgresql" to "sqlite"
  url      = env("DATABASE_URL")
}
```

### 2. Create .env File

```bash
cd backend
touch .env
```

Add this content:
```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### 3. Generate Prisma Client

```bash
cd backend
npm run prisma:generate
```

### 4. Run Migrations

```bash
npm run prisma:migrate
```

When prompted, name your migration: `init`

### 5. Verify Setup

```bash
# Check if database file was created
ls -la backend/dev.db

# Or open Prisma Studio to see your database
npm run prisma:studio
```

---

## Troubleshooting

### PostgreSQL Connection Issues

**Error: "Can't reach database server"**
- Make sure PostgreSQL is running: `brew services list`
- Start it: `brew services start postgresql@15`
- Check connection: `psql -l`

**Error: "database does not exist"**
- Create it: `createdb hibionichand`
- Or connect to default: `psql postgres` then `CREATE DATABASE hibionichand;`

**Error: "password authentication failed"**
- Check your `.env` DATABASE_URL
- Try: `postgresql://$(whoami)@localhost:5432/hibionichand`

### SQLite Issues

**Error: "SQLite database file is locked"**
- Close Prisma Studio if open
- Make sure no other process is using the database

### Migration Issues

**Error: "Migration failed"**
- Check your `.env` file has correct DATABASE_URL
- Make sure Prisma client is generated: `npm run prisma:generate`
- Try resetting: `npx prisma migrate reset` (⚠️ deletes all data)

---

## Next Steps After Setup

1. ✅ Database is set up
2. ✅ Run `npm run prisma:generate` to generate Prisma client
3. ✅ Run `npm run prisma:migrate` to create tables
4. ✅ Start backend: `npm run dev`
5. ✅ Test API: `curl http://localhost:3000/health`

---

## Recommended: Start with SQLite

For development, **SQLite is the easiest option**:
- ✅ No installation needed
- ✅ Works immediately
- ✅ Perfect for development
- ⚠️ Switch to PostgreSQL before production

Would you like me to set up SQLite for you? Just say "yes" and I'll do it automatically!

