# Backend Server Not Running - Quick Fix

## Error
`ERR_CONNECTION_REFUSED` when trying to access `http://localhost:3000/api/v1/news`

This means the backend server is not running.

## Solution

### Option 1: Start Backend Manually

1. **Open a new terminal window**

2. **Navigate to backend directory:**
   ```bash
   cd /Users/alisamkrtchyan/Desktop/hiBionicHand/backend
   ```

3. **Start the backend server:**
   ```bash
   npm run dev
   ```

4. **Wait for this message:**
   ```
   🚀 Server is running on http://localhost:3000
   📚 API Documentation: http://localhost:3000/api/v1
   ```

5. **Verify it's working:**
   ```bash
   curl http://localhost:3000/health
   ```
   Should return: `{"status":"ok","message":"hiBionicHand API is running"}`

### Option 2: Use the Start Script

From the project root:
```bash
cd /Users/alisamkrtchyan/Desktop/hiBionicHand
./start.sh
```

This will start both backend and frontend.

### Option 3: Start Both Separately

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
PORT=3001 npm run dev
```

## Important

- **Backend** must run on **port 3000**
- **Frontend** should run on **port 3001**
- Keep the backend terminal window open while developing

## Verify Backend is Running

After starting, test:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/v1/news?page=1&limit=1
```

Both should return JSON responses (not errors).

