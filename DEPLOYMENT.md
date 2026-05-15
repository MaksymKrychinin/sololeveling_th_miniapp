# 🚀 Free Deployment Guide

This guide will help you deploy the Solo Leveling Telegram Mini App for **FREE** using various cloud platforms.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Option 1: Railway (Recommended)](#option-1-railway-recommended)
4. [Option 2: Vercel + Render](#option-2-vercel--render)
5. [Option 3: Netlify + Fly.io](#option-3-netlify--flyio)
6. [Database Setup](#database-setup)
7. [Environment Variables](#environment-variables)
8. [GitHub Actions CI/CD](#github-actions-cicd)
9. [Post-Deployment](#post-deployment)

---

## Architecture Overview

```
┌─────────────┐
│   Frontend  │  Vercel/Netlify/Cloudflare Pages (Static hosting)
│   (React)   │  
└─────────────┘
       │
       ↓
┌─────────────┐
│     API     │  Railway/Render/Fly.io (Backend hosting)
│  (Node.js)  │
└─────────────┘
       │
       ├── PostgreSQL (Supabase/Railway/Render)
       ├── Redis (Upstash/Railway/Render)
       └── Telegram Bot (Railway/Render/Fly.io)
```

---

## Prerequisites

- GitHub account
- Telegram Bot Token (from [@BotFather](https://t.me/BotFather))
- Accounts on chosen platforms (all free):
  - [Railway](https://railway.app) (recommended)
  - [Vercel](https://vercel.com)
  - [Render](https://render.com)
  - [Supabase](https://supabase.com)
  - [Upstash](https://upstash.com)

---

## Option 1: Railway (Recommended) ⭐

Railway offers the easiest setup with PostgreSQL, Redis, and app hosting in one place.

### Free Tier Limits:
- $5 credit/month (usually enough for small apps)
- PostgreSQL: 1GB storage
- Redis: 100MB storage
- App: 512MB RAM, shared CPU

### Steps:

#### 1. Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub

#### 2. Create New Project
```bash
railway login
railway init
```

#### 3. Add PostgreSQL Database
1. In Railway dashboard, click "New" → "Database" → "PostgreSQL"
2. Copy the `DATABASE_URL` from the connection string

#### 4. Add Redis Database
1. Click "New" → "Database" → "Redis"
2. Copy the `REDIS_URL`

#### 5. Deploy API Service
```bash
# From project root
railway up --service api
```

In Railway dashboard, add environment variables:
```env
DATABASE_URL=<from-railway-postgres>
REDIS_URL=<from-railway-redis>
JWT_SECRET=your-super-secret-key-here
TELEGRAM_BOT_TOKEN=<from-botfather>
NODE_ENV=production
PORT=3001
```

#### 6. Deploy Bot Service
```bash
railway up --service bot
```

Use the same environment variables as API (Railway can share them).

#### 7. Deploy Frontend to Vercel
```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
cd apps/web
vercel
```

Add environment variables in Vercel dashboard:
```env
VITE_API_URL=<your-railway-api-url>
VITE_TELEGRAM_BOT_USERNAME=<your-bot-username>
```

#### 8. Run Migrations
```bash
# Connect to Railway database
railway run pnpm db:migrate
railway run pnpm db:seed
```

✅ **Done! Your app is live.**

---

## Option 2: Vercel + Render

### Frontend: Vercel (Free)
- **Limits**: 100GB bandwidth/month, unlimited sites

#### Steps:
1. Push code to GitHub
2. Go to https://vercel.com
3. Import GitHub repository
4. Set build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm install && pnpm db:generate && pnpm build --filter=web`
   - **Output Directory**: `dist`
5. Add environment variables:
   ```env
   VITE_API_URL=https://your-api.onrender.com
   VITE_TELEGRAM_BOT_USERNAME=your_bot_username
   ```
6. Deploy

### Backend: Render (Free)
- **Limits**: 750 hours/month, sleeps after 15min inactivity

#### Steps for API:
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repository
4. Settings:
   - **Name**: solo-leveling-api
   - **Root Directory**: `/`
   - **Build Command**: `pnpm install && pnpm db:generate && pnpm build --filter=api`
   - **Start Command**: `cd apps/api && node dist/index.js`
   - **Environment**: Node
5. Add environment variables (see section below)
6. Create service

#### Steps for Bot:
1. New → Background Worker
2. Same repository
3. Settings:
   - **Name**: solo-leveling-bot
   - **Build Command**: `pnpm install && pnpm db:generate && pnpm build --filter=bot`
   - **Start Command**: `cd apps/bot && node dist/index.js`
4. Same environment variables
5. Create service

### Database: Supabase (Free)
- **Limits**: 500MB database, 2GB bandwidth, unlimited API requests

#### Steps:
1. Go to https://supabase.com
2. New project
3. Copy `DATABASE_URL` from Settings → Database → Connection string
4. Update connection string format:
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```
5. Run migrations from local:
   ```bash
   DATABASE_URL="<supabase-url>" pnpm db:migrate
   DATABASE_URL="<supabase-url>" pnpm db:seed
   ```

### Redis: Upstash (Free)
- **Limits**: 10,000 commands/day, 256MB storage

#### Steps:
1. Go to https://upstash.com
2. Create Redis database
3. Copy connection string (REDIS_URL)

✅ **Done!**

---

## Option 3: Netlify + Fly.io

### Frontend: Netlify
Similar to Vercel, free tier is generous.

#### Steps:
1. Go to https://netlify.com
2. New site from Git
3. Build settings:
   - **Base directory**: `apps/web`
   - **Build command**: `cd ../.. && pnpm install && pnpm db:generate && pnpm build --filter=web`
   - **Publish directory**: `apps/web/dist`
4. Environment variables (same as Vercel)

### Backend: Fly.io (Free)
- **Limits**: 3 shared VMs, 3GB persistent storage

#### Steps:
1. Install Fly CLI:
   ```bash
   brew install flyctl  # macOS
   # or
   curl -L https://fly.io/install.sh | sh
   ```

2. Login and create app:
   ```bash
   flyctl auth login
   flyctl launch --name solo-leveling-api --no-deploy
   ```

3. Create `fly.toml` in project root:
   ```toml
   app = "solo-leveling-api"

   [build]
     [build.args]
       NODE_VERSION = "22.13.0"

   [env]
     PORT = "8080"
     NODE_ENV = "production"

   [[services]]
     internal_port = 8080
     protocol = "tcp"

     [services.concurrency]
       hard_limit = 25
       soft_limit = 20

     [[services.ports]]
       handlers = ["http"]
       port = 80

     [[services.ports]]
       handlers = ["tls", "http"]
       port = 443

   [[services.tcp_checks]]
     interval = "15s"
     timeout = "2s"
     grace_period = "5s"
   ```

4. Set secrets:
   ```bash
   flyctl secrets set DATABASE_URL="..." REDIS_URL="..." JWT_SECRET="..." TELEGRAM_BOT_TOKEN="..."
   ```

5. Deploy:
   ```bash
   flyctl deploy
   ```

---

## Database Setup

### PostgreSQL Migrations

After deploying, run migrations:

```bash
# For Railway
railway run pnpm db:migrate
railway run pnpm db:seed

# For other platforms (local connection to remote DB)
DATABASE_URL="<your-db-url>" pnpm db:migrate
DATABASE_URL="<your-db-url>" pnpm db:seed
```

### Verify Database
```bash
# Connect to database
psql <DATABASE_URL>

# Check tables
\dt

# Check data
SELECT * FROM users LIMIT 5;
SELECT * FROM achievements;
```

---

## Environment Variables

### API & Bot Services

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
REDIS_URL=redis://default:password@host:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRATION=7d

# Telegram Bot
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ123456789

# Application
NODE_ENV=production
PORT=3001
LOG_LEVEL=info

# CORS (add your frontend URL)
CORS_ORIGIN=https://your-app.vercel.app

# API Base URL (for bot webhook)
API_URL=https://your-api.railway.app
```

### Web App (Frontend)

```env
VITE_API_URL=https://your-api-url.com
VITE_TELEGRAM_BOT_USERNAME=your_bot_name
```

---

## GitHub Actions CI/CD

The repository includes automated workflows:

### Required GitHub Secrets

Go to GitHub repo → Settings → Secrets → Actions → New repository secret

```
# Vercel
VERCEL_TOKEN=<from-vercel-account-settings>
VERCEL_ORG_ID=<from-vercel-project-settings>
VERCEL_PROJECT_ID=<from-vercel-project-settings>

# Railway
RAILWAY_TOKEN=<from-railway-account>

# Or Render
RENDER_API_KEY=<from-render-account>

# Application URLs
API_URL=https://your-api-url.com
WEB_URL=https://your-web-url.com
TELEGRAM_BOT_USERNAME=your_bot
```

### Workflows

1. **CI Workflow** (`.github/workflows/ci.yml`)
   - Runs on every push/PR
   - Lints, type checks, builds, tests

2. **Deploy Workflow** (`.github/workflows/deploy.yml`)
   - Runs on push to `main`
   - Deploys to production
   - Health checks

### Manual Deployment
```bash
# Trigger deployment manually
gh workflow run deploy.yml
```

---

## Post-Deployment

### 1. Configure Telegram Bot Webhook

```bash
curl -X POST \
  https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://your-api-url.com/api/v1/telegram/webhook"}'
```

Verify:
```bash
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

### 2. Set Bot Commands

```bash
curl -X POST \
  https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setMyCommands \
  -H 'Content-Type: application/json' \
  -d '{
    "commands": [
      {"command": "start", "description": "Start your journey as a hunter"},
      {"command": "profile", "description": "View your hunter profile"},
      {"command": "quests", "description": "View your active quests"},
      {"command": "achievements", "description": "View your achievements"},
      {"command": "leaderboard", "description": "View the rankings"},
      {"command": "help", "description": "Get help"}
    ]
  }'
```

### 3. Configure Mini App
In BotFather:
```
/mybots
→ Select your bot
→ Bot Settings
→ Menu Button
→ Configure Menu Button
→ URL: https://your-web-url.com
```

### 4. Test Your Bot
1. Open Telegram
2. Search for your bot
3. Click "Start"
4. Click menu button to open Mini App

### 5. Monitor Logs

**Railway:**
```bash
railway logs
```

**Render:**
- Go to dashboard → Services → Logs

**Fly.io:**
```bash
flyctl logs
```

---

## Cost Breakdown (Free Tier)

| Service | Platform | Free Tier | Monthly Cost |
|---------|----------|-----------|--------------|
| Frontend | Vercel | 100GB bandwidth | **$0** |
| API | Railway | $5 credit | **$0-5** |
| Bot | Railway | (included) | **$0** |
| Database | Railway | 1GB PostgreSQL | **$0** |
| Redis | Railway | 100MB | **$0** |
| **Total** | | | **$0-5/month** |

Alternative:
| Service | Platform | Free Tier | Monthly Cost |
|---------|----------|-----------|--------------|
| Frontend | Netlify | 100GB | **$0** |
| API + Bot | Render | 750hrs/month | **$0** |
| Database | Supabase | 500MB | **$0** |
| Redis | Upstash | 10K cmds/day | **$0** |
| **Total** | | | **$0/month** |

---

## Troubleshooting

### Issue: API not responding
```bash
# Check logs
railway logs  # or render/fly.io equivalent

# Verify health endpoint
curl https://your-api-url.com/health
```

### Issue: Database connection failed
- Verify `DATABASE_URL` is correct
- Check if database is running
- Ensure migrations are applied
- Check IP whitelist (if required)

### Issue: Redis connection failed
- Verify `REDIS_URL` format
- Test connection: `redis-cli -u $REDIS_URL ping`

### Issue: Frontend can't reach API
- Check CORS settings in API
- Verify `VITE_API_URL` is correct
- Check browser console for errors

### Issue: Bot not responding
- Verify webhook is set: `curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo`
- Check bot logs
- Ensure `TELEGRAM_BOT_TOKEN` is correct

---

## Scaling Up (Beyond Free Tier)

When you're ready to scale:

1. **Upgrade Railway**: $5/month gets you more resources
2. **Add CDN**: Cloudflare (free) for API caching
3. **Database**: Upgrade to dedicated PostgreSQL
4. **Monitoring**: Add Sentry for error tracking (free tier available)
5. **Analytics**: Plausible or Simple Analytics

---

## Support

- 📖 [Documentation](./README.md)
- 🐛 [Report Issues](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)

---

## License

This project is licensed under the MIT License.
