# 🔐 Secrets & Environment Variables Guide

This guide shows you exactly which secrets and environment variables to set for each platform.

---

## 📋 Quick Reference

| Platform | Variables Needed | Where to Set |
|----------|------------------|--------------|
| **Local Dev** | 8 variables | `.env` file |
| **GitHub Actions** | 7 secrets | GitHub Settings → Secrets |
| **Railway (API + Bot)** | 7 variables | Railway Dashboard |
| **Vercel (Frontend)** | 2 variables | Vercel Dashboard |
| **Telegram Bot** | 1 token | BotFather |

---

## 1. 🏠 Local Development (.env file)

Create a `.env` file in the project root:

```bash
# Copy the example
cp .env.example .env
```

Then set these values:

```env
# ============================================
# DATABASE
# ============================================
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/solo_leveling_dev
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# ============================================
# REDIS
# ============================================
REDIS_URL=redis://localhost:6379
# Format: redis://HOST:PORT or redis://default:PASSWORD@HOST:PORT

# ============================================
# AUTHENTICATION
# ============================================
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
# Generate with: openssl rand -base64 32
JWT_EXPIRATION=7d

# ============================================
# TELEGRAM BOT
# ============================================
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ
# Get from: https://t.me/BotFather

# ============================================
# APPLICATION
# ============================================
NODE_ENV=development
PORT=3001
LOG_LEVEL=info

# ============================================
# CORS (Frontend URL)
# ============================================
CORS_ORIGIN=http://localhost:3000
```

### How to Get Each Value:

#### DATABASE_URL (Local)
```bash
# If using Docker (recommended):
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/solo_leveling_dev

# If using local PostgreSQL:
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/YOUR_DATABASE
```

#### REDIS_URL (Local)
```bash
# If using Docker (recommended):
REDIS_URL=redis://localhost:6379

# If Redis has password:
REDIS_URL=redis://default:YOUR_PASSWORD@localhost:6379
```

#### JWT_SECRET (Generate)
```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Any random 32+ character string
# Example: mySuperSecretKey123456789012345678
```

#### TELEGRAM_BOT_TOKEN (Get from BotFather)
```
1. Open Telegram
2. Search for @BotFather
3. Send /newbot
4. Follow instructions
5. Copy the token that looks like: 1234567890:ABCdefGHIjklMNO...
```

---

## 2. 🤖 GitHub Secrets (for CI/CD)

Go to: **GitHub Repository → Settings → Secrets and variables → Actions → New repository secret**

### Required Secrets:

```bash
# ============================================
# VERCEL DEPLOYMENT
# ============================================
VERCEL_TOKEN
# Get from: https://vercel.com/account/tokens
# Click: "Create Token" → Give it a name → Copy token

VERCEL_ORG_ID
# Get from: Vercel Dashboard → Settings → General
# Or from .vercel/project.json after first deploy

VERCEL_PROJECT_ID
# Get from: Vercel Dashboard → Project Settings → General
# Or from .vercel/project.json after first deploy

# ============================================
# RAILWAY DEPLOYMENT
# ============================================
RAILWAY_TOKEN
# Get from: https://railway.app/account/tokens
# Click: "Create Token" → Copy token

# ============================================
# APPLICATION URLS (After Deployment)
# ============================================
API_URL
# Your Railway API URL
# Example: https://solo-leveling-api.railway.app

WEB_URL
# Your Vercel frontend URL
# Example: https://solo-leveling.vercel.app

# ============================================
# TELEGRAM
# ============================================
TELEGRAM_BOT_USERNAME
# Your bot username (without @)
# Example: solo_leveling_bot
```

### Step-by-Step: How to Get Each Secret

#### VERCEL_TOKEN
```
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: "GitHub Actions Deploy"
4. Scope: Full Account
5. Click Create
6. Copy the token (starts with vercel_...)
7. Add to GitHub Secrets as VERCEL_TOKEN
```

#### VERCEL_ORG_ID & VERCEL_PROJECT_ID
```bash
# Option 1: Deploy once manually first
cd apps/web
vercel
# After deployment, check .vercel/project.json

# Option 2: Get from Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → General
4. Copy "Project ID" and "Team ID"
```

#### RAILWAY_TOKEN
```
1. Go to https://railway.app/account/tokens
2. Click "Create Token"
3. Name it: "GitHub Actions"
4. Click Create
5. Copy the token
6. Add to GitHub Secrets as RAILWAY_TOKEN
```

#### API_URL (After First Deployment)
```
1. Deploy to Railway first
2. Go to Railway Dashboard → Your API Service
3. Settings → Domains
4. Copy the generated domain
5. Example: https://solo-leveling-api.up.railway.app
6. Add to GitHub Secrets as API_URL
```

#### WEB_URL (After First Deployment)
```
1. Deploy to Vercel first
2. Vercel will show you the URL
3. Example: https://solo-leveling.vercel.app
4. Add to GitHub Secrets as WEB_URL
```

