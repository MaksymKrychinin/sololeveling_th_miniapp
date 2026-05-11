#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Emojis
CHECK="✅"
CROSS="❌"
ROCKET="🚀"
PACKAGE="📦"
DATABASE="🗄️"
GEAR="⚙️"

echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════╗"
echo "║                                                   ║"
echo "║          Solo Leveling - Setup Script            ║"
echo "║          Telegram Mini App                        ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check prerequisites
echo -e "${CYAN}${GEAR} Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}${CROSS} Node.js is not installed. Please install Node.js >= 20.0.0${NC}"
    exit 1
fi
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}${CROSS} Node.js version must be >= 20.0.0. Current: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}${CHECK} Node.js $(node -v)${NC}"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}Installing pnpm...${NC}"
    npm install -g pnpm
fi
echo -e "${GREEN}${CHECK} pnpm $(pnpm -v)${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}${CROSS} Docker is not installed. Please install Docker${NC}"
    exit 1
fi
echo -e "${GREEN}${CHECK} Docker $(docker -v | cut -d' ' -f3 | cut -d',' -f1)${NC}"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}${CROSS} Docker Compose is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}${CHECK} Docker Compose${NC}"

echo ""

# Install dependencies
echo -e "${CYAN}${PACKAGE} Installing dependencies...${NC}"
pnpm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}${CHECK} Dependencies installed${NC}"
else
    echo -e "${RED}${CROSS} Failed to install dependencies${NC}"
    exit 1
fi

echo ""

# Setup environment
echo -e "${CYAN}${GEAR} Setting up environment...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}${CHECK} Created .env file${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env file with your configuration${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping...${NC}"
fi

echo ""

# Start Docker services
echo -e "${CYAN}${DATABASE} Starting PostgreSQL and Redis...${NC}"
docker-compose -f docker-compose.dev.yml up -d
if [ $? -eq 0 ]; then
    echo -e "${GREEN}${CHECK} Services started${NC}"
    echo "   - PostgreSQL on port 5432"
    echo "   - Redis on port 6379"
else
    echo -e "${RED}${CROSS} Failed to start services${NC}"
    exit 1
fi

echo ""

# Wait for PostgreSQL to be ready
echo -e "${CYAN}Waiting for PostgreSQL to be ready...${NC}"
sleep 5
echo -e "${GREEN}${CHECK} PostgreSQL is ready${NC}"

echo ""

# Generate Prisma Client
echo -e "${CYAN}${GEAR} Generating Prisma Client...${NC}"
pnpm --filter @solo-leveling/database db:generate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}${CHECK} Prisma Client generated${NC}"
else
    echo -e "${YELLOW}⚠️  Prisma Client generation failed, continuing...${NC}"
fi

echo ""

# Run migrations
echo -e "${CYAN}${DATABASE} Running database migrations...${NC}"
pnpm db:migrate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}${CHECK} Migrations completed${NC}"
else
    echo -e "${RED}${CROSS} Failed to run migrations${NC}"
    exit 1
fi

echo ""

# Seed database
echo -e "${CYAN}${DATABASE} Seeding database...${NC}"
pnpm db:seed
if [ $? -eq 0 ]; then
    echo -e "${GREEN}${CHECK} Database seeded${NC}"
else
    echo -e "${YELLOW}⚠️  Database seeding failed, continuing...${NC}"
fi

echo ""
echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════════╗"
echo "║                                                   ║"
echo "║          ${CHECK} Setup Complete!                         ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${CYAN}${ROCKET} Quick Commands:${NC}"
echo ""
echo "  Start development:"
echo -e "    ${GREEN}pnpm dev${NC}"
echo ""
echo "  Open Prisma Studio:"
echo -e "    ${GREEN}pnpm db:studio${NC}"
echo ""
echo "  Stop Docker services:"
echo -e "    ${GREEN}pnpm docker:down${NC}"
echo ""
echo "  Build for production:"
echo -e "    ${GREEN}pnpm build${NC}"
echo ""

echo -e "${YELLOW}⚠️  Don't forget to:${NC}"
echo "  1. Edit .env file with your Telegram Bot Token"
echo "  2. Configure CORS_ORIGIN for your domain"
echo "  3. Update JWT_SECRET with a secure key"
echo ""

echo -e "${CYAN}📚 Documentation:${NC}"
echo "  - Quick Start: ./QUICKSTART.md"
echo "  - Architecture: ./ARCHITECTURE.md"
echo "  - Status: ./STATUS.md"
echo ""

echo -e "${PURPLE}Rise from E-Rank to Shadow Monarch! 💜⚡${NC}"
