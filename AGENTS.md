# AGENTS.md - Solo Leveling Telegram Mini App

## Project Architecture

**Monorepo Structure (pnpm workspaces + Turbo)**:
- `apps/api` - Express REST API (port 3001)
- `apps/web` - Vite + React frontend (port 3000)
- `apps/bot` - Telegram bot service
- `packages/database` - Prisma ORM + migrations
- `packages/ui` - Shared React component library
- `packages/telegram-sdk` - Telegram Web App SDK wrapper
- `packages/shared` - Shared types and utilities
- `packages/config` - ESLint and TypeScript configs

**Critical**: Always use Node.js v22.13.0+ (via nvm). Run `./start-dev.sh` to start all services.

## Key Development Workflows

### Initial Setup
```bash
./setup-fixed.sh          # Full setup with dependencies, Docker, and database
./start-dev.sh            # Start all dev servers (uses nvm to switch Node version)
pnpm db:studio           # Open Prisma Studio (port 5555)
```

### Common Commands
```bash
pnpm dev                 # Start all apps (API, web, bot) via Turbo
pnpm build               # Build all packages
pnpm db:migrate          # Run Prisma migrations
pnpm db:push             # Push schema changes (dev only)
```

### Database Gotchas
- **Prisma Client location**: Default output (removed custom path due to pnpm conflicts)
- 38 **BigInt serialization**: `totalXP` is BigInt in DB - always convert to `Number()` before JSON response
- **Seeded users**: dev/dev123, hunter/hunter123, test/test123 (telegramId: 1000319, 1000320, 1000321)
- **Quest templates**: 12 pre-seeded in categories (hygiene, health, fitness, learning, mindfulness, productivity)

## Project-Specific Patterns

### Authentication
- **Production**: Telegram WebApp `initData` validation (`POST /api/v1/auth/telegram`)
- **Development**: Username/password login (`POST /api/v1/auth/dev-login`) 
- JWT stored in Zustand (`apps/web/src/store/userStore.ts`)
- Protected routes use `<ProtectedRoute>` wrapper

### API Response Format
```typescript
// Success
{ success: true, data: { ... } }

// Error  
{ success: false, error: { message: string, code?: string } }
```

### BigInt Handling Pattern
```typescript
// In repositories/services - always convert before returning
const users = await prisma.user.findMany(...);
return users.map(u => ({ ...u, totalXP: Number(u.totalXP) }));
```

### State Management (Zustand)
- `userStore` - Current user, token, auth state
- `questStore` - Active quests (if implemented)
- Persist token in localStorage via Zustand persist middleware

### Quest System Flow
1. User selects quest templates from `/quests` page
2. `POST /api/v1/quests/from-template` creates user quest
3. `POST /api/v1/quests/:id/complete` awards XP, updates stats, checks for level-up
4. Level-up triggers achievement check and title update

## Critical Integration Points

### Vite Proxy Configuration
`apps/web/vite.config.ts` proxies `/api` → `http://localhost:3001` to avoid CORS in dev.

### Telegram SDK Initialization
```typescript
// apps/web/src/main.tsx
import { TelegramProvider } from '@solo-leveling/telegram-sdk';

// Wraps app, provides useInitData(), useHapticFeedback() hooks
```

### React Query Setup
API calls use `@tanstack/react-query` with custom hooks in `apps/web/src/hooks/useApi.ts`.  
All mutations invalidate related queries automatically.

## Environment Differences

### Development (Local)
- Use dev login page (`/login`) with username/password
- API on localhost:3001, web on localhost:3000
- PostgreSQL/Redis via Docker Compose
- Vite HMR for instant updates

### Production (Telegram)
- Must be accessed via Telegram WebApp URL
- Validates `initData` from Telegram
- No dev login available
- Use environment variables in `.env.production`

## Known Issues & Workarounds

### Port Conflicts
If port 3001 is busy: Vite may use different port. Check console output for actual URLs.

### Prisma Client Not Found
If imports fail after schema changes:
```bash
pnpm --filter database db:generate
```

### TypeScript DTS Build Errors in Packages
Non-critical for dev. CJS/ESM builds still work. Fix by removing `incremental: true` from tsconfig or adding `tsBuildInfoFile`.

### Bot Crashes Without Token
Expected in local dev. Set `TelegRAM_BOT_TOKEN` in `.env` or just ignore bot errors.

## Testing Strategy

### Manual Testing
1. Start services: `./start-dev.sh`
2. Open http://localhost:3000/login
3. Login with `dev` / `dev123`
4. Test quest flow: Home → Complete quest → Check XP gained → Profile page

### API Testing
```bash
# Health check
curl http://localhost:3001/health

# Dev login
curl -X POST http://localhost:3001/api/v1/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"username":"dev","password":"dev123"}'
  
# Get user profile (with token)
curl http://localhost:3001/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## File Structure Highlights

**Key API Files**:
- `apps/api/src/routes/*.ts` - Route handlers
- `apps/api/src/services/QuestService.ts` - Quest completion logic (XP, level-up)
- `apps/api/src/services/UserService.ts` - User profile, stats, achievements
- `apps/api/src/repositories/*.ts` - Database queries

**Key Frontend Files**:
- `apps/web/src/pages/*.tsx` - Main app pages
- `apps/web/src/hooks/useApi.ts` - API integration hooks
- `apps/web/src/store/userStore.ts` - Auth & user state
- `apps/web/src/components/layout/AppLayout.tsx` - Main layout with nav

**Database Schema**:
- `packages/database/prisma/schema.prisma` - Single source of truth for data model
- `packages/database/src/index.ts` - Exports Prisma client

## Design System (UI Package)

Components in `packages/ui/src/components/`:
- `Button`, `Card`, `Badge`, `ProgressBar`, `Input`, `Spinner`
- All support `variant` prop: primary, secondary, success, warning, danger
- Tailwind-based with Solo Leveling color scheme (purple/cyan theme)

## Deployment Considerations

- Set `VITE_API_URL` to production API URL
- Configure `CORS_ORIGIN` to match frontend domain
- Set strong `JWT_SECRET` (min 32 chars)
- Use SSL/TLS in production
- Set up Telegram bot webhook for production bot
