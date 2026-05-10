# GitHub Copilot Instructions - Solo Leveling Telegram Mini App

## Project Overview
This is a gamified habit tracking Telegram Mini App inspired by Solo Leveling anime/manga, where users complete real-life daily tasks to level up their character and unlock achievements.

## Core Concept
Transform daily habits into an RPG experience where users:
- Complete "quests" (daily tasks) to gain XP and level up
- Earn rewards, titles, and achievements
- Track progress with stats and streaks
- Unlock new abilities and features as they level up
- Compete with friends on leaderboards

## Technology Stack
- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with dark theme (Solo Leveling aesthetic)
- **Telegram Integration**: @telegram-apps/sdk-react
- **State Management**: Zustand or Redux Toolkit
- **Backend**: Node.js with Express or Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Telegram Mini App authentication
- **Animations**: Framer Motion for smooth transitions

## Design Philosophy
### Visual Style (Solo Leveling Inspired)
- **Color Palette**:
  - Primary: Deep purple/violet (#8B5CF6, #7C3AED)
  - Accent: Bright cyan/blue (#06B6D4, #0EA5E9)
  - Background: Very dark gray/black (#0F172A, #1E293B)
  - Success: Emerald green (#10B981)
  - Danger: Red (#EF4444)
  - Warning: Amber (#F59E0B)
  - Text: Light gray to white (#F1F5F9, #E2E8F0)

- **Typography**:
  - Headers: Bold, futuristic fonts (e.g., Orbitron, Rajdhani)
  - Body: Clean, readable (Inter, Roboto)
  - Numbers/Stats: Monospace for RPG feel

- **UI Elements**:
  - Card-based layout with glowing borders
  - Progress bars with animated fills
  - Particle effects on level ups
  - Smooth page transitions
  - Glass-morphism effects
  - Neon glow on active elements

### UX Principles
- Quick access to daily tasks (max 2 taps)
- Instant feedback on task completion (animations, sounds)
- Clear progress visualization
- Minimal input required (checkboxes, quick actions)
- Offline-first approach with sync

## Core Features

### 1. User Profile & Character
```typescript
interface UserProfile {
  id: string;
  telegramId: number;
  username: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  title: string; // "E-Rank Hunter", "D-Rank Hunter", etc.
  avatar?: string;
  joinedAt: Date;
  stats: {
    strength: number;      // gym, sports
    agility: number;       // running, cardio
    intelligence: number;  // reading, learning
    vitality: number;      // health habits: water, food, sleep
    sense: number;         // mindfulness, meditation
  };
  streak: number;
  totalTasksCompleted: number;
  achievements: Achievement[];
}
```

### 2. Quest/Task System
```typescript
interface Quest {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: QuestCategory;
  xpReward: number;
  statBonus?: { stat: StatType; amount: number };
  frequency: 'daily' | 'weekly' | 'custom';
  status: 'pending' | 'completed' | 'failed';
  completedAt?: Date;
  streak: number;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
}

enum QuestCategory {
  HYGIENE = 'hygiene',           // shower, brush teeth
  HEALTH = 'health',             // water, healthy meals
  FITNESS = 'fitness',           // gym, running
  LEARNING = 'learning',         // reading, new words
  MINDFULNESS = 'mindfulness',   // meditation, journaling
  PRODUCTIVITY = 'productivity', // tasks, work
  SOCIAL = 'social',             // social interactions
  CUSTOM = 'custom'
}
```

### 3. Leveling System
```typescript
// XP Formula: XP needed = 100 * level^1.5
const calculateXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

// Rank Titles based on levels
const RANKS = {
  1: 'E-Rank Hunter',
  10: 'D-Rank Hunter',
  25: 'C-Rank Hunter',
  50: 'B-Rank Hunter',
  75: 'A-Rank Hunter',
  100: 'S-Rank Hunter',
  150: 'National Level Hunter',
  200: 'Shadow Monarch'
};
```

### 4. Achievement System
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  requirement: {
    type: 'streak' | 'total_quests' | 'level' | 'stat' | 'specific_quest';
    value: number;
  };
}
```

### 5. Daily Quest Examples
Pre-defined quest templates users can enable:

**Hygiene**
- Morning Shower (10 XP, +1 Vitality)
- Brush Teeth Morning (5 XP, +1 Vitality)
- Brush Teeth Evening (5 XP, +1 Vitality)
- Skincare Routine (10 XP, +1 Sense)

**Health & Nutrition**
- Drink 8 Glasses of Water (15 XP, +2 Vitality)
- Healthy Breakfast (10 XP, +1 Vitality)
- Healthy Lunch (10 XP, +1 Vitality)
- Healthy Dinner (10 XP, +1 Vitality)
- Take Vitamins (5 XP, +1 Vitality)

**Fitness**
- Morning Run (20 XP, +2 Agility)
- Gym Workout (25 XP, +2 Strength)
- 10k Steps (15 XP, +1 Agility)
- Home Workout (15 XP, +1 Strength)
- Stretching (10 XP, +1 Agility)

**Learning & Growth**
- Read 30 Minutes (20 XP, +2 Intelligence)
- Learn 10 New Words (15 XP, +2 Intelligence)
- Study/Learn Something New (20 XP, +2 Intelligence)
- Practice Language (15 XP, +1 Intelligence)

**Mindfulness**
- Morning Meditation (15 XP, +2 Sense)
- Journaling (10 XP, +1 Sense)
- Gratitude Practice (10 XP, +1 Sense)

**Productivity**
- Complete Main Task (25 XP)
- Clear Email Inbox (10 XP)
- Plan Tomorrow (10 XP, +1 Intelligence)

## Key User Flows

### 1. Onboarding Flow
1. User opens Telegram Mini App
2. Welcome screen with Solo Leveling aesthetic
3. "Awaken as a Hunter" button
4. Select initial daily quests (recommend 3-5 to start)
5. Show tutorial with quest completion demo
6. Arrive at main dashboard

### 2. Daily Usage Flow
1. Open app → See today's active quests
2. Complete quest → Tap to mark complete
3. Celebration animation + XP gain notification
4. Update progress bars
5. If level up → Special animation + new title reveal

### 3. Quest Management Flow
1. Navigate to Quest Library
2. Browse by category
3. Toggle quests on/off
4. Create custom quests
5. Set difficulty and rewards

## API Structure

### Authentication
```typescript
POST /api/auth/telegram
Body: { initData: string }
Response: { token: string, user: UserProfile }
```

### Quests
```typescript
GET /api/quests
Response: { quests: Quest[] }

POST /api/quests
Body: { title, category, xpReward, ... }
Response: { quest: Quest }

PATCH /api/quests/:id/complete
Response: { quest: Quest, xpGained: number, levelUp?: boolean }

DELETE /api/quests/:id
```

### User Profile
```typescript
GET /api/user/profile
Response: { user: UserProfile }

PATCH /api/user/profile
Body: { avatar?, ... }
Response: { user: UserProfile }

GET /api/user/stats
Response: { stats: UserStats, history: StatsHistory[] }
```

### Achievements
```typescript
GET /api/achievements
Response: { achievements: Achievement[], unlocked: string[] }
```

### Leaderboard
```typescript
GET /api/leaderboard?type=level|xp|streak&period=daily|weekly|alltime
Response: { users: LeaderboardEntry[] }
```

## File Structure
```
/src
  /components
    /common
      - Button.tsx
      - Card.tsx
      - ProgressBar.tsx
      - StatBadge.tsx
    /layout
      - AppLayout.tsx
      - Navigation.tsx
      - Header.tsx
    /quest
      - QuestCard.tsx
      - QuestList.tsx
      - QuestModal.tsx
      - QuestLibrary.tsx
    /profile
      - ProfileHeader.tsx
      - StatsDisplay.tsx
      - AchievementGrid.tsx
      - LevelProgress.tsx
    /animations
      - LevelUpAnimation.tsx
      - QuestCompleteAnimation.tsx
      - ParticleEffect.tsx
  /pages
    - Home.tsx
    - Profile.tsx
    - Quests.tsx
    - Achievements.tsx
    - Leaderboard.tsx
    - Settings.tsx
  /hooks
    - useQuests.ts
    - useProfile.ts
    - useAuth.ts
    - useAchievements.ts
  /store
    - userStore.ts
    - questStore.ts
  /services
    - api.ts
    - telegram.ts
  /utils
    - xpCalculations.ts
    - dateHelpers.ts
    - statCalculations.ts
  /types
    - index.ts
  /styles
    - globals.css
    - theme.ts

/server (or /pages/api for Next.js)
  /routes
    - auth.ts
    - quests.ts
    - users.ts
    - achievements.ts
  /controllers
  /services
  /middleware
  /database
    - schema.prisma
    - migrations/
```

## Code Standards

### TypeScript
- Strict mode enabled
- No implicit any
- Use interfaces for data structures
- Use enums for fixed sets of values
- Export types from dedicated types file

### React Components
- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo for performance optimization
- Custom hooks for reusable logic
- Props interfaces for all components

### State Management
- Use Zustand stores or Redux Toolkit
- Separate stores by domain (user, quests, UI)
- Implement optimistic updates
- Handle loading and error states

### Styling
- Tailwind CSS utility classes
- Custom theme configuration
- Responsive design (mobile-first)
- Dark mode by default
- CSS animations for smooth transitions

### API
- RESTful conventions
- Proper HTTP status codes
- Error handling middleware
- Request validation (Zod or Joi)
- JWT authentication

### Database
- Prisma schema with proper relations
- Migrations for schema changes
- Indexes on frequently queried fields
- Soft deletes where appropriate

## Testing Strategy
- Unit tests for utilities and helpers
- Integration tests for API endpoints
- Component tests with React Testing Library
- E2E tests for critical flows (Playwright)

## Performance Considerations
- Lazy load routes
- Optimize images and icons
- Cache API responses
- Debounce user inputs
- Virtual scrolling for long lists
- Service Worker for offline support

## Security
- Validate Telegram initData
- Sanitize user inputs
- Rate limiting on API endpoints
- CORS configuration
- Environment variables for secrets
- SQL injection prevention (Prisma)

## Telegram Mini App Integration
- Use Telegram color scheme detection
- Haptic feedback on interactions
- Back button handling
- Main button for primary actions
- Close confirmation for important actions
- Share functionality for achievements

## Gamification Hooks
- Daily login rewards
- Streak bonuses (7 days, 30 days, 100 days)
- Weekly challenges (complete all X category quests)
- Random "dungeon" quests (bonus challenges)
- Friend referral rewards
- Seasonal events
- Title collection

## Progressive Enhancement
Start with MVP:
1. Basic quest completion
2. XP and leveling
3. Profile with stats

Then add:
4. Achievements
5. Leaderboards
6. Social features
7. Custom quests
8. Advanced stats/analytics

## Development Commands
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Database migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Lint code
npm run lint

# Format code
npm run format
```

## Environment Variables
```env
DATABASE_URL=
TELEGRAM_BOT_TOKEN=
JWT_SECRET=
NODE_ENV=
API_URL=
```

## Key Implementation Notes
1. **XP Calculation**: Use exponential curve to make leveling meaningful but achievable
2. **Timezone Handling**: Store user timezone, reset daily quests at user's midnight
3. **Streak Logic**: Grace period of 4 hours into next day to maintain streak
4. **Offline Mode**: Cache quest completions locally, sync when online
5. **Animations**: Keep under 300ms for responsiveness
6. **Notifications**: Telegram bot notifications for reminders and achievements

## Resources
- Telegram Mini Apps Documentation: https://core.telegram.org/bots/webapps
- Solo Leveling Wiki: For title names, terminology, aesthetic reference
- @telegram-apps/sdk-react: npm package for Telegram integration
