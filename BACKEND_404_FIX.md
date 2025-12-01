# Backend 404 Error - Troubleshooting

## Issue
Getting `404 (Not Found)` when trying to POST to `/api/v1/news`

## Possible Causes

1. **Backend server not running properly**
   - Check if backend is running: `ps aux | grep "tsx watch src/server.ts"`
   - Restart backend: `cd backend && npm run dev`

2. **Port conflict**
   - Backend should be on port 3000
   - Frontend should be on port 3001
   - Check: `lsof -ti:3000` and `lsof -ti:3001`

3. **CORS or routing issue**
   - Backend routes are registered in `backend/src/server.ts`
   - News routes are at `app.use('/api/v1/news', newsRoutes);`

## Quick Fix

1. **Restart the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Verify backend is running:**
   ```bash
   curl http://localhost:3000/health
   ```
   Should return: `{"status":"ok","message":"hiBionicHand API is running"}`

3. **Test the news endpoint:**
   ```bash
   # Get a token first
   TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@hibionichand.com","password":"admin123"}' \
     | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['accessToken'])")
   
   # Test news endpoint
   curl -X POST http://localhost:3000/api/v1/news \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"status":"draft","translations":[{"language":"en","title":"Test","content":"Test"}]}'
   ```

4. **Check frontend API URL:**
   - Make sure `NEXT_PUBLIC_API_URL` is set to `http://localhost:3000/api/v1`
   - Or it defaults to that in `frontend/src/lib/api/client.ts`

## If Still Not Working

Check the backend server logs for any errors when starting up. The server should show:
```
🚀 Server is running on http://localhost:3000
📚 API Documentation: http://localhost:3000/api/v1
```

