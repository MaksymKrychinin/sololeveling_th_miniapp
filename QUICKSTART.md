# 🚀 Quick Start Guide

## Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 8.0.0
- **Docker** & **Docker Compose**
- **Telegram Bot Token** from [@BotFather](https://t.me/botfather)

## Installation Steps

### 1️⃣ Install Dependencies

```bash
pnpm install
```

This will install all dependencies for the monorepo (~30 seconds).

### 2️⃣ Setup Environment

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/solo_leveling

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
WEB_APP_URL=https://your-app-url.com

# API
PORT=3001
CORS_ORIGIN=http://localhost:3000

# Node
NODE_ENV=development
```

### 3️⃣ Start Services

```bash
# Start PostgreSQL & Redis via Docker
pnpm docker:dev
```

Wait for services to be ready (~10 seconds).

### 4️⃣ Setup Database

```bash
# Generate Prisma Client
pnpm --filter @solo-leveling/database db:generate

# Run migrations
pnpm db:migrate

# Seed database with templates
pnpm db:seed
```

### 5️⃣ Start Development

```bash
# Start all apps (web, api, bot)
pnpm dev
```

This command runs:
- **Web**: http://localhost:3000
- **API**: http://localhost:3001
- **Bot**: Running in background

### 6️⃣ Open Prisma Studio (Optional)

```bash
# In a new terminal
pnpm db:studio
```

Opens at: http://localhost:5555

## Project Structure

```
test_telegram_mini_app/
├── apps/
│   ├── web/          # Frontend (React + Vite)
│   ├── api/          # Backend (Express)
│   └── bot/          # Telegram Bot (Grammy)
├── packages/
│   ├── shared/       # Types, utils, constants
│   ├── ui/           # UI components
│   ├── telegram-sdk/ # Telegram hooks
│   ├── database/     # Prisma schema
│   └── config/       # Shared configs
└── docker/           # Docker files
```

## Available Commands

### Root Commands

```bash
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all packages
pnpm lint             # Lint all code
pnpm format           # Format code with Prettier
pnpm clean            # Clean all build artifacts
```

### Database Commands

```bash
pnpm db:generate      # Generate Prisma Client
pnpm db:migrate       # Run database migrations
pnpm db:push          # Push schema changes (dev only)
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Seed database
```

### Deployment Commands

```bash
pnpm deploy:railway          # Deploy to Railway (API + Bot)
pnpm deploy:vercel           # Deploy to Vercel (Frontend)
pnpm deploy:setup-db         # Setup remote database
pnpm deploy:setup-telegram   # Configure Telegram bot
```

### Docker Commands

```bash
pnpm docker:dev       # Start dev services (PostgreSQL, Redis)
pnpm docker:prod      # Start full production stack
pnpm docker:down      # Stop all containers
```

### Individual Apps

```bash
# Web app only
pnpm --filter web dev

# API only
pnpm --filter api dev

# Bot only
pnpm --filter bot dev
```

## Telegram Bot Setup

### 1. Create Bot

1. Open [@BotFather](https://t.me/botfather)
2. Send `/newbot`
3. Follow instructions
4. Copy the token to `.env`

### 2. Create Mini App

1. Send `/newapp` to [@BotFather](https://t.me/botfather)
2. Select your bot
3. Upload icon (optional)
4. Enter app URL: `https://your-domain.com`
5. Set short name

### 3. Set Menu Button

```bash
# Use this curl command (replace YOUR_BOT_TOKEN)
curl -X POST https://api.telegram.org/botYOUR_BOT_TOKEN/setChatMenuButton \
  -H "Content-Type: application/json" \
  -d '{
    "menu_button": {
      "type": "web_app",
      "text": "Open App",
      "web_app": {
        "url": "https://your-domain.com"
      }
    }
  }'
```

## Production Deployment

### Using Docker Compose

```bash
# 1. Build images
docker-compose build

# 2. Start services
docker-compose up -d
```

### Manual Deployment

```bash
# 1. Build all apps
pnpm build

# 2. Run migrations
pnpm db:migrate:deploy

# 3. Start services
NODE_ENV=production node apps/api/dist/index.js
NODE_ENV=production node apps/bot/dist/index.js
# Serve apps/web/dist with Nginx
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart services
pnpm docker:down
pnpm docker:dev
```

### Prisma Client Not Generated

```bash
pnpm --filter @solo-leveling/database db:generate
```

### Build Errors

```bash
# Clean all builds and reinstall
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e
```

## Next Steps

1. ✅ **Phase 0 Complete** - Infrastructure is ready
2. ✅ **Phase 1 Complete** - Backend controllers & services implemented
3. ✅ **Phase 2 Complete** - Frontend components & pages built
4. ✅ **Achievements System** - Full implementation with rewards & tracking
5. ✅ **CI/CD & Deployment** - GitHub Actions + free hosting options
6. 🚧 **Phase 3** - Add more animations & polish
7. 🚧 **Phase 4** - Testing & optimization
8. 🚧 **Phase 5** - Production launch

## Documentation

- [Architecture](./ARCHITECTURE.md) - System design & patterns
- [Deployment Guide](./DEPLOYMENT.md) - Free hosting options & CI/CD
- [Achievements & Deployment Complete](./ACHIEVEMENTS_DEPLOYMENT_COMPLETE.md) - Latest implementation
- [Implementation Plan](./IMPLEMENTATION_PLAN.md) - 8-week roadmap
- [Progress Tracker](./PROGRESS.md) - Detailed checklist
- [Contributing](./CONTRIBUTING.md) - How to contribute

## Support

- 📖 Check documentation files
- 🐛 Report bugs via GitHub Issues
- 💬 Ask questions in GitHub Discussions
- 📧 Contact: your-email@example.com

## License

MIT License - see [LICENSE](./LICENSE) file

---

**Ready to level up from E-Rank to Shadow Monarch! 💜⚡**
