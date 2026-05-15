# Railway Setup Guide - Docker with Node.js 22.13.0

## Overview

This project uses **Docker** for Railway deployment with **Node.js v22.13.0**. This gives us full control over the Node.js version and ensures consistent builds.

## Why Docker Instead of Nixpacks?

- ✅ **Full Node.js version control** - Use v22.13.0 exactly
- ✅ **Nixpacks limitations** - Doesn't support Node.js 22 yet (only up to 21)
- ✅ **Multi-stage builds** - Optimized image sizes
- ✅ **Production ready** - Security best practices built-in
- ✅ **Consistency** - Same environment locally and in production

## Configuration Files

### 1. railway.toml (Project Root)

Tells Railway to use Docker builder:

```toml
# Railway configuration for API service
[build]
builder = "DOCKERFILE"
dockerfilePath = "docker/api.Dockerfile"

[deploy]
startCommand = "node apps/api/dist/index.js"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### 2. API Dockerfile (docker/api.Dockerfile)

Multi-stage build with Node.js 22.13.0:

```dockerfile
# Base stage - Node.js 22.13.0
FROM node:22.13.0-alpine AS base
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate
WORKDIR /app

# Dependencies stage
FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/*/package.json ./packages/
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @solo-leveling/shared build
RUN pnpm --filter @solo-leveling/database db:generate
RUN pnpm --filter api build

# Production stage
FROM node:22.13.0-alpine AS production
WORKDIR /app
# ... copy built files and run
CMD ["node", "apps/api/dist/index.js"]
```

### 3. Bot Dockerfile (docker/bot.Dockerfile)

Similar structure with Node.js 22.13.0:

```dockerfile
FROM node:22.13.0-alpine AS base
# ... similar multi-stage build for bot service
CMD ["node", "apps/bot/dist/index.js"]
```

## Railway Setup Steps

### Step 1: Connect GitHub Repository

1. Go to [Railway.app](https://railway.app)
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose: `test_telegram_mini_app`
6. Railway auto-detects the Dockerfile configuration

### Step 2: Configure API Service

Railway will create a service automatically. Configure it:

#### Settings Tab
- **Service Name**: `api`
- **Root Directory**: Leave empty (monorepo root)
- **Dockerfile Path**: Automatically detected from `railway.toml`

#### Variables Tab
Add these environment variables:

```env
# Database (auto-set when you add PostgreSQL)
DATABASE_URL=postgresql://...

# Redis (auto-set when you add Redis)
REDIS_URL=redis://...

# JWT Configuration
JWT_SECRET=<generate with: openssl rand -base64 32>
JWT_EXPIRATION=7d

# Telegram
TELEGRAM_BOT_TOKEN=<your-bot-token-from-@BotFather>

# CORS
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app

# Environment
NODE_ENV=production
PORT=3000

# API URL (after generating domain)
API_URL=https://your-api.up.railway.app
```

#### Domains Tab
1. Click **"Generate Domain"**
2. Copy the URL (e.g., `https://your-api.up.railway.app`)
3. Use this URL in other services and Vercel

### Step 3: Add PostgreSQL Database

1. In Railway project, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway automatically:
   - Creates the database
   - Sets `DATABASE_URL` variable in API service
   - Links services together

### Step 4: Add Redis (Optional but Recommended)

1. Click **"+ New"**
2. Select **"Database"** → **"Add Redis"**
3. Railway automatically:
   - Creates Redis instance
   - Sets `REDIS_URL` variable in API service

### Step 5: Configure Bot Service

1. Click **"+ New"** → **"Empty Service"**
2. Name it: `bot`
3. In **Settings** tab:
   - **Root Directory**: `apps/bot`
   - **Dockerfile Path**: `docker/bot.Dockerfile`
4. In **Variables** tab:

```env
TELEGRAM_BOT_TOKEN=<same-as-api>
API_URL=<your-api-url-from-step-2>
NODE_ENV=production
```

### Step 6: GitHub Auto-Deploy

1. In Railway project → **Settings** → **GitHub**
2. Enable **Auto Deploy**: Deploys on every push to `main`
3. **Branch**: `main`
4. **Watch Paths**: Leave empty
5. **PR Deploys**: Enable for preview deployments (optional)

## Deployment Workflow

### Automatic Deployment (Recommended)

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "feat: your changes"
   git push origin main
   ```
3. Railway automatically:
   - Detects the push
   - Builds using Docker (Node.js 22.13.0)
   - Runs health checks
   - Deploys to production

### Manual Deployment (If Needed)

1. Go to Railway dashboard
2. Click on service (API or Bot)
3. Go to **Deployments** tab
4. Click **"Deploy"** button

## Environment Variables Checklist

### API Service
- ✅ `DATABASE_URL` - Auto-set by PostgreSQL
- ✅ `REDIS_URL` - Auto-set by Redis
- ⚠️ `JWT_SECRET` - Generate: `openssl rand -base64 32`
- ⚠️ `JWT_EXPIRATION` - Set to `7d`
- ⚠️ `TELEGRAM_BOT_TOKEN` - From @BotFather
- ⚠️ `ALLOWED_ORIGINS` - Your Vercel URL
- ⚠️ `NODE_ENV` - Set to `production`
- ⚠️ `PORT` - Set to `3000`
- ⚠️ `API_URL` - Your Railway domain

### Bot Service
- ⚠️ `TELEGRAM_BOT_TOKEN` - Same as API
- ⚠️ `API_URL` - Your Railway API URL
- ⚠️ `NODE_ENV` - Set to `production`

**Legend:**
- ✅ Auto-set by Railway
- ⚠️ Must set manually

## Local Development vs Production

| Feature | Local | Railway (Production) |
|---------|-------|---------------------|
| Node.js Version | 22.13.0 | 22.13.0 (via Docker) |
| Package Manager | pnpm | pnpm (via Docker) |
| Database | PostgreSQL (Docker) | Railway PostgreSQL |
| Redis | Redis (Docker) | Railway Redis |
| Environment | `.env` files | Railway Variables |
| Build | `pnpm build` | Docker multi-stage |

## Monitoring and Logs

### View Real-Time Logs
1. Go to Railway dashboard
2. Click on service (API or Bot)
3. Go to **Logs** tab
4. Filter by:
   - **Build logs** - Shows Docker build process
   - **Deploy logs** - Shows deployment status
   - **Application logs** - Shows your app's console output

### View Metrics
1. Click on service
2. Go to **Metrics** tab
3. Monitor:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request rate

### View Deployments
1. Click on service
2. Go to **Deployments** tab
3. See:
   - All deployments (with timestamps)
   - Deployment status (success/failed)
   - Commit messages
   - Build duration

## Troubleshooting

### Build Fails: "Cannot find Dockerfile"
**Cause**: Railway can't locate the Dockerfile
**Solution**: 
- Check `railway.toml` has correct `dockerfilePath`
- Ensure Dockerfile exists at that path
- Path should be relative to project root

### Build Fails: "pnpm install failed"
**Cause**: Dependency installation issues
**Solution**:
- Check `pnpm-lock.yaml` is committed to Git
- Make sure all `package.json` files are correct
- Try deleting `node_modules` locally and reinstalling

### Container Starts but Health Check Fails
**Cause**: App not responding on expected port
**Solution**:
- Ensure `PORT` environment variable is set to `3000`
- Check app listens on `0.0.0.0` not `localhost`
- Verify `/health` endpoint exists and returns 200

### Database Connection Error
**Cause**: `DATABASE_URL` not set or incorrect
**Solution**:
- Ensure PostgreSQL database is added
- Check `DATABASE_URL` variable is set automatically
- Run migrations: Add to build or manually via Railway CLI

### "ECONNREFUSED" When Bot Calls API
**Cause**: Wrong `API_URL` or API not running
**Solution**:
- Use Railway internal URL: `http://api:3000` for bot→api
- Or use public domain if bot is external
- Ensure API service is healthy

## CI/CD Integration

### GitHub Actions (Optional)

The project has GitHub Actions for Vercel deployment. Railway deploys automatically via GitHub integration, so you don't need Railway in GitHub Actions.

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-web:
    name: Deploy Frontend to Vercel
    runs-on: ubuntu-latest
    steps:
      # Vercel deployment steps...
      
  # Railway deploys automatically via GitHub integration
  # No Railway jobs needed in GitHub Actions
```

## Cost Estimate

### Railway Free Tier
- **$5 credit/month** (no credit card required)
- **500 hours** of service uptime
- **100GB** bandwidth
- **1GB** RAM per service

### Expected Monthly Cost
- API service: ~350 hours × $0.005/hour = **$1.75**
- Bot service: ~350 hours × $0.005/hour = **$1.75**
- PostgreSQL: ~350 hours × $0.004/hour = **$1.40**
- Redis: ~350 hours × $0.001/hour = **$0.35**
- **Total: ~$5.25/month**

**Note**: Slightly over free tier. To stay under $5:
- Use Sleep mode (services sleep after 30min inactive)
- Or combine API + Bot into one service
- Or add credit card for $0.25 overage

## Next Steps

1. ✅ **Node.js 22.13.0 configured** - All Dockerfiles updated
2. ✅ **Railway.toml configured** - Using Docker builder
3. ⬜ **Push to GitHub** - Trigger deployment
4. ⬜ **Connect Railway to GitHub** - Enable auto-deploy
5. ⬜ **Add databases** - PostgreSQL and Redis
6. ⬜ **Set environment variables** - All required vars
7. ⬜ **Generate domain** - Get public API URL
8. ⬜ **Test deployment** - Verify health checks
9. ⬜ **Update Vercel** - Use Railway API URL
10. ⬜ **Configure Telegram webhook** - Point to Railway URL

## Commands Reference

```bash
# Local development with Docker
docker-compose up -d                    # Start all services
docker-compose logs -f api              # View API logs
docker-compose down                     # Stop all services

# Local development without Docker  
pnpm install                            # Install dependencies
pnpm db:generate                        # Generate Prisma client
pnpm build                              # Build all packages
pnpm dev                                # Start dev servers

# Git workflow (triggers Railway deployment)
git add .
git commit -m "feat: your changes"
git push origin main                    # Railway auto-deploys

# Railway CLI (optional - not needed for deployment)
railway login                           # Login to Railway
railway link                            # Link to existing project
railway logs --service api              # View logs
railway run pnpm db:push                # Run migrations
```

## Support and Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app)
- [Node.js 22 Documentation](https://nodejs.org/docs/latest-v22.x/api/)
- [Docker Documentation](https://docs.docker.com)

---

**Happy Deploying! 🚀**

Your app now runs on Node.js v22.13.0 everywhere - locally, in Railway, and in your CI/CD pipeline.
