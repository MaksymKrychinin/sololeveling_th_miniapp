# Solo Leveling Telegram Mini App - Architecture

## 🏗️ Monorepo Structure

```
test_telegram_mini_app/
├── apps/
│   ├── web/                    # React frontend app (Vite)
│   ├── api/                    # Backend API (Express + TypeScript)
│   └── bot/                    # Telegram Bot service
├── packages/
│   ├── database/               # Prisma schema & migrations
│   ├── shared/                 # Shared types, utils, constants
│   ├── ui/                     # UI component library
│   ├── telegram-sdk/           # Telegram integration wrapper
│   └── config/                 # Shared configs (eslint, tsconfig, etc.)
├── docker/
│   ├── api.Dockerfile
│   ├── web.Dockerfile
│   └── bot.Dockerfile
├── .github/
│   └── workflows/
├── docker-compose.yml
├── docker-compose.dev.yml
├── turbo.json                  # Turborepo config
└── package.json                # Root package.json
```

## 🎯 Technology Stack

### Monorepo Management
- **Turborepo**: Fast build system for monorepos
- **pnpm**: Fast, disk space efficient package manager
- **pnpm workspaces**: Package management

### Frontend (apps/web)
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Fast build tool & dev server
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animations
- **Zustand**: State management
- **React Router**: Routing
- **React Query**: Data fetching & caching
- **@telegram-apps/sdk-react**: Telegram Mini App SDK
- **Zod**: Runtime validation
- **React Hook Form**: Form handling

### Backend (apps/api)
- **Express**: Web framework
- **TypeScript**: Type safety
- **Prisma**: ORM
- **PostgreSQL**: Database
- **Redis**: Caching & sessions
- **JWT**: Authentication
- **Zod**: Request validation
- **Winston**: Logging
- **rate-limiter-flexible**: Rate limiting
- **Bull**: Job queue for background tasks

### Telegram Bot (apps/bot)
- **Grammy**: Telegram bot framework
- **TypeScript**: Type safety

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Local development
- **GitHub Actions**: CI/CD
- **Nginx**: Reverse proxy (production)

## 🏛️ Architecture Principles

### 1. Clean Architecture
```
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│  (React Components, API Routes)         │
├─────────────────────────────────────────┤
│          Application Layer              │
│  (Use Cases, Business Logic)            │
├─────────────────────────────────────────┤
│          Domain Layer                   │
│  (Entities, Value Objects, Interfaces)  │
├─────────────────────────────────────────┤
│          Infrastructure Layer           │
│  (Database, External APIs, Cache)       │
└─────────────────────────────────────────┘
```

### 2. Design Patterns
- **Repository Pattern**: Data access abstraction
- **Factory Pattern**: Object creation
- **Strategy Pattern**: Algorithm selection (XP calculation, achievements)
- **Observer Pattern**: Real-time updates
- **Dependency Injection**: Loose coupling

### 3. API Design
- **RESTful API**: Standard HTTP methods
- **versioning**: /api/v1/...
- **Consistent error responses**
- **OpenAPI/Swagger documentation**

### 4. Database Design
```
Users
├── id (UUID)
├── telegramId (BIGINT, UNIQUE)
├── username
├── level
├── currentXP
├── stats (JSON)
├── createdAt
└── updatedAt

Quests
├── id (UUID)
├── userId (FK)
├── templateId (FK, nullable)
├── title
├── category
├── xpReward
├── status
├── completedAt
└── streak

QuestTemplates
├── id (UUID)
├── title
├── category
├── xpReward
├── statBonus
└── difficulty

Achievements
├── id (UUID)
├── title
├── requirement
└── rarity

UserAchievements
├── id (UUID)
├── userId (FK)
├── achievementId (FK)
└── unlockedAt

QuestCompletions
├── id (UUID)
├── userId (FK)
├── questId (FK)
├── xpGained
└── completedAt
```

### 5. State Management Strategy
```typescript
// Frontend State
userStore - User profile, level, XP, stats
questStore - Active quests, templates
uiStore - Theme, modals, loading states
achievementStore - Unlocked achievements

// Backend Cache
Redis:
  - User sessions
  - Quest templates (frequently accessed)
  - Leaderboard data
  - Rate limiting
```

