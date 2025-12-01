# 🚀 Quick Database Setup

I've created a `.env` file for you! Now you need to set up PostgreSQL.

## Option 1: Install PostgreSQL (Recommended)

### macOS Installation:

```bash
# Install PostgreSQL using Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create the database
createdb hibionichand
```

### Update .env file:

The `.env` file is already created. You just need to update the `DATABASE_URL`:

```bash
cd backend
```

Edit `.env` and change:
```env
DATABASE_URL="postgresql://$(whoami)@localhost:5432/hibionichand?schema=public"
```

Or if PostgreSQL has a password:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/hibionichand?schema=public"
```

## Option 2: Use Free Cloud Database (No Installation!)

### Neon (Recommended - Free PostgreSQL):

1. Go to https://neon.tech
2. Sign up (free)
3. Create a new project
4. Copy the connection string
5. Update `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

### Supabase (Free PostgreSQL):

1. Go to https://supabase.com
2. Sign up (free)
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string
6. Update `.env`

## After Setting Up Database:

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# When prompted, name it: init
```

## Quick Test:

```bash
# Check if database is connected
npm run prisma:studio
```

This opens a visual database browser!

---

**Need help?** Tell me which option you prefer and I'll guide you through it!

