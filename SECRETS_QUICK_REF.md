# 🔐 Secrets Quick Reference Card

## 📋 Summary

| Location | # Variables | Names |
|----------|-------------|-------|
| **Local (.env)** | 8 | DATABASE_URL, REDIS_URL, JWT_SECRET, JWT_EXPIRATION, TELEGRAM_BOT_TOKEN, NODE_ENV, PORT, CORS_ORIGIN |
| **GitHub Secrets** | 7 | VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID, RAILWAY_TOKEN, API_URL, WEB_URL, TELEGRAM_BOT_USERNAME |
| **Railway** | 7-8 | DATABASE_URL, REDIS_URL, JWT_SECRET, JWT_EXPIRATION, TELEGRAM_BOT_TOKEN, NODE_ENV, PORT, CORS_ORIGIN |
| **Vercel** | 2 | VITE_API_URL, VITE_TELEGRAM_BOT_USERNAME |

---

## 🚀 Quick Setup Commands

```bash
# 1. Automatic Setup (Recommended)
./scripts/setup-env.sh

# 2. Manual Setup
cp .env.example .env
# Then edit .env with your values

# 3. Generate JWT Secret
openssl rand -base64 32

# 4. Get Telegram Bot Token
# Open https://t.me/BotFather → /newbot
```

---

## 🔑 Most Important Secrets

### 1. JWT_SECRET ⚠️ CRITICAL
```bash
# Generate with:
openssl rand -base64 32

# Must be:
- Minimum 32 characters
- Unique per environment
- Random and secure
- Same across API and Bot services
```

### 2. TELEGRAM_BOT_TOKEN 🤖
```bash
# Get from BotFather:
1. Open https://t.me/BotFather
2. Send: /newbot
3. Follow prompts
4. Copy token: 1234567890:ABC...

# Format: NUMBER:ALPHANUMERIC_STRING
```

### 3. DATABASE_URL 🗄️
```bash
# Local Development:
postgresql://postgres:postgres@localhost:5432/solo_leveling_dev

# Production (Railway):
${{Postgres.DATABASE_URL}}  # Auto-filled

# Production (Supabase):
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

---

## 📍 Where to Set Each Secret

### Local Development
```bash
File: .env (root directory)
All 8 variables listed above
```

### GitHub Actions (CI/CD)
```
Location: GitHub → Settings → Secrets → Actions

Required:
✓ VERCEL_TOKEN          (from vercel.com/account/tokens)
✓ VERCEL_ORG_ID         (from Vercel project settings)
✓ VERCEL_PROJECT_ID     (from Vercel project settings)
✓ RAILWAY_TOKEN         (from railway.app/account/tokens)
✓ API_URL               (after Railway deployment)
✓ WEB_URL               (after Vercel deployment)
✓ TELEGRAM_BOT_USERNAME (your bot username without @)
```

### Railway Dashboard
```
Location: Railway → Service → Variables

For API Service:
✓ DATABASE_URL          → ${{Postgres.DATABASE_URL}}
✓ REDIS_URL            → ${{Redis.REDIS_URL}}
✓ JWT_SECRET           → (copy from local or generate new)
✓ JWT_EXPIRATION       → 7d
✓ TELEGRAM_BOT_TOKEN   → (same as local)
✓ NODE_ENV             → production
✓ PORT                 → 3001
✓ CORS_ORIGIN          → https://your-app.vercel.app

For Bot Service:
(Same as API - Railway can share variables)
```

### Vercel Dashboard
```
Location: Vercel → Project → Settings → Environment Variables

✓ VITE_API_URL              → https://your-api.railway.app
✓ VITE_TELEGRAM_BOT_USERNAME → your_bot_username

Environment: Production, Preview, Development (select all)
```

---

## ⚡ Super Quick Setup (Copy-Paste)

### Step 1: Local .env
```bash
cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/solo_leveling_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=REPLACE_WITH_OUTPUT_FROM_COMMAND_BELOW
JWT_EXPIRATION=7d
TELEGRAM_BOT_TOKEN=REPLACE_WITH_BOTFATHER_TOKEN
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
EOF

# Generate JWT Secret and update .env
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env.tmp && \
  grep -v "JWT_SECRET" .env | cat - .env.tmp > .env.new && \
  mv .env.new .env && rm .env.tmp
```

### Step 2: Get Bot Token
```
1. Open: https://t.me/BotFather
2. Send: /newbot
3. Copy token
4. Update .env: TELEGRAM_BOT_TOKEN=<paste-token>
```

### Step 3: Frontend .env
```bash
mkdir -p apps/web
cat > apps/web/.env << 'EOF'
VITE_API_URL=http://localhost:3001
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
EOF
```

---

## 🎯 Deployment Order

```
1. Create Bot Token (BotFather)
   ↓
2. Setup Local Environment (.env)
   ↓
3. Test Locally (pnpm dev)
   ↓
4. Deploy to Railway (backend)
   → Get API_URL
   ↓
5. Deploy to Vercel (frontend)
   → Get WEB_URL
   ↓
6. Setup GitHub Secrets
   ↓
7. Configure Telegram Webhook
```

---

## 🔒 Security Checklist

- [ ] `.env` file in `.gitignore` ✓ (already configured)
- [ ] JWT_SECRET is random 32+ chars
- [ ] JWT_SECRET different per environment
- [ ] TELEGRAM_BOT_TOKEN kept private
- [ ] No secrets in frontend code
- [ ] CORS_ORIGIN set to production URL
- [ ] All GitHub Secrets added
- [ ] Platform environment variables set

---

## 🆘 Quick Troubleshooting

### "JWT_SECRET too short"
```bash
# Regenerate:
openssl rand -base64 32
```

### "Can't connect to database"
```bash
# Check if running:
docker ps | grep postgres

# Restart:
pnpm docker:down && pnpm docker:dev
```

### "CORS error"
```bash
# Update CORS_ORIGIN in Railway:
CORS_ORIGIN=https://your-vercel-url.vercel.app
```

### "Bot not responding"
```bash
# Verify token:
curl https://api.telegram.org/bot<TOKEN>/getMe

# Check webhook:
curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
```

---

## 📚 Full Documentation

For detailed setup instructions:
- **Complete Guide**: [SECRETS_AND_VARS.md](./SECRETS_AND_VARS.md)
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Quick Start**: [QUICKSTART.md](./QUICKSTART.md)

---

## 💡 Pro Tips

1. **Use the setup script**: `./scripts/setup-env.sh` - does everything automatically
2. **Different secrets per environment** - Never reuse production secrets in development
3. **Rotate regularly** - Change JWT_SECRET every 90 days
4. **Use Railway variables** - Reference connected services with `${{Postgres.DATABASE_URL}}`
5. **Enable 2FA** - On all platforms (GitHub, Railway, Vercel)

---

**Need help?** See [SECRETS_AND_VARS.md](./SECRETS_AND_VARS.md) for complete details!
