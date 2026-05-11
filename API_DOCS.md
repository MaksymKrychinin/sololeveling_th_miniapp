# Solo Leveling API - Endpoints

Base URL: `http://localhost:3001/api/v1`

## Authentication

### POST /auth/telegram
Authenticate user with Telegram initData

**Request:**
```json
{
  "initData": "query_id=...&user=%7B%22id%22%3A123...&auth_date=...&hash=..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "telegramId": 123456789,
      "username": "hunter",
      "level": 1,
      "currentXP": 0,
      "title": "E-Rank Hunter",
      "stats": {
        "strength": 10,
        "agility": 10,
        "intelligence": 10,
        "vitality": 10,
        "sense": 10
      },
      "streak": 0,
      "totalTasksCompleted": 0
    }
  }
}
```

### POST /auth/refresh
Refresh JWT token

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "token": "old_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "new_token"
  }
}
```

## User

All user endpoints require authentication header:
```
Authorization: Bearer <token>
```

### GET /users/profile
Get user profile

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "telegramId": 123456789,
    "username": "hunter",
    "level": 5,
    "currentXP": 50,
    "xpToNextLevel": 177,
    "title": "E-Rank Hunter",
    "stats": {
      "strength": 15,
      "agility": 12,
      "intelligence": 18,
      "vitality": 14,
      "sense": 10
    },
    "streak": 7,
    "longestStreak": 15,
    "totalTasksCompleted": 42,
    "totalXP": 850
  }
}
```

### PATCH /users/profile
Update user profile

**Request:**
```json
{
  "avatar": "https://...",
  "timezone": "Europe/Kiev"
}
```

### GET /users/stats
Get detailed statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "level": 5,
    "title": "E-Rank Hunter",
    "totalXP": 850,
    "currentXP": 50,
    "xpToNextLevel": 177,
    "streak": 7,
    "longestStreak": 15,
    "totalTasksCompleted": 42,
    "stats": { ... },
    "quests": {
      "total": 10,
      "active": 8,
      "completed": 42
    },
    "categoryStats": {
      "fitness": { "total": 3, "completed": 15 },
      "learning": { "total": 2, "completed": 10 }
    }
  }
}
```

## Quests

### GET /quests
Get user's quests

**Query params:**
- `isActive=true|false` (optional)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Morning Run",
      "description": "Go for a 30-minute run",
      "category": "fitness",
      "xpReward": 20,
      "statBonus": { "stat": "agility", "amount": 2 },
      "frequency": "daily",
      "status": "pending",
      "streak": 5,
      "icon": "🏃",
      "difficulty": "medium",
      "isActive": true
    }
  ]
}
```

### POST /quests
Create custom quest

**Request:**
```json
{
  "title": "Custom Quest",
  "description": "Do something awesome",
  "category": "custom",
  "xpReward": 25,
  "statBonus": { "stat": "strength", "amount": 1 },
  "frequency": "daily",
  "icon": "⚡",
  "difficulty": "hard"
}
```

### POST /quests/from-template
Create quest from template

**Request:**
```json
{
  "templateId": "template_uuid"
}
```

### POST /quests/:id/complete
Complete a quest

**Response:**
```json
{
  "success": true,
  "data": {
    "quest": { ... },
    "xpGained": 20,
    "levelUp": {
      "newLevel": 6,
      "newTitle": "E-Rank Hunter"
    },
    "statBonus": { "stat": "agility", "amount": 2 }
  }
}
```

### PATCH /quests/:id/toggle
Toggle quest activation

**Request:**
```json
{
  "isActive": false
}
```

### DELETE /quests/:id
Delete a quest

### GET /quests/templates
Get all quest templates

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Morning Shower",
      "description": "Take a morning shower",
      "category": "hygiene",
      "xpReward": 10,
      "statBonus": { "stat": "vitality", "amount": 1 },
      "frequency": "daily",
      "icon": "🚿",
      "difficulty": "easy",
      "isDefault": true
    }
  ]
}
```

## Achievements

### GET /achievements
Get all achievements (TODO)

### GET /achievements/user
Get user's achievements (TODO)

## Leaderboard

### GET /leaderboard
Get leaderboard (TODO)

**Query params:**
- `type=level|xp|streak`
- `period=daily|weekly|all_time`

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Quick Test (with curl)

```bash
# 1. Login (replace with real initData)
curl -X POST http://localhost:3001/api/v1/auth/telegram \
  -H "Content-Type: application/json" \
  -d '{"initData": "...your_telegram_initData..."}'

# Save the token from response

# 2. Get Profile
curl http://localhost:3001/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Get Quests
curl http://localhost:3001/api/v1/quests?isActive=true \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Complete Quest
curl -X POST http://localhost:3001/api/v1/quests/QUEST_ID/complete \
  -H "Authorization: Bearer YOUR_TOKEN"

# 5. Get Stats
curl http://localhost:3001/api/v1/users/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**API Version:** 1.0  
**Last Updated:** May 11, 2026