---

## 3. 🚂 Railway Environment Variables

Go to: **Railway Dashboard → Your Service → Variables**

### For API Service:

```env
# ============================================
# DATABASE (Provided by Railway PostgreSQL)
# ============================================
DATABASE_URL=${{Postgres.DATABASE_URL}}
# Railway auto-fills this from connected PostgreSQL

# ============================================
# REDIS (Provided by Railway Redis)
# ============================================
REDIS_URL=${{Redis.REDIS_URL}}
# Railway auto-fills this from connected Redis

# ============================================
# AUTHENTICATION
# ============================================
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
# Use same value as local, or generate new one

JWT_EXPIRATION=7d

# ============================================
# TELEGRAM
# ============================================
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNO...
# Same as local

# ============================================
# APPLICATION
# ============================================
NODE_ENV=production
PORT=3001
LOG_LEVEL=info

# ============================================
# CORS
# ============================================
CORS_ORIGIN=https://your-app.vercel.app
# Your Vercel frontend URL
```

### For Bot Service:

```env
# Same as API service
# Railway can share environment variables between services

# Or manually set:
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=same-as-api-service
TELEGRAM_BOT_TOKEN=same-as-api-service
NODE_ENV=production
```

### How to Set Railway Variables:

```
Method 1: Railway Dashboard
1. Go to Railway Dashboard
2. Select your service (api or bot)
3. Click "Variables" tab
4. Click "New Variable"
5. Enter KEY and VALUE
6. Click "Add"

Method 2: Railway CLI
railway variables set JWT_SECRET="your-secret-here"
railway variables set NODE_ENV="production"

Method 3: Reference Connected Services
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
```

---

## 4. ▲ Vercel Environment Variables

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

### Required Variables:

```env
# ============================================
# API CONNECTION
# ============================================
VITE_API_URL=https://your-api-url.railway.app
# Your Railway API URL (without trailing slash)

# ============================================
# TELEGRAM
# ============================================
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
# Your bot username (without @)
```

### How to Set Vercel Variables:

```
Method 1: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add each variable:
   - Name: VITE_API_URL
   - Value: https://your-api.railway.app
   - Environment: Production, Preview, Development
5. Click "Save"

Method 2: Vercel CLI
vercel env add VITE_API_URL
# Enter value when prompted
# Select environments: Production, Preview, Development

Method 3: vercel.json (Not Recommended for Secrets)
{
  "env": {
    "VITE_API_URL": "@api_url",
    "VITE_TELEGRAM_BOT_USERNAME": "@bot_username"
  }
}
```

---

## 5. 🤖 Telegram Bot Configuration

### Get Bot Token from BotFather

```
1. Open Telegram
2. Search for @BotFather
3. Send: /newbot
4. Enter bot name: "Solo Leveling"
5. Enter username: "solo_leveling_bot" (must end with _bot)
6. Copy the token (1234567890:ABC...)
7. Save it as TELEGRAM_BOT_TOKEN
```

### Create Mini App

```
1. Send to @BotFather: /newapp
2. Select your bot
3. Enter app title: "Solo Leveling"
4. Enter app description: "Gamified habit tracker"
5. Upload photo (512x512 PNG)
6. Upload GIF (optional)
7. Enter Web App URL: https://your-vercel-app.vercel.app
8. Enter short name: "solo_leveling"
```

### Set Bot Commands

```bash
# Run this after deploying (replace YOUR_BOT_TOKEN)
curl -X POST https://api.telegram.org/botYOUR_BOT_TOKEN/setMyCommands \
  -H "Content-Type: application/json" \
  -d '{
    "commands": [
      {"command": "start", "description": "Start your journey"},
      {"command": "profile", "description": "View your profile"},
      {"command": "quests", "description": "View your quests"},
      {"command": "achievements", "description": "View achievements"},
      {"command": "leaderboard", "description": "View rankings"},
      {"command": "help", "description": "Get help"}
    ]
  }'
```

### Set Webhook (After API Deployment)

```bash
# Replace YOUR_BOT_TOKEN and YOUR_API_URL
curl -X POST \
  https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://YOUR_API_URL/api/v1/telegram/webhook"
  }'

# Verify webhook
curl https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo
```

---

## 6. 🗄️ Other Platform Options

### Supabase (PostgreSQL Alternative)

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres

# Get from:
# Supabase Dashboard → Settings → Database → Connection string → URI
```

### Upstash (Redis Alternative)

```env
REDIS_URL=rediss://default:[PASSWORD]@[HOST]:6379

