#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Checking for port conflicts...${NC}"
echo ""

# Check port 5432 (PostgreSQL)
if lsof -Pi :5432 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 5432 (PostgreSQL) is in use${NC}"
    echo "   Process:"
    lsof -Pi :5432 -sTCP:LISTEN | grep -v "COMMAND"
    echo ""
    read -p "   Kill this process? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -Pi :5432 -sTCP:LISTEN -t | xargs kill -9
        echo -e "${GREEN}   ✓ Process killed${NC}"
    fi
    echo ""
else
    echo -e "${GREEN}✓ Port 5432 (PostgreSQL) is free${NC}"
fi

# Check port 6379 (Redis)
if lsof -Pi :6379 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 6379 (Redis) is in use${NC}"
    echo "   Process:"
    lsof -Pi :6379 -sTCP:LISTEN | grep -v "COMMAND"
    echo ""
    read -p "   Kill this process? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -Pi :6379 -sTCP:LISTEN -t | xargs kill -9
        echo -e "${GREEN}   ✓ Process killed${NC}"
    fi
    echo ""
else
    echo -e "${GREEN}✓ Port 6379 (Redis) is free${NC}"
fi

# Check port 3000 (Web)
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3000 (Web) is in use${NC}"
    echo "   Process:"
    lsof -Pi :3000 -sTCP:LISTEN | grep -v "COMMAND"
    echo ""
    read -p "   Kill this process? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -Pi :3000 -sTCP:LISTEN -t | xargs kill -9
        echo -e "${GREEN}   ✓ Process killed${NC}"
    fi
    echo ""
else
    echo -e "${GREEN}✓ Port 3000 (Web) is free${NC}"
fi

# Check port 3001 (API)
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3001 (API) is in use${NC}"
    echo "   Process:"
    lsof -Pi :3001 -sTCP:LISTEN | grep -v "COMMAND"
    echo ""
    read -p "   Kill this process? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -Pi :3001 -sTCP:LISTEN -t | xargs kill -9
        echo -e "${GREEN}   ✓ Process killed${NC}"
    fi
    echo ""
else
    echo -e "${GREEN}✓ Port 3001 (API) is free${NC}"
fi

echo ""
echo -e "${GREEN}✅ Port check complete!${NC}"
echo ""
echo -e "${BLUE}💡 Tip: If you have Redis/PostgreSQL running locally, you can stop them:${NC}"
echo -e "   ${YELLOW}brew services stop redis${NC}"
echo -e "   ${YELLOW}brew services stop postgresql${NC}"
