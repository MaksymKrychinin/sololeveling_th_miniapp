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
WARNING="⚠️"

# Flags
SKIP_SEED=false
SKIP_DOCKER=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-seed)
            SKIP_SEED=true
            shift
            ;;
        --skip-docker)
            SKIP_DOCKER=true
            shift
            ;;
        --help)
            echo "Usage: ./setup.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --skip-seed     Skip database seeding"
            echo "  --skip-docker   Skip Docker setup (use existing services)"
            echo "  --help          Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════╗"
echo "║                                                   ║"
echo "║          Solo Leveling - Setup Script            ║"
echo "║          Telegram Mini App                        ║"
echo "║                                                   ║"
echo "╚═══════════════════════════════════════════════════╝"
echo -e "${NC}"

# Detect architecture
ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]; then
    echo -e "${CYAN}⚡ Detected Apple Silicon (M1/M2) - Using ARM64 optimized images${NC}"
    echo ""
fi

# Check prerequisites
echo -e "${CYAN}${GEAR} Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}${CROSS} Node.js is not installed. Please install Node.js >= 22.13.0${NC}"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
NODE_MINOR=$(echo $NODE_VERSION | cut -d'.' -f2)

if [ "$NODE_MAJOR" -lt 22 ] || { [ "$NODE_MAJOR" -eq 22 ] && [ "$NODE_MINOR" -lt 13 ]; }; then
    echo -e "${RED}${CROSS} Node.js version must be >= 22.13.0${NC}"
    echo "   Current: v${NODE_VERSION}"
    echo "   Required: v22.13.0 or higher"
    echo ""
    echo "   ${YELLOW}Note: pnpm requires Node.js v22.13+${NC}"
    echo "   Install Node v22 using nvm:"
    echo "   $ nvm install 22"
    echo "   $ nvm use 22"
    exit 1
fi
echo -e "${GREEN}${CHECK} Node.js v${NODE_VERSION}${NC}"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}${WARNING} pnpm not found. Installing...${NC}"
    npm install -g pnpm
    if [ $? -ne 0 ]; then
        echo -e "${RED}${CROSS} Failed to install pnpm${NC}"
        exit 1
    fi
fi

PNPM_VERSION=$(pnpm -v 2>/dev/null || echo "unknown")
echo -e "${GREEN}${CHECK} pnpm v${PNPM_VERSION}${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}${CROSS} Docker is not installed${NC}"
    echo "   Visit: https://www.docker.com/get-started"
    exit 1
fi

# Check Docker daemon
if ! docker ps >/dev/null 2>&1; then
    echo -e "${RED}${CROSS} Docker daemon is not running${NC}"
    echo "   Please start Docker Desktop and try again"
    exit 1
fi

DOCKER_VERSION=$(docker version --format '{{.Server.Version}}' 2>/dev/null || echo "unknown")
echo -e "${GREEN}${CHECK} Docker v${DOCKER_VERSION} (daemon running)${NC}"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null 2>&1; then
    echo -e "${RED}${CROSS} Docker Compose is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}${CHECK} Docker Compose${NC}"

echo ""

# Check ports
if [ "$SKIP_DOCKER" = false ]; then
    echo -e "${CYAN}🔍 Checking port availability...${NC}"

    PORTS_IN_USE=()

    if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1; then
        PORTS_IN_USE+=("5432 (PostgreSQL)")
    fi

    if lsof -Pi :6379 -sTCP:LISTEN -t >/dev/null 2>&1; then
        PORTS_IN_USE+=("6379 (Redis)")
    fi

    if [ ${#PORTS_IN_USE[@]} -gt 0 ]; then
        echo -e "${YELLOW}${WARNING} Following ports are in use:${NC}"
        for port in "${PORTS_IN_USE[@]}"; do
            echo "   - $port"
        done
        echo ""
        echo "   Options:"
        echo "   1. Stop local services: brew services stop postgresql && brew services stop redis"
        echo "   2. Kill processes: ./check-ports.sh"
        echo "   3. Skip Docker setup: ./setup.sh --skip-docker"
        echo ""
        read -p "   Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo -e "${GREEN}${CHECK} Ports 5432, 6379 are available${NC}"
    fi

    echo ""
fi

# Install dependencies
echo -e "${CYAN}${PACKAGE} Installing dependencies...${NC}"
pnpm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}${CHECK} Dependencies installed${NC}"
else
    echo -e "${RED}${CROSS} Failed to install dependencies${NC}"
    echo "   Try: rm -rf node_modules && pnpm install"
    exit 1
fi

echo ""

# Setup environment
echo -e "${CYAN}${GEAR} Setting up environment...${NC}"
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}${CHECK} Created .env file${NC}"
        echo -e "${YELLOW}${WARNING} Please edit .env file with your configuration:${NC}"
        echo "   - TELEGRAM_BOT_TOKEN"
        echo "   - JWT_SECRET"
    else
        echo -e "${RED}${CROSS} .env.example not found${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}${CHECK} .env file exists${NC}"
