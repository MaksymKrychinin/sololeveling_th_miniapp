# 🐳 Docker Issues - Troubleshooting Guide

## Common Issues & Solutions

### 1. Platform Mismatch (Apple Silicon M1/M2)

**Error:**
```
The requested image's platform (linux/amd64) does not match the detected host platform (linux/arm64/v8)
```

**Solution:** ✅ FIXED!
- Updated `docker-compose.dev.yml` with `platform: linux/arm64/v8`
- Changed mailhog to mailpit (arm64-compatible)

### 2. Port Already Allocated

**Error:**
```
Bind for 0.0.0.0:6379 failed: port is already allocated
```

**Solution:**

#### Quick Fix - Kill Process
```bash
# Check what's using the port
lsof -i :6379

# Kill the process
lsof -ti :6379 | xargs kill -9
```

#### Automated Fix
```bash
# Use the port checker script
./check-ports.sh
```

#### Stop System Services (if installed via Homebrew)
```bash
# Stop Redis
brew services stop redis

# Stop PostgreSQL  
brew services stop postgresql@15

# List all services
brew services list
```

---

## Quick Commands

### Check Ports
```bash
# PostgreSQL (5432)
lsof -i :5432

# Redis (6379)
lsof -i :6379

# Web (3000)
lsof -i :3000

# API (3001)
lsof -i :3001
```

### Kill Specific Port
```bash
# Kill port 6379 (Redis)
lsof -ti :6379 | xargs kill -9

# Kill port 5432 (PostgreSQL)
lsof -ti :5432 | xargs kill -9
```

### Docker Commands
```bash
# Stop all containers
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes
docker-compose -f docker-compose.dev.yml down -v

# Restart containers
docker-compose -f docker-compose.dev.yml restart

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Check running containers
docker ps
```

---

## Step-by-Step Fix for Your Error

### 1. Stop Conflicting Services
```bash
# Option A: Use the automated script
./check-ports.sh

# Option B: Manual
brew services stop redis
brew services stop postgresql
```

### 2. Clean Up Docker
```bash
# Stop old containers
docker-compose -f docker-compose.dev.yml down

# Remove volumes (optional - will delete data)
docker-compose -f docker-compose.dev.yml down -v
```

### 3. Start Fresh
```bash
# Start services (now with ARM64 support)
docker-compose -f docker-compose.dev.yml up -d

# Check status
docker-compose -f docker-compose.dev.yml ps

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

---

## Alternative: Use Different Ports

If you want to keep local Redis/PostgreSQL running, modify `docker-compose.dev.yml`:

```yaml
services:
  postgres-dev:
    ports:
      - '5433:5432'  # Use 5433 instead of 5432
  
  redis-dev:
    ports:
      - '6380:6379'  # Use 6380 instead of 6379
```

Then update `.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/solo_leveling"
REDIS_URL="redis://localhost:6380"
```

---

## Verify Everything Works

```bash
# 1. Check containers are running
docker ps

# Should see:
# - solo-leveling-postgres-dev
# - solo-leveling-redis-dev  
# - solo-leveling-mailpit

# 2. Test PostgreSQL
docker exec -it solo-leveling-postgres-dev psql -U postgres -c "SELECT version();"

# 3. Test Redis
docker exec -it solo-leveling-redis-dev redis-cli ping
# Should return: PONG

# 4. Access Mailpit UI
# Open: http://localhost:8025
```

---

## Complete Setup After Fix

```bash
# 1. Fix ports
./check-ports.sh

# 2. Start Docker
pnpm docker:dev

# 3. Continue with setup
pnpm db:migrate
pnpm db:seed

# 4. Start development
pnpm dev
```

---

## If Still Having Issues

### Reset Everything
```bash
# 1. Stop everything
docker-compose -f docker-compose.dev.yml down -v
brew services stop redis
brew services stop postgresql

# 2. Clean Docker
docker system prune -a --volumes

# 3. Start fresh
./setup.sh
```

### Check Docker Environment
```bash
# Check Docker version
docker --version
docker-compose --version

# Check system architecture
uname -m
# Should show: arm64

# Check available platforms
docker buildx ls
```

---

## Updated Files

✅ **docker-compose.dev.yml**
- Added `platform: linux/arm64/v8` for all services
- Changed mailhog to mailpit (ARM64-compatible)

✅ **check-ports.sh** (NEW)
- Automated port conflict checker
- Interactive process killer

✅ **DOCKER_TROUBLESHOOTING.md** (this file)
- Complete troubleshooting guide

---

## Prevention

To avoid port conflicts in future:

```bash
# Add to ~/.zshrc or ~/.bashrc
alias ports='lsof -iTCP -sTCP:LISTEN -n -P'
alias kill-port='function _kill_port() { lsof -ti :$1 | xargs kill -9; }; _kill_port'

# Usage:
# ports              # List all ports
# kill-port 6379     # Kill process on port 6379
```

---

**Status:** ✅ FIXED for Apple Silicon  
**Last Updated:** May 11, 2026