### 6. Performance Optimization
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format, lazy loading
- **API Response Caching**: Redis cache
- **Database Query Optimization**: Proper indexes
- **CDN**: Static assets delivery
- **Service Worker**: Offline support
- **Virtual Scrolling**: Long lists
- **Debouncing**: User inputs
- **Memoization**: React.memo, useMemo, useCallback

### 7. Security Measures
- **Telegram InitData Validation**: Verify authenticity
- **JWT Tokens**: Secure authentication
- **Rate Limiting**: Prevent abuse
- **Input Sanitization**: XSS prevention
- **SQL Injection Prevention**: Prisma parameterized queries
- **CORS**: Configured origins
- **Environment Variables**: Secrets management
- **Helmet.js**: Security headers

### 8. Error Handling Strategy
```typescript
// Frontend
- Error Boundaries for React components
- Toast notifications for user errors
- Retry logic for failed requests
- Fallback UI

// Backend
- Global error handler middleware
- Structured error logging
- Proper HTTP status codes
- Detailed error messages (dev) vs safe messages (prod)
```

### 9. Testing Strategy
```
Unit Tests (Vitest)
├── Utils & helpers
├── Store actions
└── Business logic functions

Integration Tests (Vitest)
├── API endpoints
└── Database operations

Component Tests (React Testing Library)
├── UI components
└── User interactions

E2E Tests (Playwright)
├── Critical user flows
├── Quest completion
└── Level up process
```

### 10. Deployment Architecture
```
┌──────────────────────────────────────────────┐
│              Telegram Platform               │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│            Load Balancer / CDN               │
└────────────────┬─────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼────────┐ ┌─────▼──────────┐
│  Web App       │ │   API Server   │
│  (Static)      │ │   (Node.js)    │
└────────────────┘ └────────┬───────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
         ┌──────▼─────┐ ┌──▼────┐ ┌───▼─────┐
         │ PostgreSQL │ │ Redis │ │ Bot     │
         └────────────┘ └───────┘ └─────────┘
```

## 📦 Package Dependencies

### Shared Dependencies
- All packages use same TypeScript version
- Consistent linting and formatting
- Shared types and utilities

### Dependency Graph
```
web → shared, ui, telegram-sdk, config
api → shared, database, config
bot → shared, database, config
database → shared
ui → shared, config
```

## 🚀 Development Workflow

1. **Local Development**
   ```bash
   pnpm install
   pnpm dev  # Starts all apps in parallel
   ```

2. **Building**
   ```bash
   pnpm build  # Turborepo builds all packages
   ```

3. **Testing**
   ```bash
   pnpm test
   pnpm test:e2e
   ```

4. **Database**
   ```bash
   pnpm db:migrate
   pnpm db:studio
   pnpm db:seed
   ```

## 🎨 Design System

### Colors (Tailwind Config)
```javascript
colors: {
  primary: {
    50: '#f5f3ff',
    500: '#8b5cf6',
    700: '#7c3aed',
    900: '#581c87',
  },
  accent: {
    500: '#06b6d4',
    600: '#0ea5e9',
  },
  dark: {
    900: '#0f172a',
    800: '#1e293b',
  }
}
```

### Typography
- Headers: Orbitron (Google Fonts)
- Body: Inter (Google Fonts)
- Mono: JetBrains Mono (stats/numbers)

### Components Architecture
```
ui/
├── atoms/
│   ├── Button
│   ├── Input
│   ├── Badge
│   └── Icon
├── molecules/
│   ├── Card
│   ├── ProgressBar
│   ├── StatDisplay
│   └── QuestItem
├── organisms/
│   ├── QuestList
│   ├── ProfileHeader
│   └── AchievementGrid
└── templates/
    └── PageLayout
```

## 🔄 Real-time Features
- WebSocket connection for live updates
- Quest completion notifications
- Level up broadcasts
- Leaderboard live updates

## 📊 Analytics & Monitoring
- **Logging**: Winston (structured logs)
- **Metrics**: Performance metrics
- **Error Tracking**: Error aggregation
- **User Analytics**: Quest completion rates, retention

## 🌍 Internationalization (Future)
- i18next for translations
- Language detection from Telegram
- Fallback to English
