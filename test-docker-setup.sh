#!/bin/bash

# Quick test script for Docker setup
# This script tests if all Docker files are present and valid

set -e

echo "🐳 Testing Docker Setup..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Counter
passed=0
failed=0

# Test function
test_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        ((passed++))
    else
        echo -e "${RED}✗${NC} $1 missing"
        ((failed++))
    fi
}

# Test Docker files
echo "Checking Docker configuration files..."
test_file "Dockerfile.frontend"
test_file "Dockerfile.backend"
test_file "Dockerfile.dev.frontend"
test_file "Dockerfile.dev.backend"
test_file "docker-compose.yml"
test_file "docker-compose.dev.yml"
test_file "nginx.conf"
test_file ".dockerignore"

echo ""
echo "Checking helper files..."
test_file "docker-start.sh"
test_file "Makefile"

echo ""
echo "Checking documentation..."
test_file "DOCKER.md"
test_file "DOCKER_QUICKREF.md"
test_file "DOCKER_SETUP.md"

echo ""
echo "Checking if docker-start.sh is executable..."
if [ -x "docker-start.sh" ]; then
    echo -e "${GREEN}✓${NC} docker-start.sh is executable"
    ((passed++))
else
    echo -e "${YELLOW}⚠${NC} docker-start.sh is not executable (run: chmod +x docker-start.sh)"
fi

echo ""
echo "Checking environment..."
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} .env.example exists"
    ((passed++))
else
    echo -e "${RED}✗${NC} .env.example missing"
    ((failed++))
fi

if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env exists"
    echo -e "${YELLOW}ℹ${NC} Make sure TELEGRAM_BOT_TOKEN is set in .env"
else
    echo -e "${YELLOW}⚠${NC} .env not found (copy from .env.example)"
fi

echo ""
echo "Checking Docker installation..."
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker is installed"
    docker --version
    ((passed++))
else
    echo -e "${RED}✗${NC} Docker is not installed"
    echo "Install from: https://docs.docker.com/get-docker/"
    ((failed++))
fi

if command -v docker-compose &> /dev/null || docker compose version &> /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Docker Compose is installed"
    docker-compose --version 2>/dev/null || docker compose version
    ((passed++))
else
    echo -e "${RED}✗${NC} Docker Compose is not installed"
    echo "Install from: https://docs.docker.com/compose/install/"
    ((failed++))
fi

echo ""
echo "═══════════════════════════════════════"
echo "Summary:"
echo -e "  ${GREEN}Passed: $passed${NC}"
if [ $failed -gt 0 ]; then
    echo -e "  ${RED}Failed: $failed${NC}"
fi
echo "═══════════════════════════════════════"

if [ $failed -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Docker setup is ready!${NC}"
    echo ""
    echo "You can now start the app with:"
    echo "  ./docker-start.sh"
    echo "  OR"
    echo "  make dev"
    echo "  OR"
    echo "  docker-compose -f docker-compose.dev.yml up -d"
    echo ""
    exit 0
else
    echo ""
    echo -e "${YELLOW}⚠️  Some issues found. Please fix them before starting.${NC}"
    echo ""
    exit 1
fi
