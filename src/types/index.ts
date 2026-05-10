// This file contains all shared TypeScript types and interfaces for the Solo Leveling app

// ============================================================================
// USER TYPES
// ============================================================================

export interface UserProfile {
  id: string;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;

  // Progression
  level: number;
  currentXP: number;
  totalXP: number;
  title: string; // "E-Rank Hunter", "D-Rank Hunter", etc.

  // Stats
  stats: UserStats;

  // Activity
  streak: number;
  lastActiveDate: Date;
  totalTasksCompleted: number;

  // Settings
  timezone: string;
  notificationEnabled: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  strength: number;      // Gym, sports, physical training
  agility: number;       // Running, cardio, flexibility
  intelligence: number;  // Reading, learning, studying
  vitality: number;      // Health habits: water, food, sleep
  sense: number;         // Mindfulness, meditation, awareness
}

export enum StatType {
  STRENGTH = 'strength',
  AGILITY = 'agility',
  INTELLIGENCE = 'intelligence',
  VITALITY = 'vitality',
  SENSE = 'sense'
}

export interface StatUpdate {
  stat: StatType;
  amount: number;
}

export interface StatsHistory {
  id: string;
  userId: string;
  date: Date;
  level: number;
  totalXP: number;
  questsCompleted: number;
  stats: UserStats;
}

// ============================================================================
// QUEST TYPES
// ============================================================================

export interface Quest {
  id: string;
  userId: string;

  // Basic Info
  title: string;
  description?: string;
  category: QuestCategory;

  // Rewards
  xpReward: number;
  statBonus?: StatUpdate;

  // Configuration
  difficulty: QuestDifficulty;
  icon: string;
  color?: string;
  frequency: QuestFrequency;
  isActive: boolean;

  // Status
  status: QuestStatus;
  completedAt?: Date;

  // Progress
  streak: number;
  totalCompletions: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export enum QuestCategory {
  HYGIENE = 'hygiene',           // Shower, brush teeth, skincare
  HEALTH = 'health',             // Water intake, meals, vitamins
  FITNESS = 'fitness',           // Gym, running, exercise
  LEARNING = 'learning',         // Reading, vocabulary, studying
  MINDFULNESS = 'mindfulness',   // Meditation, journaling, gratitude
  PRODUCTIVITY = 'productivity', // Tasks, planning, work
  SOCIAL = 'social',             // Social interactions, relationships
  SLEEP = 'sleep',               // Sleep routine, wake up time
  CUSTOM = 'custom'              // User-created quests
}

export enum QuestDifficulty {
  EASY = 'easy',           // 5-10 XP
  MEDIUM = 'medium',       // 10-20 XP
  HARD = 'hard',           // 20-30 XP
  LEGENDARY = 'legendary'  // 40+ XP
}

export enum QuestFrequency {
  DAILY = 'daily',         // Resets every day
  WEEKLY = 'weekly',       // Resets every week
  CUSTOM = 'custom'        // Custom schedule
}

export enum QuestStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export interface QuestTemplate {
  title: string;
  description: string;
  category: QuestCategory;
  xpReward: number;
  statBonus?: StatUpdate;
  difficulty: QuestDifficulty;
  icon: string;
  color: string;
  frequency: QuestFrequency;
  isPopular?: boolean;
}

export interface QuestCompletion {
  id: string;
  userId: string;
  questId: string;
  xpGained: number;
  bonusXP: number;
  completedAt: Date;
}

export interface CompleteQuestResult {
  quest: Quest;
  xpGained: number;
  bonusXP: number;
  levelUp: boolean;
  newLevel?: number;
  newTitle?: string;
  newAchievements?: Achievement[];
}

// ============================================================================
// ACHIEVEMENT TYPES
// ============================================================================

export interface Achievement {
  id: string;

  // Display
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;

  // Requirements
  requirement: AchievementRequirement;

