# 🎮 Solo Leveling - Telegram Mini App

<div align="center">

![Solo Leveling](https://img.shields.io/badge/Solo_Leveling-Habit_Tracker-8b5cf6?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Transform your daily habits into an epic RPG adventure! 🚀

</div>

## 📖 Overview

Solo Leveling is a gamified habit tracking Telegram Mini App inspired by the popular anime/manga. Complete daily quests, level up your character, unlock achievements, and compete with friends on the leaderboard!

## ✨ Features

- 🎯 **Quest System**: Transform daily tasks into RPG quests
- ⚡ **XP & Leveling**: Gain experience and rise through hunter ranks
- 📊 **Character Stats**: Strength, Agility, Intelligence, Vitality, Sense
- 🏆 **Achievements**: Unlock titles and badges
- 🔥 **Streak Tracking**: Maintain your daily quest completion streak
- 👥 **Leaderboards**: Compete with friends globally
- 🎨 **Solo Leveling Theme**: Dark, futuristic UI with smooth animations
- 📱 **Telegram Integration**: Native Telegram Mini App experience

## 🏗️ Architecture

This project uses a modern **monorepo** structure powered by:

- **Turborepo**: Fast builds and caching
- **pnpm**: Efficient package management
- **TypeScript**: Type-safe code across all packages
- **Docker**: Containerized deployment

### Project Structure

```
├── apps/
│   ├── web/          # React frontend (Vite + Tailwind)
│   ├── api/          # Backend API (Express + Prisma)
│   └── bot/          # Telegram Bot (Grammy)
├── packages/
│   ├── database/     # Prisma schema & client
│   ├── shared/       # Shared types, utils, constants
│   ├── ui/           # UI component library
│   ├── telegram-sdk/ # Telegram Mini App SDK wrapper
│   └── config/       # Shared configurations
└── docker/           # Docker configurations
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Docker & Docker Compose
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd test_telegram_mini_app
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development services**
```bash
# Start PostgreSQL & Redis
pnpm docker:dev

# Run database migrations
pnpm db:migrate

# Seed the database
pnpm db:seed
```

5. **Start development servers**
```bash
# Start all apps in parallel
pnpm dev
```

The apps will be available at:
- Web App: http://localhost:3000
- API: http://localhost:3001
- Database Studio: http://localhost:5555 (run `pnpm db:studio`)

## 📦 Available Commands

### Root Commands
```bash
pnpm dev              # Start all apps in development mode
pnpm build            # Build all packages and apps
pnpm test             # Run all tests
pnpm lint             # Lint all packages
pnpm format           # Format code with Prettier
pnpm clean            # Clean all build artifacts
```

### Database Commands
```bash
pnpm db:migrate       # Run database migrations
pnpm db:push          # Push schema changes (dev)
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Seed the database
```

### Docker Commands
```bash
pnpm docker:dev       # Start development services
pnpm docker:prod      # Start production stack
pnpm docker:down      # Stop all containers
```

## 🎨 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Query** - Data fetching
- **React Router** - Routing

### Backend
- **Express** - Web framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **Redis** - Caching
- **Zod** - Validation
- **JWT** - Authentication
- **Winston** - Logging

### DevOps
- **Docker** - Containerization
- **Turborepo** - Monorepo management
- **pnpm** - Package manager
- **GitHub Actions** - CI/CD
- **Nginx** - Reverse proxy

## 🎮 Game Mechanics

### Leveling System
XP Formula: `XP = 100 * level^1.5`

### Hunter Ranks
- Level 1-9: **E-Rank Hunter**
- Level 10-24: **D-Rank Hunter**
- Level 25-49: **C-Rank Hunter**
- Level 50-74: **B-Rank Hunter**
- Level 75-99: **A-Rank Hunter**
- Level 100-149: **S-Rank Hunter**
- Level 150-199: **National Level Hunter**
- Level 200+: **Shadow Monarch**

### Quest Categories
- 🚿 **Hygiene**: Morning routine, skincare
- 💪 **Fitness**: Workouts, running, steps
- 🍎 **Health**: Water, meals, sleep
- 📚 **Learning**: Reading, studying, languages
- 🧘 **Mindfulness**: Meditation, journaling
- ✅ **Productivity**: Tasks, planning
- 👥 **Social**: Interactions, calls

## 📱 Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Set up Mini App:
   ```
   /newapp
   /setmenubutton - Set the menu button URL
   ```
4. Configure webhook (production):
   ```bash
   curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
     -d "url=https://yourdomain.com/api/webhook"
   ```

## 🔒 Security

- ✅ Telegram InitData validation
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ SQL injection prevention (Prisma)

## 📊 Performance

- ⚡ Code splitting
- ⚡ Image optimization
- ⚡ Redis caching
- ⚡ Database indexing
- ⚡ Lazy loading
- ⚡ Service Worker

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

## 📝 Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in 5 minutes
- **[Architecture Overview](./ARCHITECTURE.md)** - System design & patterns
- **[Implementation Plan](./IMPLEMENTATION_PLAN.md)** - 8-week development roadmap
- **[Progress Tracker](./PROGRESS.md)** - Detailed checklist with completion status
- **[Final Summary](./FINAL_SUMMARY.md)** - Complete project overview
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute
- **[Changelog](./CHANGELOG.md)** - Version history

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by [Solo Leveling](https://en.wikipedia.org/wiki/Solo_Leveling) by Chugong
- Built with [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- Icons from [Lucide Icons](https://lucide.dev/)

## 📬 Contact

For questions or support, reach out via [Telegram](https://t.me/your_username)

---

<div align="center">

**Rise from E-Rank to Shadow Monarch! 🚀**

Made with ❤️ by the Solo Leveling Team

</div>
