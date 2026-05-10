# Docker Quick Reference - Solo Leveling App

## 🚀 Quick Commands

### Start Application
```bash
# Development (with hot reload)
./docker-start.sh
# OR
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose up -d
```

### Stop Application
```bash
# Development
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose down

# Stop and remove volumes (⚠️ deletes database)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Access Services
- **Frontend (dev)**: http://localhost:5173
- **Frontend (prod)**: http://localhost:80
- **Backend API**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555
- **PostgreSQL**: localhost:5432

### Database Commands
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d solo_leveling_db

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npx prisma db seed

# Backup database
docker-compose exec postgres pg_dump -U postgres solo_leveling_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres -d solo_leveling_db < backup.sql
```

### Container Management
```bash
# List running containers
docker-compose ps

# Restart a service
docker-compose restart backend

# Rebuild a service
docker-compose up -d --build backend

# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh
```

### Cleanup
```bash
# Remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Remove all unused Docker data
docker system prune -a --volumes
```

## 🐛 Troubleshooting

### Port Conflict
```bash
# Kill process using port
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or change port in docker-compose.yml
```

### Container Won't Start
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

### Database Connection Failed
```bash
# Check if database is ready
docker-compose exec postgres pg_isready

# Restart database
docker-compose restart postgres
```

### Hot Reload Not Working
```bash
# Ensure using dev compose file
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
```

## 📁 File Structure

```
.
├── Dockerfile.frontend          # Production frontend (Nginx)
├── Dockerfile.backend           # Production backend (Node.js)
├── Dockerfile.dev.frontend      # Dev frontend (Vite)
├── Dockerfile.dev.backend       # Dev backend (tsx watch)
├── docker-compose.yml           # Production orchestration
├── docker-compose.dev.yml       # Development orchestration
├── docker-start.sh              # Interactive start script
├── nginx.conf                   # Nginx configuration
└── .dockerignore               # Files to exclude
```

## 🔐 Environment Variables

Required in `.env`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
JWT_SECRET=your_secret_key
POSTGRES_PASSWORD=secure_password
```

Optional:
```env
NODE_ENV=development
PORT=3000
FRONTEND_PORT=5173
POSTGRES_USER=postgres
POSTGRES_DB=solo_leveling_db
```

## 💡 Tips

1. **Use the Script**: `./docker-start.sh` provides an interactive menu
2. **Dev Mode**: Always use `docker-compose.dev.yml` for development
3. **Logs**: Keep logs visible with `-f` flag to see issues immediately
4. **Volumes**: Don't remove volumes unless you want to reset the database
5. **Rebuild**: Use `--build` flag after changing Dockerfiles
6. **Clean Up**: Regularly run `docker system prune` to free disk space

## 📊 Resource Usage

Check resource consumption:
```bash
docker stats
```

Set resource limits in docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

## 🔄 Update Workflow

```bash
# 1. Pull latest changes
git pull origin main

# 2. Stop containers
docker-compose down

# 3. Rebuild with new changes
docker-compose build --no-cache

# 4. Start with migrations
docker-compose up -d

# 5. Check logs
docker-compose logs -f
```

---

For detailed information, see [DOCKER.md](./DOCKER.md)
