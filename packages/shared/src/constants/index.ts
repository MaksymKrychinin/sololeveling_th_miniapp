// ===========================
// Quest Constants
// ===========================

export const QUEST_XP_REWARDS = {
  easy: 10,
  medium: 20,
  hard: 30,
  legendary: 50,
} as const;

export const QUEST_ICONS = {
  // Hygiene
  shower: '🚿',
  teeth: '🦷',
  skincare: '💆',
  
  // Health
  water: '💧',
  meal: '🍽️',
  vitamins: '💊',
  sleep: '😴',
  
  // Fitness
  run: '🏃',
  gym: '💪',
  steps: '👟',
  stretch: '🧘',
  
  // Learning
  book: '📚',
  language: '🗣️',
  study: '📖',
  words: '📝',
  
  // Mindfulness
  meditation: '🧘‍♂️',
  journal: '📔',
  gratitude: '🙏',
  
  // Productivity
  task: '✅',
  email: '📧',
  planning: '📋',
  
  // Social
  friend: '👥',
  family: '👨‍👩‍👧',
  call: '📞',
  
  // Custom
  custom: '⭐',
} as const;

// ===========================
// Level & Rank Constants
// ===========================

export const RANKS = {
  1: 'E-Rank Hunter',
  10: 'D-Rank Hunter',
  25: 'C-Rank Hunter',
  50: 'B-Rank Hunter',
  75: 'A-Rank Hunter',
  100: 'S-Rank Hunter',
  150: 'National Level Hunter',
  200: 'Shadow Monarch',
} as const;

export const RANK_COLORS = {
  'E-Rank Hunter': '#94a3b8',
  'D-Rank Hunter': '#10b981',
  'C-Rank Hunter': '#3b82f6',
  'B-Rank Hunter': '#8b5cf6',
  'A-Rank Hunter': '#f59e0b',
  'S-Rank Hunter': '#ef4444',
  'National Level Hunter': '#ec4899',
  'Shadow Monarch': '#6366f1',
} as const;

// ===========================
// Achievement Constants
// ===========================

export const ACHIEVEMENT_DEFINITIONS = [
  // Streak Achievements
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Complete quests for 7 days in a row',
    rarity: 'common',
    requirement: { type: 'streak', value: 7 },
    icon: '🔥',
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Complete quests for 30 days in a row',
    rarity: 'rare',
    requirement: { type: 'streak', value: 30 },
    icon: '🔥',
  },
  {
    id: 'streak_100',
    title: 'Century Champion',
    description: 'Complete quests for 100 days in a row',
    rarity: 'epic',
    requirement: { type: 'streak', value: 100 },
    icon: '🔥',
  },
  {
    id: 'streak_365',
    title: 'Eternal Flame',
    description: 'Complete quests for 365 days in a row',
    rarity: 'legendary',
    requirement: { type: 'streak', value: 365 },
    icon: '🔥',
  },
  
  // Quest Total Achievements
  {
    id: 'quests_50',
    title: 'Getting Started',
    description: 'Complete 50 quests',
    rarity: 'common',
    requirement: { type: 'total_quests', value: 50 },
    icon: '⚔️',
  },
  {
    id: 'quests_200',
    title: 'Dedicated Hunter',
    description: 'Complete 200 quests',
    rarity: 'rare',
    requirement: { type: 'total_quests', value: 200 },
    icon: '⚔️',
  },
  {
    id: 'quests_500',
    title: 'Quest Master',
    description: 'Complete 500 quests',
    rarity: 'epic',
    requirement: { type: 'total_quests', value: 500 },
    icon: '⚔️',
  },
  {
    id: 'quests_1000',
    title: 'Legendary Hunter',
    description: 'Complete 1000 quests',
    rarity: 'legendary',
    requirement: { type: 'total_quests', value: 1000 },
    icon: '⚔️',
  },
  
  // Level Achievements
  {
    id: 'level_10',
    title: 'Rising Star',
    description: 'Reach level 10',
    rarity: 'common',
    requirement: { type: 'level', value: 10 },
    icon: '⭐',
  },
  {
    id: 'level_50',
    title: 'Elite Hunter',
    description: 'Reach level 50',
    rarity: 'rare',
    requirement: { type: 'level', value: 50 },
    icon: '⭐',
  },
  {
    id: 'level_100',
    title: 'National Pride',
    description: 'Reach level 100',
    rarity: 'epic',
    requirement: { type: 'level', value: 100 },
    icon: '⭐',
  },
] as const;

// ===========================
// Color Palette
// ===========================

export const COLORS = {
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  accent: {
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0ea5e9',
    700: '#0284c7',
  },
  dark: {
    900: '#0f172a',
    800: '#1e293b',
    700: '#334155',
    600: '#475569',
  },
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
} as const;

