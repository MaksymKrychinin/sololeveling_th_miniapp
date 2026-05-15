#!/bin/bash

# Solo Leveling Mini App - Start All Services
# This script starts API, Bot, and Web servers in development mode

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       Solo Leveling Mini App - Starting All...       ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Node.js version is correct
NODE_VERSION=$(node -v)
REQUIRED_VERSION="v22.13.0"

if [[ "$NODE_VERSION" != "$REQUIRED_VERSION" ]]; then
  echo -e "${YELLOW}⚠️  Current Node.js version: $NODE_VERSION${NC}"
  echo -e "${YELLOW}   Required version: $REQUIRED_VERSION${NC}"
  echo ""

  if command -v nvm &> /dev/null; then
    echo -e "${BLUE}🔄 Switching to Node.js $REQUIRED_VERSION using nvm...${NC}"
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm use 22.13.0
  else
    echo -e "${RED}❌ nvm not found. Please install Node.js $REQUIRED_VERSION manually${NC}"
    exit 1
  fi
fi

# Check if .env file exists
if [ ! -f .env ]; then
  echo -e "${RED}❌ .env file not found${NC}"
  echo -e "${YELLOW}   Please create .env file with required environment variables${NC}"
  exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}📦 node_modules not found. Installing dependencies...${NC}"
  pnpm install
fi

# Check if Prisma client is generated
if [ ! -d "node_modules/.prisma/client" ]; then
  echo -e "${YELLOW}🔧 Generating Prisma client...${NC}"
  pnpm db:generate
fi

# Function to cleanup background processes on exit
cleanup() {
  echo ""
  echo -e "${YELLOW}🛑 Stopping all services...${NC}"
  kill 0
  exit
}

trap cleanup SIGINT SIGTERM

# Start services in background
echo -e "${GREEN}🚀 Starting API Server (port 3001)...${NC}"
(cd apps/api && pnpm dev 2>&1 | sed 's/^/[API]    /' &)
API_PID=$!

sleep 2

echo -e "${GREEN}🤖 Starting Telegram Bot...${NC}"
(cd apps/bot && pnpm dev 2>&1 | sed 's/^/[BOT]    /' &)
BOT_PID=$!

sleep 2

echo -e "${GREEN}🌐 Starting Web App (port 3000)...${NC}"
(cd apps/web && pnpm dev 2>&1 | sed 's/^/[WEB]    /' &)
WEB_PID=$!

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              All Services Started!                    ║${NC}"
echo -e "${BLUE}╠═══════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║  ${GREEN}API:${NC}  ${YELLOW}http://localhost:3001${NC}                       ${BLUE}║${NC}"
echo -e "${BLUE}║  ${GREEN}Web:${NC}  ${YELLOW}http://localhost:3000${NC}                       ${BLUE}║${NC}"
echo -e "${BLUE}║  ${GREEN}Bot:${NC}  Running in background                       ${BLUE}║${NC}"
echo -e "${BLUE}╠═══════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║  Press ${RED}Ctrl+C${NC} to stop all services                 ${BLUE}║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Wait for all background processes
wait
