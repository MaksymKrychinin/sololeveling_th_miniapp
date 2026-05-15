import { z } from 'zod';

// ===========================
// User Schemas
// ===========================

export const userStatsSchema = z.object({
  strength: z.number().int().min(0),
  agility: z.number().int().min(0),
  intelligence: z.number().int().min(0),
  vitality: z.number().int().min(0),
  sense: z.number().int().min(0),
});

export const userProfileSchema = z.object({
  id: z.string().uuid(),
  telegramId: z.number().int().positive(),
  username: z.string().min(3).max(30),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  level: z.number().int().min(1),
  currentXP: z.number().int().min(0),
  xpToNextLevel: z.number().int().positive(),
  title: z.string(),
  avatar: z.string().url().optional(),
  joinedAt: z.date(),
  stats: userStatsSchema,
  streak: z.number().int().min(0),
  totalTasksCompleted: z.number().int().min(0),
  timezone: z.string().optional(),
  lastActiveAt: z.date(),
});

// ===========================
// Quest Schemas
// ===========================

export const questCategorySchema = z.enum([
  'hygiene',
  'health',
  'fitness',
  'learning',
  'mindfulness',
  'productivity',
  'social',
  'custom',
]);

export const questDifficultySchema = z.enum(['easy', 'medium', 'hard', 'legendary']);

export const questStatusSchema = z.enum(['pending', 'completed', 'failed', 'skipped']);

export const questFrequencySchema = z.enum(['daily', 'weekly', 'custom']);

export const statBonusSchema = z.object({
  stat: z.enum(['strength', 'agility', 'intelligence', 'vitality', 'sense']),
  amount: z.number().int().min(1).max(10),
});

export const createQuestSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  category: questCategorySchema,
  xpReward: z.number().int().min(5).max(100),
  statBonus: statBonusSchema.optional(),
  frequency: questFrequencySchema,
  icon: z.string(),
  difficulty: questDifficultySchema,
  templateId: z.string().uuid().optional(),
});

export const updateQuestSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
  status: questStatusSchema.optional(),
});

// ===========================
// Achievement Schemas
// ===========================

export const achievementRaritySchema = z.enum(['common', 'rare', 'epic', 'legendary']);

export const achievementTypeSchema = z.enum([
  'streak',
  'total_quests',
  'level',
  'stat',
  'specific_quest',
  'category',
]);

export const achievementRequirementSchema = z.object({
  type: achievementTypeSchema,
  value: z.number().int().positive(),
  metadata: z.record(z.any()).optional(),
});

// ===========================
// Authentication Schemas
// ===========================

export const telegramUserSchema = z.object({
  id: z.number().int().positive(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  language_code: z.string().optional(),
  is_premium: z.boolean().optional(),
  photo_url: z.string().url().optional(),
});

export const telegramInitDataSchema = z.object({
  query_id: z.string().optional(),
  user: telegramUserSchema.optional(),
  auth_date: z.number().int(),
  hash: z.string(),
});

export const loginSchema = z.object({
  initData: z.string(),
});

// ===========================
// API Request Schemas
// ===========================

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const leaderboardQuerySchema = z.object({
  type: z.enum(['level', 'xp', 'streak', 'total_quests']).default('level'),
  period: z.enum(['daily', 'weekly', 'monthly', 'all_time']).default('all_time'),
  ...paginationSchema.shape,
});

// ===========================
// Validation Helpers
// ===========================

// Note: UserProfile type is defined in types/index.ts, not duplicated here
export type CreateQuestInput = z.infer<typeof createQuestSchema>;
export type UpdateQuestInput = z.infer<typeof updateQuestSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type LeaderboardQuery = z.infer<typeof leaderboardQuerySchema>;