# Get from:
# Upstash Dashboard → Redis → Details → REST URL
```

### Render.com

```env
# Same variables as Railway
# Set in: Render Dashboard → Service → Environment
```

---

## 7. 🔍 Verification Checklist

### Local Development
- [ ] `.env` file created with all variables
- [ ] PostgreSQL running (docker ps shows postgres)
- [ ] Redis running (docker ps shows redis)
- [ ] `pnpm dev` starts without errors
- [ ] Can login at http://localhost:3000

### GitHub Actions
- [ ] All 7 secrets added
- [ ] Workflow runs on push
- [ ] Build succeeds

### Railway
- [ ] PostgreSQL database created
- [ ] Redis database created
- [ ] API service deployed
- [ ] Bot service deployed
- [ ] All environment variables set
- [ ] Health check passes

### Vercel
- [ ] Project deployed
- [ ] Environment variables set
- [ ] Frontend loads
- [ ] Can connect to API

### Telegram Bot
- [ ] Bot created with BotFather
- [ ] Token saved
- [ ] Commands set
- [ ] Webhook configured
- [ ] Bot responds to /start

---

## 8. 🚨 Common Issues

### Issue: JWT_SECRET too short
```
Error: JWT_SECRET must be at least 32 characters

Solution:
Generate new secret: openssl rand -base64 32
```

### Issue: Database connection failed
```
Error: Can't reach database server

Solutions:
1. Check DATABASE_URL format
2. Verify database is running
3. Check firewall/security groups
4. Ensure IP is whitelisted (if required)
```

### Issue: CORS error on frontend
```
Error: Access-Control-Allow-Origin

Solution:
Set CORS_ORIGIN in Railway to your Vercel URL:
CORS_ORIGIN=https://your-app.vercel.app
```

### Issue: Telegram webhook not working
```
Error: Bot not responding

Solutions:
1. Verify TELEGRAM_BOT_TOKEN is correct
2. Check webhook URL: curl bot<TOKEN>/getWebhookInfo
3. Ensure API is publicly accessible
4. Check API logs for errors
```

---

## 9. 🔐 Security Best Practices

### ✅ DO:
- Use different secrets for dev/staging/production
- Rotate secrets regularly (every 90 days)
- Use strong, random JWT secrets (32+ chars)
- Keep secrets in environment variables, not code
- Use secret management tools (GitHub Secrets, Railway vars)
- Enable 2FA on all platforms
- Limit token permissions to minimum required

### ❌ DON'T:
- Commit secrets to Git
- Share secrets in chat/email
- Use same secrets across environments
- Use weak/predictable secrets
- Store secrets in frontend code
- Reuse secrets across projects

---

## 10. 📝 Secret Generation Commands

```bash
# JWT Secret (32 bytes base64)
openssl rand -base64 32

# JWT Secret (hex)
openssl rand -hex 32

# Random password (alphanumeric)
openssl rand -base64 24 | tr -d "=+/" | cut -c1-32

# UUID
uuidgen

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 11. 📋 Copy-Paste Templates

### Local .env Template
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/solo_leveling_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=REPLACE_WITH_32_CHAR_SECRET
JWT_EXPIRATION=7d
TELEGRAM_BOT_TOKEN=REPLACE_WITH_BOTFATHER_TOKEN
NODE_ENV=development
PORT=3001
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000
```

### Railway Production Template
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=REPLACE_WITH_32_CHAR_SECRET
JWT_EXPIRATION=7d
TELEGRAM_BOT_TOKEN=REPLACE_WITH_BOTFATHER_TOKEN
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
CORS_ORIGIN=https://your-app.vercel.app
```

### Vercel Template
```env
VITE_API_URL=https://your-api.railway.app
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
```

---

## 12. 🎯 Quick Setup Script

```bash
#!/bin/bash

echo "🔐 Solo Leveling - Environment Setup"
echo ""

# Generate JWT Secret
JWT_SECRET=$(openssl rand -base64 32)
echo "Generated JWT_SECRET: $JWT_SECRET"
echo ""

# Get Bot Token
read -p "Enter TELEGRAM_BOT_TOKEN from BotFather: " BOT_TOKEN
echo ""

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/solo_leveling_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=$JWT_SECRET
JWT_EXPIRATION=7d
TELEGRAM_BOT_TOKEN=$BOT_TOKEN
NODE_ENV=development
PORT=3001
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000
EOF

echo "✅ .env file created!"
echo ""
echo "Next steps:"
echo "1. Start services: pnpm docker:dev"
echo "2. Setup database: pnpm db:migrate && pnpm db:seed"
echo "3. Start app: pnpm dev"
```

Save as `scripts/setup-env.sh` and run:
```bash
chmod +x scripts/setup-env.sh
./scripts/setup-env.sh
```

---

## 📞 Need Help?

- 📖 [Deployment Guide](./DEPLOYMENT.md)
- 📚 [Quick Start](./QUICKSTART.md)
- 🐛 [Report Issues](https://github.com/your-repo/issues)

---

**Security Note**: Never commit your `.env` file or expose secrets publicly!