  // Metadata
  createdAt: Date;
}

export enum AchievementRarity {
  COMMON = 'common',       // Gray/Silver
  RARE = 'rare',           // Blue
  EPIC = 'epic',           // Purple
  LEGENDARY = 'legendary'  // Gold/Orange
}

export interface AchievementRequirement {
  type: AchievementType;
  value: number;
  metadata?: Record<string, any>;
}

export enum AchievementType {
  TOTAL_QUESTS = 'total_quests',           // Complete X quests
  STREAK = 'streak',                        // Maintain X day streak
  LEVEL = 'level',                          // Reach level X
  STAT = 'stat',                            // Reach stat value X
  SPECIFIC_QUEST = 'specific_quest',        // Complete specific quest X times
  CATEGORY_QUESTS = 'category_quests',      // Complete X quests in category
  PERFECT_DAY = 'perfect_day',              // Complete all quests in a day
  PERFECT_WEEK = 'perfect_week'             // Complete all quests for 7 days
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

export interface AchievementWithStatus extends Achievement {
  isUnlocked: boolean;
  unlockedAt?: Date;
  progress?: number; // 0-100
}

// ============================================================================
// LEADERBOARD TYPES
// ============================================================================

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl?: string;
  level: number;
  totalXP: number;
  streak: number;
  value: number; // The value being ranked (level, xp, or streak)
}

export enum LeaderboardType {
  LEVEL = 'level',
  XP = 'xp',
  STREAK = 'streak'
}

export enum LeaderboardPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  ALL_TIME = 'alltime'
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

// Auth
export interface TelegramAuthRequest {
  initData: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

// Quests
export interface CreateQuestInput {
  title: string;
  description?: string;
  category: QuestCategory;
  xpReward: number;
  statBonus?: StatUpdate;
  difficulty: QuestDifficulty;
  icon: string;
  color?: string;
  frequency: QuestFrequency;
}

export interface UpdateQuestInput {
  title?: string;
  description?: string;
  xpReward?: number;
  statBonus?: StatUpdate;
  difficulty?: QuestDifficulty;
  icon?: string;
  color?: string;
  isActive?: boolean;
}

export interface QuestFilter {
  status?: QuestStatus;
  category?: QuestCategory;
  isActive?: boolean;
  date?: string; // YYYY-MM-DD
}

// Profile
export interface UpdateProfileInput {
  username?: string;
  avatarUrl?: string;
  timezone?: string;
  notificationEnabled?: boolean;
}

// Stats
export interface UserStatsResponse {
  stats: UserStats;
  history: StatsHistory[];
  summary: {
    totalQuests: number;
    averagePerDay: number;
    mostActiveCategory: QuestCategory;
    currentStreak: number;
    longestStreak: number;
  };
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

export interface ErrorState {
  hasError: boolean;
  errorMessage?: string;
  errorCode?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  data?: any;
}

// ============================================================================
// TELEGRAM TYPES
// ============================================================================

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    auth_date: number;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;

  // Methods
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: TelegramMainButton;
  BackButton: TelegramBackButton;
  HapticFeedback: TelegramHapticFeedback;
  showPopup: (params: PopupParams, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
}

export interface TelegramMainButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  isProgressVisible: boolean;
  setText: (text: string) => void;
  onClick: (callback: () => void) => void;
  show: () => void;
  hide: () => void;
  enable: () => void;
  disable: () => void;
  showProgress: (leaveActive?: boolean) => void;
  hideProgress: () => void;
}

export interface TelegramBackButton {
  isVisible: boolean;
  onClick: (callback: () => void) => void;
  show: () => void;
  hide: () => void;
}

export interface TelegramHapticFeedback {
  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
  selectionChanged: () => void;
}

export interface PopupParams {
  title?: string;
  message: string;
  buttons?: Array<{
    id: string;
    type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
    text: string;
  }>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DateString = string; // ISO 8601 format

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: Record<string, any>;
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const RANK_TITLES: Record<number, string> = {
  1: 'E-Rank Hunter',
  10: 'D-Rank Hunter',
  25: 'C-Rank Hunter',
  50: 'B-Rank Hunter',
  75: 'A-Rank Hunter',
  100: 'S-Rank Hunter',
  150: 'National Level Hunter',
  200: 'Shadow Monarch'
};

export const CATEGORY_ICONS: Record<QuestCategory, string> = {
  [QuestCategory.HYGIENE]: '🚿',
  [QuestCategory.HEALTH]: '🥗',
  [QuestCategory.FITNESS]: '💪',
  [QuestCategory.LEARNING]: '📚',
  [QuestCategory.MINDFULNESS]: '🧘',
  [QuestCategory.PRODUCTIVITY]: '📋',
  [QuestCategory.SOCIAL]: '👥',
  [QuestCategory.SLEEP]: '😴',
  [QuestCategory.CUSTOM]: '⭐'
};

export const STAT_ICONS: Record<StatType, string> = {
  [StatType.STRENGTH]: '💪',
  [StatType.AGILITY]: '🏃',
  [StatType.INTELLIGENCE]: '🧠',
  [StatType.VITALITY]: '❤️',
  [StatType.SENSE]: '👁️'
};

export const DIFFICULTY_COLORS: Record<QuestDifficulty, string> = {
  [QuestDifficulty.EASY]: '#10B981',      // emerald-500
  [QuestDifficulty.MEDIUM]: '#F59E0B',    // amber-500
  [QuestDifficulty.HARD]: '#EF4444',      // red-500
  [QuestDifficulty.LEGENDARY]: '#8B5CF6'  // purple-600
};

export const RARITY_COLORS: Record<AchievementRarity, string> = {
  [AchievementRarity.COMMON]: '#94A3B8',   // slate-400
  [AchievementRarity.RARE]: '#3B82F6',     // blue-500
  [AchievementRarity.EPIC]: '#A855F7',     // purple-500
  [AchievementRarity.LEGENDARY]: '#F59E0B' // amber-500
};
