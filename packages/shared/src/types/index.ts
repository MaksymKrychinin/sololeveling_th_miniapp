// ===========================
// User Types
// ===========================

export interface UserProfile {
  id: string;
  telegramId: number;
  username: string;
  firstName?: string;
  lastName?: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  title: string;
  avatar?: string;
  joinedAt: Date;
  stats: UserStats;
  streak: number;
  totalTasksCompleted: number;
  timezone?: string;
  lastActiveAt: Date;
}

export interface UserStats {
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
  sense: number;
}

export type StatType = keyof UserStats;

// ===========================
// Quest Types
// ===========================

export enum QuestCategory {
  HYGIENE = 'hygiene',
  HEALTH = 'health',
  FITNESS = 'fitness',
  LEARNING = 'learning',
  MINDFULNESS = 'mindfulness',
  PRODUCTIVITY = 'productivity',
  SOCIAL = 'social',
  CUSTOM = 'custom',
}

export enum QuestDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  LEGENDARY = 'legendary',
}

export enum QuestStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
}

export enum QuestFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  CUSTOM = 'custom',
}

export interface Quest {
  id: string;
  userId: string;
  templateId?: string;
  title: string;
  description?: string;
  category: QuestCategory;
  xpReward: number;
  statBonus?: StatBonus;
  frequency: QuestFrequency;
  status: QuestStatus;
  completedAt?: Date;
  streak: number;
  icon: string;
  difficulty: QuestDifficulty;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestTemplate {
  id: string;
  title: string;
  description?: string;
  category: QuestCategory;
  xpReward: number;
  statBonus?: StatBonus;
  frequency: QuestFrequency;
  icon: string;
  difficulty: QuestDifficulty;
  isDefault: boolean;
}

export interface StatBonus {
  stat: StatType;
  amount: number;
}

// ===========================
// Achievement Types
// ===========================

export enum AchievementRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export enum AchievementType {
  STREAK = 'streak',
  TOTAL_QUESTS = 'total_quests',
  LEVEL = 'level',
  STAT = 'stat',
  SPECIFIC_QUEST = 'specific_quest',
  CATEGORY = 'category',
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  requirement: AchievementRequirement;
  reward?: AchievementReward;
}

export interface AchievementRequirement {
  type: AchievementType;
  value: number;
  metadata?: Record<string, any>;
}

export interface AchievementReward {
  xp?: number;
  title?: string;
  badge?: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  achievement: Achievement;
  unlockedAt: Date;
  progress: number;
  isCompleted: boolean;
}

// ===========================
// Leaderboard Types
// ===========================

export enum LeaderboardType {
  LEVEL = 'level',
  XP = 'xp',
  STREAK = 'streak',
  TOTAL_QUESTS = 'total_quests',
}

export enum LeaderboardPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  ALL_TIME = 'all_time',
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  level: number;
  title: string;
  value: number;
  trend?: 'up' | 'down' | 'same';
}

// ===========================
// API Response Types
// ===========================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ===========================
// Authentication Types
// ===========================

export interface TelegramInitData {
  query_id?: string;
  user?: TelegramUser;
  auth_date: number;
  hash: string;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface AuthToken {
  token: string;
  expiresAt: Date;
  user: UserProfile;
}

// ===========================
// Statistics Types
// ===========================

export interface UserStatistics {
  userId: string;
  totalQuests: number;
  completedQuests: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  categoriesBreakdown: CategoryStats[];
  weeklyActivity: ActivityData[];
  monthlyActivity: ActivityData[];
}

export interface CategoryStats {
  category: QuestCategory;
  total: number;
  completed: number;
  completionRate: number;
  totalXP: number;
}

export interface ActivityData {
  date: string;
  questsCompleted: number;
  xpGained: number;
}

// ===========================
// Notification Types
// ===========================

export enum NotificationType {
  QUEST_REMINDER = 'quest_reminder',
  STREAK_WARNING = 'streak_warning',
  LEVEL_UP = 'level_up',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  DAILY_SUMMARY = 'daily_summary',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

// ===========================
// Event Types (for real-time updates)
// ===========================

export enum WebSocketEvent {
  QUEST_COMPLETED = 'quest:completed',
  LEVEL_UP = 'user:level_up',
  ACHIEVEMENT_UNLOCKED = 'achievement:unlocked',
  STREAK_UPDATED = 'user:streak_updated',
  LEADERBOARD_UPDATED = 'leaderboard:updated',
}

export interface WebSocketMessage<T = any> {
  event: WebSocketEvent;
  data: T;
  timestamp: Date;
}
