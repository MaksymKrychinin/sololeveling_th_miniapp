# Architecture Document - Solo Leveling Telegram Mini App

## System Architecture

### Overview
The application follows a client-server architecture with a React-based frontend, Node.js backend, and PostgreSQL database. The app is deployed as a Telegram Mini App accessible within Telegram messenger.

```
┌─────────────────────────────────────────────────────────────┐
│                     Telegram Platform                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Telegram Mini App Client                  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │          React Frontend (TypeScript)            │  │  │
│  │  │  - @telegram-apps/sdk-react                     │  │  │
│  │  │  - Zustand State Management                     │  │  │
│  │  │  - Tailwind CSS                                 │  │  │
│  │  │  - Framer Motion                                │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/WebSocket
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Server                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Node.js/Express Backend                      │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐   │   │
│  │  │            │  │            │  │              │   │   │
│  │  │   Auth     │  │   Quest    │  │  Achievement │   │   │
│  │  │  Service   │  │  Service   │  │   Service    │   │   │
│  │  │            │  │            │  │              │   │   │
│  │  └────────────┘  └────────────┘  └──────────────┘   │   │
│  │         │                │                 │          │   │
│  │         └────────────────┴─────────────────┘          │   │
│  │                          │                            │   │
│  │                  ┌───────▼────────┐                   │   │
│  │                  │ Prisma ORM     │                   │   │
│  │                  └───────┬────────┘                   │   │
│  └──────────────────────────┼──────────────────────────┘    │
└─────────────────────────────┼─────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                            │
│            PostgreSQL with TimescaleDB extension             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Tables: users, quests, achievements, stats_history  │   │
│  │  Indexes, Constraints, Triggers                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy
```
App
├── TelegramProvider
│   └── AppLayout
│       ├── Header
│       │   ├── UserLevel
│       │   └── NotificationBadge
│       ├── MainContent
│       │   └── Router
│       │       ├── HomePage
│       │       │   ├── DailyQuestList
│       │       │   │   └── QuestCard[]
│       │       │   ├── StatsOverview
│       │       │   └── QuickActions
│       │       ├── ProfilePage
│       │       │   ├── ProfileHeader
│       │       │   ├── StatsDisplay
│       │       │   ├── AchievementGrid
│       │       │   └── LevelProgress
│       │       ├── QuestsPage
│       │       │   ├── QuestLibrary
│       │       │   ├── CategoryFilter
│       │       │   └── QuestModal
│       │       ├── AchievementsPage
│       │       │   └── AchievementList
│       │       ├── LeaderboardPage
│       │       │   ├── LeaderboardTabs
│       │       │   └── UserRankCard[]
│       │       └── SettingsPage
│       └── Navigation
└── GlobalModals
    ├── LevelUpModal
    ├── AchievementUnlockedModal
    └── QuestCompleteModal
```

### State Management

#### Store Structure (Zustand)
```typescript
// User Store
{
  user: UserProfile | null,
  isAuthenticated: boolean,
  loading: boolean,
  error: string | null,
  login: (initData: string) => Promise<void>,
  logout: () => void,
  updateProfile: (data: Partial<UserProfile>) => Promise<void>,
  refreshProfile: () => Promise<void>
}

// Quest Store
{
  quests: Quest[],
  activeQuests: Quest[],
  completedToday: Quest[],
  loading: boolean,
  error: string | null,
  fetchQuests: () => Promise<void>,
  completeQuest: (questId: string) => Promise<CompleteQuestResult>,
  createQuest: (quest: CreateQuestInput) => Promise<Quest>,
  deleteQuest: (questId: string) => Promise<void>,
  toggleQuestActive: (questId: string) => Promise<void>
}

// Achievement Store
{
  achievements: Achievement[],
  unlockedAchievements: string[],
  loading: boolean,
  fetchAchievements: () => Promise<void>,
  checkNewAchievements: () => Promise<Achievement[]>
}

// UI Store
{
  showLevelUpModal: boolean,
  showAchievementModal: Achievement | null,
  showQuestCompleteModal: Quest | null,
  setLevelUpModal: (show: boolean) => void,
  setAchievementModal: (achievement: Achievement | null) => void,
  setQuestCompleteModal: (quest: Quest | null) => void
}
```

### Data Flow

#### Quest Completion Flow
```
User clicks "Complete" button
    ↓
