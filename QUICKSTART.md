# Quick Start Guide - Solo Leveling Telegram Mini App

## 🐳 Quick Start with Docker (Recommended - 2 minutes)

The easiest way to get started! No need to install Node.js, PostgreSQL, or manage dependencies.

### Prerequisites
- **Docker** & **Docker Compose** ([Install Docker](https://docs.docker.com/get-docker/))
- **Telegram Account** for testing

### One-Command Start
```bash
# Clone the repository
git clone <your-repo-url>
cd test_telegram_mini_app

# Copy and edit .env file
cp .env.example .env
# Edit .env with your TELEGRAM_BOT_TOKEN

# Run the interactive start script
./docker-start.sh
```

The script provides a menu with options:
1. **Development Mode** - With hot reload (recommended for development)
2. **Production Mode** - Optimized build
3. **Stop All** - Stop containers
4. **Clean Up** - Remove containers and volumes
5. **View Logs** - Monitor container logs
6. **Database Shell** - Access PostgreSQL
7. **Prisma Studio** - Database GUI (http://localhost:5555)
8. **Rebuild** - Rebuild all images

### Manual Docker Commands
```bash
# Development mode (with hot reload)
docker-compose -f docker-compose.dev.yml up -d

# Production mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Services
After starting, you'll have:
- **Frontend**: http://localhost:5173 (dev) or http://localhost (prod)
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Prisma Studio**: http://localhost:5555 (dev mode only)

---

## 💻 Manual Setup (Alternative)

If you prefer to run without Docker or need more control:

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))
- **Telegram Account** for testing
- **Code Editor** (VS Code recommended)

## ⚡ Quick Setup (5 minutes)

### 1. Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd test_telegram_mini_app

# Install dependencies
npm install
```

### 2. Set Up Database
```bash
# Create PostgreSQL database
createdb solo_leveling_db

# Or using psql
psql -U postgres
CREATE DATABASE solo_leveling_db;
\q
```

### 3. Configure Environment
```bash
# Copy environment example
cp .env.example .env

# Edit .env with your values
nano .env  # or open with any editor
```

**Minimum required .env values:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/solo_leveling_db"
TELEGRAM_BOT_TOKEN="your_bot_token_from_botfather"
JWT_SECRET="your_random_secret_key"
```

### 4. Initialize Database
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed initial data (quest templates, achievements)
npm run prisma:seed
```

### 5. Start Development
```bash
# Terminal 1: Start backend server
npm run server:dev

# Terminal 2: Start frontend
npm run dev
```

Your app should now be running at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

## 📱 Setting Up Telegram Bot

### Create Your Bot
1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the prompts to name your bot
4. Copy the bot token (you'll need this for `.env`)

### Create Mini App
1. Send `/newapp` to @BotFather
2. Select your bot
3. Enter app title: "Solo Leveling Quest Tracker"
4. Add description
5. Upload app icon (512x512 px)
6. Upload preview GIF/photo
7. Set Web App URL: `http://localhost:5173` (for development)

### Configure Bot Commands
Send this to @BotFather:
```
/setcommands
```

Then paste:
```
start - Begin your journey as a Hunter
profile - View your stats and level
quests - See today's quests
achievements - View unlocked achievements
leaderboard - See top hunters
settings - Configure app settings
help - Get help and support
```

## 🧪 Testing Your Setup

### 1. Test Database Connection
```bash
npm run prisma:studio
```
Opens Prisma Studio at http://localhost:5555 - you should see your database tables.

### 2. Test Backend API
```bash
# In a new terminal
curl http://localhost:3000/api/health
```
Should return: `{"status":"ok"}`

### 3. Test Frontend
Open http://localhost:5173 in your browser - you should see the app loading screen.

### 4. Test Telegram Integration
1. Open your bot in Telegram
2. Click "Menu" button
3. Select your Mini App
4. It should load your local app

**Note:** For local testing, you may need to use a tunneling service like ngrok:
```bash
# Install ngrok
brew install ngrok  # macOS
# or download from https://ngrok.com/

# Create tunnel
ngrok http 5173

# Use the ngrok URL in BotFather's Web App URL setting
```

## 📝 First Development Tasks

Now that your environment is set up, try these tasks to familiarize yourself:

### Task 1: View Quest Templates
```bash
npm run prisma:studio
```
Navigate to `quests` table and see the seeded quest templates.

### Task 2: Make Your First Code Change
1. Open `src/App.tsx`
2. Find the welcome message
3. Change it to something fun
4. Save and see hot reload in action

### Task 3: Test API Endpoint
Create a simple test user:
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"telegramId": 123456789, "username": "testuser"}'
```

### Task 4: Create Your First Quest
Using Prisma Studio:
1. Go to `quests` table
2. Click "Add record"
3. Fill in the quest details
4. Click Save

## 🐛 Common Issues & Solutions

### Issue: "Port 3000 already in use"
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port in .env
PORT=3001
```

### Issue: "Database connection failed"
```bash
# Check PostgreSQL is running
pg_isready

# If not, start it
brew services start postgresql  # macOS
sudo service postgresql start   # Linux
```

### Issue: "Prisma Client not generated"
```bash
npm run prisma:generate
```

### Issue: "Module not found" errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Telegram Bot not loading app
- Make sure your app URL is publicly accessible (use ngrok for local dev)
- Check that HTTPS is enabled (required for Telegram)
- Verify BOT_TOKEN in .env is correct

## 📚 Next Steps

### Learn the Codebase
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
2. Review [PROJECT_SPEC.md](./PROJECT_SPEC.md) for features
3. Check [.github/copilot-instructions.md](./.github/copilot-instructions.md) for development guidelines
4. Follow [MILESTONES.md](./MILESTONES.md) for development roadmap

### Start Developing
1. Pick a task from [MILESTONES.md](./MILESTONES.md)
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test thoroughly
5. Commit with descriptive message
6. Push and create pull request

### Useful Commands
```bash
# Development
npm run dev              # Start frontend dev server
npm run server:dev       # Start backend dev server
npm run prisma:studio    # Open database GUI

# Building
npm run build           # Build frontend for production
npm run server:build    # Build backend for production

# Code Quality
npm run lint            # Check code style
npm run format          # Format code with Prettier
npm run type-check      # Check TypeScript types

# Testing
npm run test            # Run tests
npm run test:ui         # Run tests with UI
npm run test:coverage   # Generate coverage report

# Database
npm run prisma:migrate  # Create and run migrations
npm run prisma:seed     # Seed database with initial data
npm run prisma:reset    # Reset database (⚠️ deletes all data)
```

## 🎯 Development Workflow

### Daily Workflow
1. Pull latest changes: `git pull origin main`
2. Install any new dependencies: `npm install`
3. Run migrations: `npm run prisma:migrate`
4. Start dev servers (backend + frontend)
5. Code, test, commit, push

### Before Committing
```bash
# Format code
npm run format

# Fix linting issues
npm run lint --fix

# Check types
npm run type-check

# Run tests
npm run test

# If all passes, commit
git add .
git commit -m "feat: your feature description"
git push
```

## 🔧 IDE Setup (VS Code)

### Recommended Extensions
Install these for the best development experience:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- TypeScript Vue Plugin (Volar)
- GitLens
- Error Lens

### VS Code Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## 🚀 Deployment Preparation

When you're ready to deploy:

### 1. Update Environment Variables
Create production `.env` with real values (never commit this!)

### 2. Update Telegram Bot Settings
In @BotFather, update Web App URL to your production domain

### 3. Build for Production
```bash
npm run build
npm run server:build
```

### 4. Test Production Build
```bash
# Serve production build locally
npm run preview
```

### 5. Deploy
Follow deployment guides for:
- [Vercel](https://vercel.com/docs) (frontend)
- [Railway](https://docs.railway.app/) (backend + database)
- or use Docker: `docker-compose up -d`

## 💡 Tips for Success

1. **Read Documentation First** - Save time by understanding the architecture
2. **Use Prisma Studio** - Visual database management is easier
3. **Test in Telegram** - Always test in actual Telegram app, not just browser
4. **Follow Conventions** - Code standards are in `.cursorrules`
5. **Ask for Help** - Check GitHub issues or create new ones
6. **Commit Often** - Small, frequent commits are better
7. **Write Tests** - Future you will thank present you
8. **Use Haptic Feedback** - Makes the app feel native in Telegram

## 📞 Getting Help

- **Documentation**: Start with README.md
- **Architecture Questions**: See ARCHITECTURE.md
- **Feature Questions**: Check PROJECT_SPEC.md
- **Code Standards**: Review .cursorrules
- **Bug Reports**: Create GitHub issue
- **Questions**: Open GitHub discussion

## 🎉 You're Ready!

You now have everything set up to start building the Solo Leveling Telegram Mini App. 

**Your next steps:**
1. Explore the codebase
2. Read the architecture document
3. Pick your first milestone from MILESTONES.md
4. Start coding!

Remember: **Arise and level up your development skills!** 🗡️

---

*Last updated: 2026-05-10*
