# Setup Guide - hiBionicHand Platform

## Prerequisites

- Node.js 20+ LTS
- PostgreSQL 15+ (or MySQL 8.0+)
- npm or yarn

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/hibionichand?schema=public"

# Generate Prisma client
npm run prisma:generate

# Run database migrations (if using Prisma migrations)
# Or use the SQL schema files directly:
# psql -U postgres -d hibionichand -f ../database-schema-postgresql.sql

# Start development server
npm run dev
```

Backend will run on: `http://localhost:3000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local if needed
# NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:3001`

## Running Both Servers

### Option 1: Manual (Two Terminals)

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

### Option 2: Using npm-run-all (Recommended)

Create a root `package.json`:

```json
{
  "name": "hibionichand",
  "scripts": {
    "dev": "npm-run-all --parallel dev:*",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "install:all": "npm install && cd backend && npm install && cd ../frontend && npm install"
  },
  "devDependencies": {
    "npm-run-all": "^4.1.5"
  }
}
```

Then run:
```bash
npm run dev
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hibionichand"
JWT_SECRET="your-secret-key"
PORT=3000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## Database Setup

### PostgreSQL

1. Create database:
```sql
CREATE DATABASE hibionichand;
```

2. Run schema:
```bash
psql -U postgres -d hibionichand -f database-schema-postgresql.sql
```

### Or use Prisma Migrate:
```bash
cd backend
npx prisma migrate dev --name init
```

## Material-UI Setup

Material-UI is already configured in the frontend. The theme is set up in:
- `frontend/src/theme/theme.ts`
- `frontend/src/app/layout.tsx`

All MUI components are ready to use!

## Project Structure

```
hiBionicHand/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── prisma/
├── frontend/
│   └── src/
│       ├── app/
│       ├── components/
│       └── lib/
└── database-schema-postgresql.sql
```

## Troubleshooting

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Change port with `npm run dev -- -p 3002`

### Database Connection Issues
- Check PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Check database exists

### MUI Styles Not Loading
- Ensure `@emotion/react` and `@emotion/styled` are installed
- Check `ThemeProvider` is wrapping the app

### Module Not Found
- Run `npm install` in both directories
- Clear `.next` folder: `rm -rf frontend/.next`
- Clear node_modules and reinstall

## Next Steps

1. Set up your database
2. Configure environment variables
3. Run both servers
4. Visit `http://localhost:3001` to see the homepage
5. Visit `http://localhost:3001/admin` for admin panel

## Development Commands

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

- Health: `GET http://localhost:3000/health`
- Products: `GET http://localhost:3000/api/v1/products`
- News: `GET http://localhost:3000/api/v1/news`
- Reviews: `GET http://localhost:3000/api/v1/reviews`
- Partners: `GET http://localhost:3000/api/v1/partners`
- Contacts: `GET http://localhost:3000/api/v1/contacts`

Happy coding! 🚀