QuestCard component
    ↓
questStore.completeQuest(questId)
    ↓
API: POST /api/quests/:id/complete
    ↓
Backend: CompleteQuestService
    - Update quest status
    - Award XP
    - Check level up
    - Update stats
    - Check achievements
    ↓
Response: { quest, xpGained, levelUp, newAchievements }
    ↓
Update stores:
    - questStore: mark quest completed
    - userStore: update XP, level, stats
    - achievementStore: add new achievements
    ↓
Trigger UI updates:
    - Show quest completion animation
    - If level up: show level up modal
    - If new achievements: show achievement modal
    - Update progress bars
    - Haptic feedback
```

## Backend Architecture

### Layered Architecture

```
Controllers (HTTP Layer)
    ↓ Call
Services (Business Logic Layer)
    ↓ Call
Repositories (Data Access Layer)
    ↓ Call
Database (Prisma)
```

### Service Layer Design

#### QuestService
```typescript
class QuestService {
  // Get user's quests
  async getUserQuests(userId: string, filter?: QuestFilter): Promise<Quest[]>
  
  // Create new quest
  async createQuest(userId: string, data: CreateQuestInput): Promise<Quest>
  
  // Complete quest (main business logic)
  async completeQuest(userId: string, questId: string): Promise<CompleteQuestResult>
  
  // Reset daily quests (cron job)
  async resetDailyQuests(): Promise<void>
  
  // Delete quest
  async deleteQuest(userId: string, questId: string): Promise<void>
  
  // Toggle quest active status
  async toggleQuestActive(userId: string, questId: string): Promise<Quest>
}
```

#### UserService
```typescript
class UserService {
  // Get or create user from Telegram initData
  async authenticateUser(initData: string): Promise<{ user: UserProfile, token: string }>
  
  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile>
  
  // Update user profile
  async updateUserProfile(userId: string, data: UpdateUserInput): Promise<UserProfile>
  
  // Level up user
  async levelUpUser(userId: string): Promise<{ newLevel: number, newTitle: string }>
  
  // Update user stats
  async updateStats(userId: string, statUpdates: StatUpdate[]): Promise<void>
  
  // Get user statistics
  async getUserStats(userId: string, period: 'week' | 'month' | 'all'): Promise<UserStats>
}
```

#### AchievementService
```typescript
class AchievementService {
  // Check and unlock achievements for user
  async checkAchievements(userId: string): Promise<Achievement[]>
  
  // Get all achievements with unlock status
  async getAchievements(userId: string): Promise<AchievementWithStatus[]>
  
  // Manually award achievement (admin)
  async awardAchievement(userId: string, achievementId: string): Promise<void>
}
```

#### LeaderboardService
```typescript
class LeaderboardService {
  // Get leaderboard
  async getLeaderboard(
    type: 'level' | 'xp' | 'streak',
    period: 'daily' | 'weekly' | 'alltime',
    limit: number,
    userId?: string
  ): Promise<LeaderboardEntry[]>
  
  // Update leaderboard cache (cron job)
  async updateLeaderboardCache(): Promise<void>
}
```

### Middleware Stack

```typescript
// Request flow through middleware
Request
  → CORS Middleware
  → Rate Limiting Middleware
  → Body Parser Middleware
  → Request Logging Middleware
  → Authentication Middleware (for protected routes)
  → Validation Middleware (for specific routes)
  → Controller
  → Error Handling Middleware
  → Response
```

### Authentication Flow

```
1. User opens Telegram Mini App
   ↓
2. Frontend receives Telegram.WebApp.initData
   ↓
3. POST /api/auth/telegram with initData
   ↓
4. Backend validates initData with Telegram Bot API
   ↓
5. Backend checks if user exists in DB
   ↓
6. If new user: create user profile with defaults
   ↓
7. Generate JWT token with userId
   ↓
8. Return { token, user }
   ↓
9. Frontend stores token in localStorage
   ↓
