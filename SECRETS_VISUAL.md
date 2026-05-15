# 🎯 Secrets Configuration - Visual Guide

```
┌─────────────────────────────────────────────────────────────────────┐
│                    SOLO LEVELING SECRETS MAP                        │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  1️⃣  LOCAL DEVELOPMENT (.env)                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📁 File: .env (project root)                                       │
│  📝 Command: ./scripts/setup-env.sh   (auto-generates)              │
│                                                                     │
│  Required Variables (8):                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ DATABASE_URL    postgresql://postgres:postgres@localhost... │   │
│  │ REDIS_URL       redis://localhost:6379                      │   │
│  │ JWT_SECRET      [Generate: openssl rand -base64 32]        │   │
│  │ JWT_EXPIRATION  7d                                          │   │
│  │ TELEGRAM_BOT_TOKEN  [Get from @BotFather]                  │   │
│  │ NODE_ENV        development                                 │   │
│  │ PORT            3001                                        │   │
│  │ CORS_ORIGIN     http://localhost:3000                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  2️⃣  GITHUB ACTIONS (CI/CD)                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📁 Location: GitHub → Settings → Secrets → Actions                 │
│                                                                     │
│  Required Secrets (7):                                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ VERCEL_TOKEN         [vercel.com/account/tokens]           │   │
│  │ VERCEL_ORG_ID        [From Vercel project settings]        │   │
│  │ VERCEL_PROJECT_ID    [From Vercel project settings]        │   │
│  │ RAILWAY_TOKEN        [railway.app/account/tokens]          │   │
│  │ API_URL              [After Railway deploy]                │   │
│  │ WEB_URL              [After Vercel deploy]                 │   │
│  │ TELEGRAM_BOT_USERNAME  your_bot_username (no @)            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  3️⃣  RAILWAY (Backend - API + Bot)                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📁 Location: Railway Dashboard → Service → Variables                │
│                                                                     │
│  Required Variables (8):                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ DATABASE_URL     ${{Postgres.DATABASE_URL}} [Auto]         │   │
│  │ REDIS_URL        ${{Redis.REDIS_URL}} [Auto]               │   │
│  │ JWT_SECRET       [Same as local or new]                    │   │
│  │ JWT_EXPIRATION   7d                                         │   │
│  │ TELEGRAM_BOT_TOKEN  [Same as local]                        │   │
│  │ NODE_ENV         production                                │   │
│  │ PORT             3001                                       │   │
│  │ CORS_ORIGIN      https://your-app.vercel.app               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  💡 Tip: Railway can share variables between services               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  4️⃣  VERCEL (Frontend)                                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📁 Location: Vercel Dashboard → Project → Settings → Env Vars      │
│                                                                     │
│  Required Variables (2):                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ VITE_API_URL              https://your-api.railway.app     │   │
│  │ VITE_TELEGRAM_BOT_USERNAME  your_bot_username              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ⚙️  Environment: Production, Preview, Development (select all)     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  SETUP FLOW                                                         │
└─────────────────────────────────────────────────────────────────────┘

Step 1: Get Telegram Bot Token
         ↓
   Open @BotFather → /newbot → Copy token
         ↓
Step 2: Setup Local Environment
         ↓
   Run: ./scripts/setup-env.sh
   (Generates JWT_SECRET automatically)
         ↓
Step 3: Test Locally
         ↓
   pnpm docker:dev
   pnpm db:migrate && pnpm db:seed
   pnpm dev
         ↓
Step 4: Deploy Backend (Railway)
         ↓
   pnpm deploy:railway
   → Creates PostgreSQL + Redis
   → Sets variables
   → Deploys API + Bot
   → Copy API_URL from dashboard
         ↓
Step 5: Deploy Frontend (Vercel)
         ↓
   pnpm deploy:vercel
   → Set VITE_API_URL = Railway API URL
   → Set VITE_TELEGRAM_BOT_USERNAME
   → Copy WEB_URL from dashboard
         ↓
Step 6: GitHub Secrets (for CI/CD)
         ↓
   Add all 7 secrets to GitHub
         ↓
Step 7: Configure Telegram
         ↓
   pnpm deploy:setup-telegram
   → Sets webhook
   → Sets bot commands
         ↓
✅ DONE! Test your bot!

┌─────────────────────────────────────────────────────────────────────┐
│  CRITICAL SECRETS (⚠️ Never commit to Git!)                          │
└─────────────────────────────────────────────────────────────────────┘

  1. JWT_SECRET
     • Must be 32+ characters
     • Unique per environment
     • Generate: openssl rand -base64 32
     
  2. TELEGRAM_BOT_TOKEN
     • Format: 1234567890:ABC...
     • Get from @BotFather
     • Keep private!
     
  3. DATABASE_URL
     • Contains database password
     • Different per environment
     
  4. Platform Tokens
     • VERCEL_TOKEN
     • RAILWAY_TOKEN
     • Keep secure!

┌─────────────────────────────────────────────────────────────────────┐
│  VERIFICATION CHECKLIST                                             │
└─────────────────────────────────────────────────────────────────────┘

  Local Development:
  □ .env file created
  □ JWT_SECRET is 32+ chars
  □ TELEGRAM_BOT_TOKEN from BotFather
  □ Docker services running
  □ pnpm dev works
  □ Can login at localhost:3000
  
  GitHub:
  □ All 7 secrets added
  □ Workflow runs successfully
  
  Railway:
  □ PostgreSQL created
  □ Redis created
  □ All 8 variables set
  □ API deployed
  □ Bot deployed
  □ Health check passes
  
  Vercel:
  □ Both variables set
  □ Frontend deployed
  □ Can access site
  □ API connection works
  
  Telegram:
  □ Webhook configured
  □ Bot commands set
  □ Menu button configured
  □ Bot responds to /start

┌─────────────────────────────────────────────────────────────────────┐
│  QUICK COMMANDS                                                     │
└─────────────────────────────────────────────────────────────────────┘

  # Setup everything automatically
  ./scripts/setup-env.sh
  
  # Generate JWT Secret
  openssl rand -base64 32
  
  # Test local environment
  pnpm dev
  
  # Deploy everything
  pnpm deploy:railway     # Backend
  pnpm deploy:vercel      # Frontend
  pnpm deploy:setup-telegram  # Bot config

┌─────────────────────────────────────────────────────────────────────┐
│  DOCUMENTATION                                                      │
└─────────────────────────────────────────────────────────────────────┘

  📖 Complete Guide:    SECRETS_AND_VARS.md
  ⚡ Quick Reference:   SECRETS_QUICK_REF.md
  🚀 Deployment:        DEPLOYMENT.md
  🏃 Quick Start:       QUICKSTART.md

┌─────────────────────────────────────────────────────────────────────┐
│  SUPPORT                                                            │
└─────────────────────────────────────────────────────────────────────┘

  Need help?
  • Read: SECRETS_AND_VARS.md (detailed guide)
  • Run: ./scripts/setup-env.sh (auto-setup)
  • Check: .env.example (template)

  Common issues:
  • JWT_SECRET too short → openssl rand -base64 32
  • Database won't connect → Check docker ps
  • CORS error → Set CORS_ORIGIN correctly
  • Bot not responding → Verify webhook

```
