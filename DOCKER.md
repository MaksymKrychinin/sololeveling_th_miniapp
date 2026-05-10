# Docker Setup Guide - Solo Leveling Telegram Mini App

Complete guide for running the app with Docker.

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Docker Files Overview](#docker-files-overview)
- [Development Mode](#development-mode)
- [Production Mode](#production-mode)
- [Common Commands](#common-commands)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### 1. Install Docker
- **macOS/Windows**: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/)

Verify installation:
```bash
docker --version
docker-compose --version
```

### 2. Set Up Environment
```bash
# Clone repository
git clone <your-repo-url>
cd test_telegram_mini_app

# Create .env file
cp .env.example .env

# Edit .env with your values
nano .env
```

**Required environment variables:**
```env
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
JWT_SECRET=your_random_secret_key
POSTGRES_PASSWORD=your_secure_password
```

### 3. Start Using Interactive Script
```bash
./docker-start.sh
```

This launches an interactive menu with all options.

### 4. Or Start Manually

**Development Mode (with hot reload):**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

**Production Mode:**
```bash
docker-compose up -d
```

## 📁 Docker Files Overview

### Production Files
- **Dockerfile.frontend** - Nginx serving built React app
- **Dockerfile.backend** - Node.js API server with Prisma
- **docker-compose.yml** - Production orchestration
- **nginx.conf** - Nginx configuration with API proxy

### Development Files
- **Dockerfile.dev.frontend** - Vite dev server with hot reload
- **Dockerfile.dev.backend** - Node.js with tsx watch mode
- **docker-compose.dev.yml** - Development orchestration
- **.dockerignore** - Files to exclude from Docker builds

### Helper Files
- **docker-start.sh** - Interactive start script with menu

## 🔧 Development Mode

Best for active development with hot reload.

### Start Dev Mode
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Services Available
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3000 (tsx watch mode)
- **Database**: localhost:5432 (PostgreSQL)
- **Prisma Studio**: http://localhost:5555 (Database GUI)

### Features
- ✅ Hot reload for frontend (instant changes)
- ✅ Hot reload for backend (auto-restart on changes)
- ✅ Live database GUI with Prisma Studio
- ✅ Volume mounts for source code
- ✅ Full TypeScript support

### View Logs
```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f frontend
docker-compose -f docker-compose.dev.yml logs -f backend
docker-compose -f docker-compose.dev.yml logs -f postgres
```

### Access Containers
```bash
# Frontend shell
docker exec -it solo_leveling_frontend_dev sh

# Backend shell
docker exec -it solo_leveling_backend_dev sh

# Database shell
docker exec -it solo_leveling_db_dev psql -U postgres -d solo_leveling_db
```

### Run Commands Inside Containers
```bash
# Run Prisma migrations
docker-compose -f docker-compose.dev.yml exec backend npx prisma migrate dev

# Generate Prisma client
docker-compose -f docker-compose.dev.yml exec backend npx prisma generate

# Run tests
docker-compose -f docker-compose.dev.yml exec backend npm test

# Lint code
docker-compose -f docker-compose.dev.yml exec frontend npm run lint
```

## 🚀 Production Mode

Optimized for deployment with smaller images and better performance.

### Start Production Mode
```bash
docker-compose up -d --build
```

### Services Available
- **Frontend**: http://localhost:80 (Nginx)
- **Backend**: http://localhost:3000 (Node.js)
- **Database**: localhost:5432 (PostgreSQL)

### Features
- ✅ Multi-stage builds (smaller images)
- ✅ Production optimizations
- ✅ Nginx with caching and gzip
- ✅ Health checks
- ✅ Auto-restart on failure
- ✅ Automatic migrations on startup

### Build Without Cache
```bash
docker-compose build --no-cache
```

### Scale Services
```bash
# Run 3 backend instances (load balancing requires additional setup)
docker-compose up -d --scale backend=3
```

## 📝 Common Commands

### Start/Stop
```bash
# Start all services (production)
docker-compose up -d

# Start all services (development)
docker-compose -f docker-compose.dev.yml up -d

# Stop all services
docker-compose down
docker-compose -f docker-compose.dev.yml down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
docker-compose -f docker-compose.dev.yml down -v

# Restart a service
docker-compose restart backend
```

### Logs & Monitoring
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# View last 100 lines
docker-compose logs --tail=100 backend

# Check service status
docker-compose ps

# Check resource usage
docker stats
```

### Database Operations
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d solo_leveling_db

# Backup database
docker-compose exec postgres pg_dump -U postgres solo_leveling_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres -d solo_leveling_db < backup.sql

# Reset database (⚠️ deletes all data)
docker-compose exec backend npx prisma migrate reset
```

### Prisma Commands
```bash
# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Generate Prisma client
docker-compose exec backend npx prisma generate

# Seed database
docker-compose exec backend npx prisma db seed

# Open Prisma Studio
docker-compose -f docker-compose.dev.yml up -d prisma-studio
# Then open http://localhost:5555
```

### Clean Up
```bash
# Remove stopped containers
docker-compose rm

# Remove all project containers
docker-compose down --remove-orphans

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Complete cleanup (⚠️ removes everything)
docker system prune -a --volumes
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find what's using the port
lsof -i :3000  # or :5173, :5432, :80

# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "3001:3000"  # Use 3001 instead
```

### Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Check container status
docker-compose ps

# Restart with fresh build
docker-compose down
docker-compose up -d --build
```

### Database Connection Issues
```bash
# Check if database is ready
docker-compose exec postgres pg_isready -U postgres

# Restart database
docker-compose restart postgres

# Check database logs
docker-compose logs postgres

# Verify connection string in .env
# DATABASE_URL="postgresql://user:password@postgres:5432/dbname"
```

### Permission Issues
```bash
# On Linux, you might need to fix permissions
sudo chown -R $USER:$USER .

# Or run with sudo (not recommended)
sudo docker-compose up -d
```

### Out of Disk Space
```bash
# Check disk usage
docker system df

# Clean up
docker system prune -a --volumes

# Remove specific volumes
docker volume rm solo_leveling_postgres_data
```

### Frontend Not Loading
```bash
# Check if frontend container is running
docker-compose ps frontend

# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up -d --build frontend

# Check nginx configuration
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf
```

### Backend API Not Responding
```bash
# Check backend logs
docker-compose logs backend

# Check if migrations ran
docker-compose exec backend npx prisma migrate status

# Manually run migrations
docker-compose exec backend npx prisma migrate deploy

# Check Node.js process
docker-compose exec backend ps aux
```

### Hot Reload Not Working
```bash
# Ensure you're using dev compose file
docker-compose -f docker-compose.dev.yml up -d

# Check if volumes are mounted
docker-compose -f docker-compose.dev.yml config

# Restart with fresh build
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d --build
```

### Can't Connect to Prisma Studio
```bash
# Ensure dev mode is running
docker-compose -f docker-compose.dev.yml ps

# Start Prisma Studio separately
docker-compose -f docker-compose.dev.yml up -d prisma-studio

# Check logs
docker-compose -f docker-compose.dev.yml logs prisma-studio

# Access at http://localhost:5555
```

## 🔒 Production Best Practices

### Security
1. **Environment Variables**
   - Never commit `.env` to Git
   - Use strong passwords
   - Rotate secrets regularly

2. **Network Security**
   ```yaml
   # Use internal networks
   networks:
     solo_leveling_network:
       internal: true  # No external access
   ```

3. **Resource Limits**
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 512M
   ```

### Performance
1. **Use BuildKit** for faster builds:
   ```bash
   DOCKER_BUILDKIT=1 docker-compose build
   ```

2. **Layer Caching**: Order Dockerfile commands from least to most frequently changing

3. **Multi-stage Builds**: Reduce final image size

4. **Health Checks**: Ensure services are ready before routing traffic

### Monitoring
```bash
# Monitor container stats
docker stats

# Export metrics
docker-compose exec backend npm run metrics

# Use external monitoring (Prometheus, Grafana)
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices for Writing Dockerfiles](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Security](https://docs.docker.com/engine/security/)

## 🆘 Need Help?

1. Check logs: `docker-compose logs -f`
2. Review [QUICKSTART.md](./QUICKSTART.md)
3. See [ARCHITECTURE.md](./ARCHITECTURE.md)
4. Open GitHub issue

---

**Remember**: Always use `docker-compose -f docker-compose.dev.yml` for development and `docker-compose` for production! 🐳