fi

# Create database .env if needed
if [ ! -f packages/database/.env ]; then
    echo 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/solo_leveling_dev?schema=public"' > packages/database/.env
    echo -e "${GREEN}${CHECK} Created packages/database/.env${NC}"
fi

echo ""

# Start Docker services
if [ "$SKIP_DOCKER" = false ]; then
    echo -e "${CYAN}${DATABASE} Starting Docker services...${NC}"
    docker-compose -f docker-compose.dev.yml up -d
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}${CHECK} Services started${NC}"
        echo "   - PostgreSQL on port 5432"
        echo "   - Redis on port 6379"
        echo "   - Mailpit on port 8025"
    else
        echo -e "${RED}${CROSS} Failed to start services${NC}"
        echo "   Try: docker-compose -f docker-compose.dev.yml down && docker-compose -f docker-compose.dev.yml up -d"
        exit 1
    fi

    echo ""

    # Wait for PostgreSQL to be ready
    echo -e "${CYAN}Waiting for PostgreSQL to be ready...${NC}"
    MAX_TRIES=30
    TRIES=0

    until docker exec solo-leveling-postgres-dev pg_isready -U postgres >/dev/null 2>&1; do
        TRIES=$((TRIES+1))
        if [ $TRIES -ge $MAX_TRIES ]; then
            echo -e "${RED}${CROSS} PostgreSQL failed to start after ${MAX_TRIES} seconds${NC}"
            echo "   Check logs: docker-compose -f docker-compose.dev.yml logs postgres"
            exit 1
        fi
        echo -n "."
        sleep 1
    done
    echo ""
    echo -e "${GREEN}${CHECK} PostgreSQL is ready${NC}"

    echo ""
else
    echo -e "${YELLOW}${WARNING} Skipping Docker setup (using existing services)${NC}"
    echo ""
fi

# Generate Prisma Client
echo -e "${CYAN}${GEAR} Generating Prisma Client...${NC}"
pnpm --filter @solo-leveling/database db:generate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}${CHECK} Prisma Client generated${NC}"
else
    echo -e "${RED}${CROSS} Prisma Client generation failed${NC}"
    exit 1
fi

echo ""

# Run migrations
echo -e "${CYAN}${DATABASE} Running database migrations...${NC}"
pnpm db:migrate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}${CHECK} Migrations completed${NC}"
else
    echo -e "${RED}${CROSS} Failed to run migrations${NC}"
    echo "   Check DATABASE_URL in .env file"
    echo "   Verify PostgreSQL is running: docker ps"
    exit 1
fi

echo ""

# Seed database
if [ "$SKIP_SEED" = false ]; then
    echo -e "${CYAN}${DATABASE} Seeding database...${NC}"
    pnpm db:seed
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}${CHECK} Database seeded${NC}"
    else
        echo -e "${YELLOW}${WARNING} Database seeding failed (this is OK)${NC}"
        echo "   The app will work without seed data"
        echo "   You can add quest templates later via API"
    fi
    echo ""
else
    echo -e "${YELLOW}${WARNING} Skipping database seed (--skip-seed)${NC}"
    echo ""
fi

# Success message
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
echo -e "    ${GREEN}docker-compose -f docker-compose.dev.yml down${NC}"
echo ""
echo "  Check services:"
echo -e "    ${GREEN}docker ps${NC}"
echo ""

if [ -f .env ]; then
    if grep -q "your_bot_token_from_botfather" .env 2>/dev/null; then
        echo -e "${YELLOW}${WARNING} Don't forget to:${NC}"
        echo "  1. Edit .env file with your Telegram Bot Token"
        echo "  2. Update JWT_SECRET with a secure key"
        echo "  3. Configure CORS_ORIGIN for your domain"
        echo ""
    fi
fi

echo -e "${CYAN}📚 Documentation:${NC}"
echo "  - Setup Analysis: ./SETUP_ANALYSIS.md"
echo "  - Quick Start: ./QUICKSTART.md"
echo "  - Complete Status: ./SETUP_COMPLETE.md"
echo ""

echo -e "${CYAN}🌐 Access:${NC}"
echo "  - Web: http://localhost:3000"
echo "  - API: http://localhost:3001"
echo "  - DB Studio: http://localhost:5555 (run pnpm db:studio)"
echo "  - Mailpit: http://localhost:8025"
echo ""

echo -e "${PURPLE}Rise from E-Rank to Shadow Monarch! 💜⚡${NC}"
