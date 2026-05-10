# 🎮 Solo Leveling: Daily Quest Tracker

> Transform your daily habits into an epic RPG adventure inspired by Solo Leveling

A gamified habit tracking Telegram Mini App where completing real-life tasks helps you level up, earn achievements, and become a legendary hunter.

## 🌟 Features

### Core Gameplay
- **Quest System**: Complete daily tasks to gain XP and level up
- **Character Stats**: Build your stats through different task categories
  - 💪 Strength (Gym, Sports)
  - 🏃 Agility (Running, Cardio)
  - 🧠 Intelligence (Reading, Learning)
  - ❤️ Vitality (Health, Nutrition)
  - 👁️ Sense (Mindfulness, Awareness)
- **Ranking System**: Progress from E-Rank to Shadow Monarch
- **Achievements**: Unlock special titles and badges
- **Streak Tracking**: Maintain your daily quest streaks for bonus rewards
- **Leaderboards**: Compete with friends

### Quest Categories
- **Hygiene**: Shower, brush teeth, skincare
- **Health**: Water intake, healthy meals, vitamins
- **Fitness**: Gym, running, steps, stretching
- **Learning**: Reading, vocabulary, studying
- **Mindfulness**: Meditation, journaling, gratitude
- **Productivity**: Tasks, planning, organization
- **Custom**: Create your own quests

## 🎨 Design

Inspired by Solo Leveling's dark, futuristic aesthetic:
- Deep purple and cyan color scheme
- Dark mode interface
- Glowing effects and animations
- Card-based layout
- Smooth transitions and particle effects

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS
- @telegram-apps/sdk-react
- Zustand for state management
- Framer Motion for animations

### Backend
- Node.js with Express or Next.js API routes
- PostgreSQL database
- Prisma ORM
- JWT authentication
- RESTful API

### DevOps
- Docker for containerization
- GitHub Actions for CI/CD
- Vercel/Railway for deployment

## 📁 Project Structure

```
/
├── src/
│   ├── components/      # React components
│   │   ├── common/      # Reusable UI components
│   │   ├── layout/      # Layout components
│   │   ├── quest/       # Quest-related components
│   │   ├── profile/     # Profile components
│   │   └── animations/  # Animation components
│   ├── pages/           # App pages/routes
│   ├── hooks/           # Custom React hooks
│   ├── store/           # State management
│   ├── services/        # API services
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript types
│   └── styles/          # Global styles
├── server/              # Backend code
│   ├── routes/          # API routes
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   └── database/        # Database schema & migrations
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static assets
└── tests/               # Test files
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Telegram Bot Token
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd test_telegram_mini_app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/solo_leveling"
TELEGRAM_BOT_TOKEN="your_bot_token"
JWT_SECRET="your_secret_key"
NODE_ENV="development"
API_URL="http://localhost:3000"
```

4. **Set up database**
```bash
# Run migrations
npm run prisma:migrate

# Seed initial data (optional)
npm run prisma:seed
```

5. **Start development server**
```bash
npm run dev
```

The app should now be running at `http://localhost:5173` (frontend) and `http://localhost:3000` (API)

## 📱 Telegram Bot Setup

1. Create a new bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Set up Mini App with BotFather command: `/newapp`
4. Configure Web App URL to your deployed URL
5. Set up bot commands:
```
start - Start your journey as a Hunter
profile - View your profile and stats
quests - See today's quests
achievements - View your achievements
leaderboard - See top hunters
settings - Configure your preferences
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📦 Deployment

### Docker Deployment (Recommended)

**Production mode:**
```bash
# Build and start
docker-compose up -d

# Or use make
make prod
```

**With custom domain:**
```bash
# Update nginx.conf with your domain
# Then deploy
docker-compose up -d --build
```

### Traditional Deployment

**Build for production:**
```bash
npm run build
npm run server:build
```

**Deploy to services:**
- Frontend → Vercel/Netlify
- Backend → Railway/Render
- Database → Railway/Supabase

See [DOCKER.md](./DOCKER.md) for complete deployment guide.

## 📊 Database Schema

### Key Tables
- `users`: User profiles and authentication
- `quests`: Quest definitions and templates
- `user_quests`: User's active quests
- `quest_completions`: Quest completion history
- `achievements`: Achievement definitions
- `user_achievements`: Unlocked achievements
- `stats_history`: Daily stats snapshots
- `leaderboard`: Cached leaderboard data

## 🎯 Roadmap

### Phase 1: MVP (Current)
- [x] Project setup and documentation
- [ ] Basic authentication
- [ ] Quest system (create, complete, delete)
- [ ] XP and leveling system
- [ ] User profile with stats
- [ ] Dark mode UI with Solo Leveling theme

### Phase 2: Enhanced Features
- [ ] Achievement system
- [ ] Streak tracking with bonuses
- [ ] Quest templates library
- [ ] Custom quest creation
- [ ] Notifications via Telegram bot

### Phase 3: Social Features
- [ ] Leaderboards (daily, weekly, all-time)
- [ ] Friend system
- [ ] Quest sharing
- [ ] Weekly challenges
- [ ] Guild/Party system

### Phase 4: Advanced Gamification
- [ ] Dungeon mode (special challenges)
- [ ] Equipment system (cosmetic items)
- [ ] Seasonal events
- [ ] Title collection
- [ ] Statistics and analytics dashboard
- [ ] Quest scheduler and reminders

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Solo Leveling (manhwa/anime) for inspiration
- Telegram for the Mini Apps platform
- All contributors and users

## 📧 Contact

For questions or support, contact [@your_telegram_username]

---

**Arise and become the strongest Hunter! 🗡️**