10. Frontend includes token in Authorization header for all requests
```

## Database Schema

### Core Tables

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  avatar_url TEXT,
  
  level INTEGER DEFAULT 1,
  current_xp INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  
  title VARCHAR(100) DEFAULT 'E-Rank Hunter',
  
  strength INTEGER DEFAULT 1,
  agility INTEGER DEFAULT 1,
  intelligence INTEGER DEFAULT 1,
  vitality INTEGER DEFAULT 1,
  sense INTEGER DEFAULT 1,
  
  streak INTEGER DEFAULT 0,
  last_active_date DATE,
  total_tasks_completed INTEGER DEFAULT 0,
  
  timezone VARCHAR(50) DEFAULT 'UTC',
  notification_enabled BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_telegram_id (telegram_id),
  INDEX idx_level (level DESC),
  INDEX idx_total_xp (total_xp DESC)
);
```

#### quests
```sql
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  
  xp_reward INTEGER NOT NULL,
  stat_bonus_type VARCHAR(20),
  stat_bonus_amount INTEGER,
  
  difficulty VARCHAR(20) DEFAULT 'medium',
  icon VARCHAR(50),
  color VARCHAR(20),
  
  frequency VARCHAR(20) DEFAULT 'daily',
  is_active BOOLEAN DEFAULT true,
  
  status VARCHAR(20) DEFAULT 'pending',
  completed_at TIMESTAMP,
  
  streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_frequency (frequency),
  INDEX idx_completed_at (completed_at)
);
```

#### quest_completions
```sql
CREATE TABLE quest_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  
  xp_gained INTEGER NOT NULL,
  bonus_xp INTEGER DEFAULT 0,
  
  completed_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_id (user_id),
  INDEX idx_quest_id (quest_id),
  INDEX idx_completed_at (completed_at)
);
```

#### achievements
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50),
  rarity VARCHAR(20) DEFAULT 'common',
  
  requirement_type VARCHAR(50) NOT NULL,
  requirement_value INTEGER NOT NULL,
  requirement_metadata JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_requirement_type (requirement_type)
);
```

#### user_achievements
```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  
  unlocked_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id),
  INDEX idx_user_id (user_id),
  INDEX idx_unlocked_at (unlocked_at)
);
```

#### stats_history
```sql
CREATE TABLE stats_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  date DATE NOT NULL,
  
  level INTEGER,
  total_xp INTEGER,
  quests_completed INTEGER,
  
  strength INTEGER,
  agility INTEGER,
  intelligence INTEGER,
  vitality INTEGER,
  sense INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, date),
  INDEX idx_user_date (user_id, date DESC)
);
```

### Database Queries Optimization

#### Frequently Used Queries
```sql
-- Get user with today's quests (most common query)
SELECT u.*, q.*
FROM users u
LEFT JOIN quests q ON q.user_id = u.id 
WHERE u.id = $1 
  AND q.is_active = true
  AND q.status = 'pending'
ORDER BY q.difficulty, q.created_at;

-- Get leaderboard by level
SELECT 
  u.id, u.username, u.level, u.total_xp, u.avatar_url,
  RANK() OVER (ORDER BY u.level DESC, u.total_xp DESC) as rank
FROM users u
ORDER BY u.level DESC, u.total_xp DESC
LIMIT 100;

-- Check achievements
SELECT a.*
FROM achievements a
WHERE NOT EXISTS (
  SELECT 1 FROM user_achievements ua 
  WHERE ua.user_id = $1 AND ua.achievement_id = a.id
)
AND (
  (a.requirement_type = 'total_quests' AND 
   (SELECT COUNT(*) FROM quest_completions WHERE user_id = $1) >= a.requirement_value)
  OR
  (a.requirement_type = 'streak' AND 
   (SELECT streak FROM users WHERE id = $1) >= a.requirement_value)
  -- ... other conditions
);
```

#### Indexes
- Primary keys on all tables
- Foreign key indexes for joins
- Composite indexes on (user_id, date) for time-series queries
- Indexes on frequently filtered columns (status, is_active, frequency)
- Leaderboard indexes on (level DESC, total_xp DESC)

### Cron Jobs

```typescript
// Daily at midnight (user's timezone)
async function resetDailyQuests() {
  // For each timezone, at midnight:
  // 1. Reset daily quest status to 'pending'
  // 2. Check streak continuation
  // 3. Take stats snapshot
  // 4. Send morning motivation notification
}

// Every hour
async function updateLeaderboardCache() {
  // Rebuild materialized view or cached leaderboard data
}

// Every day at 3 AM
async function cleanupOldData() {
  // Archive old quest_completions (older than 1 year)
  // Vacuum database
}
```

## API Design

### REST Endpoints

#### Authentication
```
POST /api/auth/telegram
Body: { initData: string }
Response: { token: string, user: UserProfile }
```

#### User/Profile
```
GET /api/user/profile
Response: { user: UserProfile }

