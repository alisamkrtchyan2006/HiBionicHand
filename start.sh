#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting hiBionicHand Platform...${NC}\n"

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  Backend .env file not found. Creating from .env.example...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your database credentials!${NC}\n"
fi

if [ ! -f "frontend/.env.local" ]; then
    if [ -f "frontend/.env.local.example" ]; then
        echo -e "${YELLOW}⚠️  Frontend .env.local file not found. Creating from .env.local.example...${NC}"
        cp frontend/.env.local.example frontend/.env.local
        echo -e "${YELLOW}⚠️  Please edit frontend/.env.local if needed!${NC}\n"
    else
        echo -e "${YELLOW}⚠️  Frontend .env.local file not found. Creating minimal .env.local...${NC}"
        echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1" > frontend/.env.local
        echo -e "${GREEN}✅ Created frontend/.env.local with default API URL${NC}"
        echo -e "${YELLOW}💡 Note: SMTP credentials are optional. Contact forms will work without them.${NC}\n"
    fi
fi

# Start backend
echo -e "${GREEN}📦 Starting Backend Server...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
echo -e "${GREEN}🎨 Starting Frontend Server...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo -e "\n${GREEN}✅ Both servers are starting!${NC}\n"
echo -e "${BLUE}Backend:${NC} http://localhost:3000"
echo -e "${BLUE}Frontend:${NC} http://localhost:3001"
echo -e "\n${YELLOW}Press Ctrl+C to stop both servers${NC}\n"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait

