# Port Conflict Issue - Fix

## Problem
Next.js frontend is running on port 3000, but the backend should be on port 3000. This causes 404 errors when the frontend tries to call the backend API.

## Solution

**The backend should be on port 3000, and the frontend should be on port 3001.**

### Quick Fix:

1. **Stop all running servers:**
   ```bash
   # Kill processes on ports 3000 and 3001
   lsof -ti:3000 | xargs kill -9
   lsof -ti:3001 | xargs kill -9
   ```

2. **Start backend first (port 3000):**
   ```bash
   cd backend
   npm run dev
   ```
   Wait until you see: `🚀 Server is running on http://localhost:3000`

3. **In a NEW terminal, start frontend (port 3001):**
   ```bash
   cd frontend
   PORT=3001 npm run dev
   ```
   Or create `frontend/.env.local` with:
   ```
   PORT=3001
   ```

4. **Or use the start script:**
   ```bash
   ./start.sh
   ```

### Verify:

- Backend: `curl http://localhost:3000/health` should return JSON
- Frontend: `http://localhost:3001` should show the website
- API calls from frontend should go to `http://localhost:3000/api/v1/*`

### If Frontend Keeps Using Port 3000:

Create `frontend/.env.local`:
```
PORT=3001
```

Then restart the frontend.

