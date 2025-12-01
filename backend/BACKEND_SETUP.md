# 🔧 Backend Setup & Troubleshooting

## Current Issues: 500 Internal Server Error

The backend is returning 500 errors, which typically means:

1. **Database not connected** - Most likely cause
2. **Prisma client not generated**
3. **Database not migrated/created**
4. **Missing environment variables**

## Quick Fix Steps

### 1. Check Database Connection

Create a `.env` file in the `backend` folder:

```bash
cd backend
touch .env
```

Add your database URL:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hibionichand?schema=public"
```

Or for MySQL:
```env
DATABASE_URL="mysql://user:password@localhost:3306/hibionichand"
```

### 2. Generate Prisma Client

```bash
cd backend
npm run prisma:generate
```

### 3. Run Database Migrations

```bash
npm run prisma:migrate
```

Or if database doesn't exist yet:
```bash
# For PostgreSQL
createdb hibionichand

# Then run migrations
npm run prisma:migrate
```

### 4. Check Backend Logs

Look at the terminal where backend is running for error messages. Common errors:

- `Can't reach database server` → Database not running or wrong connection string
- `Prisma Client not generated` → Run `npm run prisma:generate`
- `Table does not exist` → Run `npm run prisma:migrate`

## Temporary Solution: Graceful Error Handling

The controllers now handle database connection errors gracefully and return empty arrays instead of 500 errors. This allows the frontend to work even if the database isn't set up yet.

## Testing Backend

### 1. Health Check
```bash
curl http://localhost:3000/health
```

Should return:
```json
{"status":"ok","message":"hiBionicHand API is running"}
```

### 2. Test Products Endpoint
```bash
curl http://localhost:3000/api/v1/products?page=1&limit=10&language=en
```

### 3. Check Backend Terminal
Look for error messages that indicate what's wrong.

## Common Solutions

### Database Not Running
```bash
# PostgreSQL
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Linux

# MySQL
brew services start mysql  # macOS
sudo systemctl start mysql  # Linux
```

### Prisma Client Not Generated
```bash
cd backend
npm run prisma:generate
```

### Database Doesn't Exist
```bash
# PostgreSQL
createdb hibionichand

# MySQL
mysql -u root -p
CREATE DATABASE hibionichand;
```

### Wrong Connection String
Check your `.env` file matches your database setup.

## Next Steps

1. ✅ Set up `.env` file with `DATABASE_URL`
2. ✅ Generate Prisma client: `npm run prisma:generate`
3. ✅ Run migrations: `npm run prisma:migrate`
4. ✅ Restart backend server
5. ✅ Test endpoints

The frontend will now show empty data instead of errors if the database isn't connected, which is better for development!