PATCH /api/user/profile
Body: { username?, avatar_url?, timezone?, notification_enabled? }
Response: { user: UserProfile }

GET /api/user/stats?period=week|month|all
Response: { stats: UserStats, history: StatsHistory[] }
```

#### Quests
```
GET /api/quests?filter=active|completed|all&date=YYYY-MM-DD
Response: { quests: Quest[] }

POST /api/quests
Body: { title, category, xpReward, difficulty, ... }
Response: { quest: Quest }

PATCH /api/quests/:id
Body: { title?, xpReward?, isActive?, ... }
Response: { quest: Quest }

POST /api/quests/:id/complete
Response: { 
  quest: Quest, 
  xpGained: number, 
  levelUp: boolean, 
  newLevel?: number,
  newAchievements?: Achievement[] 
}

DELETE /api/quests/:id
Response: { success: boolean }

GET /api/quests/templates
Response: { templates: QuestTemplate[] }
```

#### Achievements
```
GET /api/achievements
Response: { 
  achievements: Achievement[], 
  unlocked: string[],
  progress: Record<string, number>
}
```

#### Leaderboard
```
GET /api/leaderboard?type=level|xp|streak&period=daily|weekly|alltime&limit=100
Response: { 
  leaderboard: LeaderboardEntry[], 
  userRank?: number 
}
```

### Error Response Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* optional additional info */ }
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────┐
│              CDN (Cloudflare)               │
│         Static Assets, Images, CSS          │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│          Vercel/Railway Frontend            │
│            React SPA Build                  │
└─────────────────────────────────────────────┘
                     │
                     │ API Calls
                     ▼
┌─────────────────────────────────────────────┐
│          Railway/Render Backend             │
│        Node.js Server (3+ instances)        │
│           Load Balanced                     │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│      Managed PostgreSQL (Railway/Render)    │
│         Primary + Read Replicas             │
└─────────────────────────────────────────────┘
```

### Environment Configuration
```
Development: Local PostgreSQL, local Node.js
Staging: Railway with separate DB
Production: Railway/Vercel with production DB, CDN enabled
```

## Security Measures

1. **Authentication**: Validate Telegram initData signature
2. **Authorization**: JWT tokens with expiration
3. **Input Validation**: Zod schemas on all endpoints
4. **SQL Injection**: Protected by Prisma ORM
5. **XSS**: Sanitize all user inputs
6. **CSRF**: SameSite cookies, validate origin
7. **Rate Limiting**: 100 requests per minute per user
8. **HTTPS**: All traffic encrypted
9. **Secrets Management**: Environment variables
10. **Database**: Encrypted at rest, access control

## Performance Optimization

### Frontend
- Code splitting by route
- Lazy loading components
- Image optimization (WebP, lazy load)
- Service Worker for offline
- LocalStorage caching
- Debounced inputs
- Virtual scrolling for lists

### Backend
- Database connection pooling
- Query optimization with indexes
- Caching with Redis (future)
- Compression (gzip)
- Paginated responses
- Background jobs for heavy tasks

### Database
- Proper indexing strategy
- Query optimization
- Connection pooling
- Read replicas for heavy queries
- Archiving old data
- Materialized views for leaderboards

## Monitoring & Logging

### Metrics to Track
- API response times
- Database query times
- Error rates
- User activity (DAU, MAU)
- Quest completion rates
- Level distribution
- Feature usage

### Logging
- Structured JSON logs
- Log levels: ERROR, WARN, INFO, DEBUG
- Request/response logging
- Error stack traces
- User actions audit log

### Monitoring Tools (recommended)
- Sentry for error tracking
- Vercel Analytics for frontend
- Railway metrics for backend
- Prisma Studio for database inspection

## Scalability Considerations

### Horizontal Scaling
- Stateless backend servers
- Load balancer distribution
- Database read replicas
- CDN for static content

### Caching Strategy
- Browser caching for static assets
- LocalStorage for user data
- Redis for session and leaderboard data
- Database query result caching

### Future Improvements
- Microservices for quest/achievement engines
- Event-driven architecture with message queue
- GraphQL for flexible queries
- Real-time updates with WebSockets
- Search engine integration (Elasticsearch)