// ===========================
// API Constants
// ===========================

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/telegram',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USER: {
    PROFILE: '/users/profile',
    STATS: '/users/stats',
    UPDATE: '/users/profile',
  },
  QUESTS: {
    LIST: '/quests',
    CREATE: '/quests',
    UPDATE: '/quests/:id',
    DELETE: '/quests/:id',
    COMPLETE: '/quests/:id/complete',
    TEMPLATES: '/quests/templates',
  },
  ACHIEVEMENTS: {
    LIST: '/achievements',
    USER_ACHIEVEMENTS: '/achievements/user',
  },
  LEADERBOARD: {
    GET: '/leaderboard',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// ===========================
// Validation Constants
// ===========================

export const VALIDATION_RULES = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  QUEST_TITLE_MIN_LENGTH: 3,
  QUEST_TITLE_MAX_LENGTH: 100,
  QUEST_DESCRIPTION_MAX_LENGTH: 500,
  PASSWORD_MIN_LENGTH: 8,
  MAX_ACTIVE_QUESTS: 20,
  MAX_CUSTOM_QUESTS: 10,
} as const;

// ===========================
// Timing Constants
// ===========================

export const TIMING = {
  STREAK_GRACE_PERIOD_HOURS: 4,
  JWT_EXPIRES_IN: '7d',
  REFRESH_TOKEN_EXPIRES_IN: '30d',
  CACHE_TTL_SHORT: 300, // 5 minutes
  CACHE_TTL_MEDIUM: 1800, // 30 minutes
  CACHE_TTL_LONG: 3600, // 1 hour
  RATE_LIMIT_WINDOW_MS: 60000, // 1 minute
  RATE_LIMIT_MAX: 100,
} as const;

// ===========================
// Default Quest Templates
// ===========================

export const DEFAULT_QUEST_TEMPLATES = [
  // Hygiene
  { 
    title: 'Morning Shower', 
    category: 'hygiene', 
    xpReward: 10, 
    statBonus: { stat: 'vitality', amount: 1 },
    difficulty: 'easy',
    icon: QUEST_ICONS.shower,
  },
  { 
    title: 'Brush Teeth (Morning)', 
    category: 'hygiene', 
    xpReward: 5, 
    statBonus: { stat: 'vitality', amount: 1 },
    difficulty: 'easy',
    icon: QUEST_ICONS.teeth,
  },
  { 
    title: 'Brush Teeth (Evening)', 
    category: 'hygiene', 
    xpReward: 5, 
    statBonus: { stat: 'vitality', amount: 1 },
    difficulty: 'easy',
    icon: QUEST_ICONS.teeth,
  },
  
  // Health
  { 
    title: 'Drink 8 Glasses of Water', 
    category: 'health', 
    xpReward: 15, 
    statBonus: { stat: 'vitality', amount: 2 },
    difficulty: 'medium',
    icon: QUEST_ICONS.water,
  },
  { 
    title: 'Healthy Breakfast', 
    category: 'health', 
    xpReward: 10, 
    statBonus: { stat: 'vitality', amount: 1 },
    difficulty: 'easy',
    icon: QUEST_ICONS.meal,
  },
  
  // Fitness
  { 
    title: 'Morning Run', 
    category: 'fitness', 
    xpReward: 20, 
    statBonus: { stat: 'agility', amount: 2 },
    difficulty: 'medium',
    icon: QUEST_ICONS.run,
  },
  { 
    title: 'Gym Workout', 
    category: 'fitness', 
    xpReward: 25, 
    statBonus: { stat: 'strength', amount: 2 },
    difficulty: 'hard',
    icon: QUEST_ICONS.gym,
  },
  { 
    title: '10,000 Steps', 
    category: 'fitness', 
    xpReward: 15, 
    statBonus: { stat: 'agility', amount: 1 },
    difficulty: 'medium',
    icon: QUEST_ICONS.steps,
  },
  
  // Learning
  { 
    title: 'Read for 30 Minutes', 
    category: 'learning', 
    xpReward: 20, 
    statBonus: { stat: 'intelligence', amount: 2 },
    difficulty: 'medium',
    icon: QUEST_ICONS.book,
  },
  { 
    title: 'Learn 10 New Words', 
    category: 'learning', 
    xpReward: 15, 
    statBonus: { stat: 'intelligence', amount: 2 },
    difficulty: 'medium',
    icon: QUEST_ICONS.words,
  },
  
  // Mindfulness
  { 
    title: 'Morning Meditation (15 min)', 
    category: 'mindfulness', 
    xpReward: 15, 
    statBonus: { stat: 'sense', amount: 2 },
    difficulty: 'medium',
    icon: QUEST_ICONS.meditation,
  },
  { 
    title: 'Evening Journaling', 
    category: 'mindfulness', 
    xpReward: 10, 
    statBonus: { stat: 'sense', amount: 1 },
    difficulty: 'easy',
    icon: QUEST_ICONS.journal,
  },
  
  // Productivity
  { 
    title: 'Complete Main Task', 
    category: 'productivity', 
    xpReward: 25, 
    difficulty: 'medium',
    icon: QUEST_ICONS.task,
  },
  { 
    title: 'Plan Tomorrow', 
    category: 'productivity', 
    xpReward: 10, 
    statBonus: { stat: 'intelligence', amount: 1 },
    difficulty: 'easy',
    icon: QUEST_ICONS.planning,
  },
] as const;
