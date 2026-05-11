# Dev Login Feature - Local Testing Authentication ✅

## Date: May 11, 2026

## Overview
Added username/password authentication for local testing to allow development without Telegram Mini App integration.

## Problem
During local development, there's no Telegram initData available, making it impossible to test the app without deploying to Telegram.

## Solution
Implemented a dev login system that:
1. Uses simple username/password credentials
2. Creates or finds users in the database
3. Issues JWT tokens just like Telegram auth
4. Only works in development mode (NODE_ENV !== 'production')

## Changes Made

### Backend (API)

#### 1. **Auth Route** (`apps/api/src/routes/auth.ts`)
Added new endpoint:
```typescript
POST /api/v1/auth/dev-login
Body: { username: string, password: string }
Response: { token: string, user: UserProfile }
```

Features:
- Only available in development mode
- Returns 403 in production
- Same response format as Telegram auth

#### 2. **Auth Service** (`apps/api/src/services/AuthService.ts`)
Added method:
```typescript
authenticateWithDevCredentials(username: string, password: string)
```

Features:
- Validates against hardcoded dev credentials
- Creates fake telegram ID from username
- Creates or retrieves user from database
- Generates JWT token

**Default Credentials:**
```
dev / dev123
hunter / hunter123
test / test123
```

### Frontend (Web App)

#### 3. **Login Page** (`apps/web/src/pages/Login.tsx`)
Created new login page with:
- Username/password form
- Loading states
- Error handling with toasts
- Solo Leveling themed design
- Test credentials display
- Modern animations

#### 4. **Protected Route Component** (`apps/web/src/components/ProtectedRoute.tsx`)
Created route guard that:
- Checks for authentication token
- Redirects to /login if not authenticated
- Wraps protected routes

#### 5. **App Router** (`apps/web/src/App.tsx`)
Updated routing structure:
```typescript
/login           → Public (Login page)
/*               → Protected (All app routes)
  ├── /          → Home
  ├── /profile   → Profile
  ├── /quests    → Quests
  ├── /achievements → Achievements
  └── /leaderboard  → Leaderboard
```

#### 6. **API Service** (`apps/web/src/services/api.ts`)
Updated error handling:
- Redirects to `/login` on 401 (unauthorized)
- Already had token injection in headers

## Usage

### Starting the App

1. **Start dev server:**
   ```bash
   pnpm run dev
   ```

2. **Navigate to app:**
   ```
   http://localhost:3000
   ```

3. **You'll be redirected to login:**
   ```
   http://localhost:3000/login
   ```

4. **Use test credentials:**
   - Username: `dev`
   - Password: `dev123`

### Testing Different Users

You can test with multiple users:

```bash
# User 1: dev
Username: dev
Password: dev123

# User 2: hunter
Username: hunter
Password: hunter123

# User 3: test
Username: test
Password: test123
```

Each username creates a unique user in the database with:
- Unique fake Telegram ID
- Starting level 1
- E-Rank Hunter title
- All stats at 0

## Security Notes

### Development Safety
✅ **Endpoint blocked in production:**
```typescript
if (process.env.NODE_ENV === 'production') {
  return res.status(403).json({
    error: { message: 'Dev login is only available in development' }
  });
}
```

### Token Management
- JWT tokens generated same as Telegram auth
- Tokens stored in localStorage via Zustand persist
- Tokens included in all API requests via Authorization header
- Auto-logout on 401 responses

### Adding More Dev Users

To add more dev credentials, edit `AuthService.ts`:
```typescript
const validCredentials = {
  'dev': 'dev123',
  'hunter': 'hunter123',
  'test': 'test123',
  'newuser': 'newpass',  // Add here
};
```

## User Flow

### First Time Login
1. Visit http://localhost:3000
2. Redirect to /login
3. Enter credentials (e.g., dev/dev123)
4. API creates new user in database
5. Returns JWT token
6. Token stored in localStorage
7. Redirect to home page
8. Can now use all app features

### Subsequent Visits
1. Visit http://localhost:3000
2. Token retrieved from localStorage
3. Automatically authenticated
4. Redirect to home page

### Logout
Users can logout from the Profile page (logout button to be added) or:
- Clear localStorage
- Token expires (7 days by default)
- API returns 401 → auto redirect to login

## Testing

### Manual Testing
```bash
# Test login endpoint directly
curl -X POST http://localhost:3001/api/v1/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"username":"dev","password":"dev123"}'

# Expected response:
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "...",
      "username": "dev",
      "level": 1,
      "title": "E-Rank Hunter",
      ...
    }
  }
}
```

### Integration Testing
1. ✅ Login with valid credentials
2. ✅ Login with invalid credentials (should show error)
3. ✅ Access protected route without token (should redirect)
4. ✅ Access protected route with token (should work)
5. ✅ Token persists across page refreshes
6. ✅ API requests include Authorization header

## Database Impact

Each dev login user creates a real user record:
```sql
INSERT INTO users (
  telegram_id,  -- Fake ID generated from username
  username,     -- From login form
  first_name,   -- Capitalized username
  last_name,    -- "User"
  level,        -- 1
  title,        -- "E-Rank Hunter"
  ...
)
```

User can then:
- Create quests
- Complete quests
- Gain XP and level up
- Earn achievements
- Appear on leaderboards

## Advantages

✅ **No Telegram deployment needed** - Test locally without Telegram Mini App setup
✅ **Multiple test users** - Easy to test with different accounts
✅ **Real data** - Users persist in database like production users
✅ **Fast development** - No need to refresh Telegram app
✅ **Same auth flow** - JWT tokens work identically to production

## Limitations

⚠️ **Development only** - Endpoint disabled in production
⚠️ **Hardcoded passwords** - Not suitable for production use
⚠️ **No password hashing** - Simple string comparison
⚠️ **No rate limiting** - Add if needed for security testing

## Future Enhancements

Possible improvements:
- [ ] Add logout button to Profile page
- [ ] Show "Dev Mode" indicator in UI
- [ ] Add "Switch User" feature
- [ ] Environment-based credential config
- [ ] Email/password registration for staging
- [ ] OAuth providers for testing

## Files Modified

### Backend
- ✅ `apps/api/src/routes/auth.ts` - Added dev-login endpoint
- ✅ `apps/api/src/services/AuthService.ts` - Added authenticateWithDevCredentials

### Frontend
- ✅ `apps/web/src/pages/Login.tsx` - Created login page
- ✅ `apps/web/src/components/ProtectedRoute.tsx` - Created route guard
- ✅ `apps/web/src/App.tsx` - Updated routing structure
- ✅ `apps/web/src/services/api.ts` - Updated 401 redirect

### Database
- No schema changes needed
- Uses existing User model

## Summary

✅ **Complete** - Dev login system is fully functional
✅ **Tested** - Login flow works end-to-end
✅ **Documented** - Usage and implementation details provided
✅ **Secure** - Production-safe with environment checks

You can now develop and test the Solo Leveling app locally without requiring Telegram Mini App integration! 🚀

---

**Status**: ✅ Production Ready (dev mode only)
**Last Updated**: May 11, 2026 12:15 PM
