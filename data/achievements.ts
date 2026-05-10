import { Achievement, AchievementType, AchievementRarity, QuestCategory, StatType } from '../src/types';

/**
 * Pre-defined achievements that users can unlock
 * These provide goals and milestones for users
 */

export const ACHIEVEMENTS: Omit<Achievement, 'id' | 'createdAt'>[] = [
  // ============================================================================
  // BEGINNER ACHIEVEMENTS (Common)
  // ============================================================================
  {
    title: 'First Steps',
    description: 'Complete your first quest',
    icon: '🎯',
    rarity: AchievementRarity.COMMON,
    requirement: {
      type: AchievementType.TOTAL_QUESTS,
      value: 1,
    },
  },
  {
    title: 'Getting Started',
    description: 'Complete 10 quests',
    icon: '✨',
    rarity: AchievementRarity.COMMON,
    requirement: {
      type: AchievementType.TOTAL_QUESTS,
      value: 10,
    },
  },
  {
    title: 'Awakening',
    description: 'Reach level 5',
    icon: '⚡',
    rarity: AchievementRarity.COMMON,
    requirement: {
      type: AchievementType.LEVEL,
      value: 5,
    },
  },
  {
    title: 'First Streak',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    rarity: AchievementRarity.COMMON,
    requirement: {
      type: AchievementType.STREAK,
      value: 3,
    },
  },

  // ============================================================================
  // QUEST COMPLETION ACHIEVEMENTS (Common to Rare)
  // ============================================================================
  {
    title: 'Dedicated Hunter',
    description: 'Complete 50 quests',
    icon: '🎖️',
    rarity: AchievementRarity.COMMON,
    requirement: {
      type: AchievementType.TOTAL_QUESTS,
      value: 50,
    },
  },
  {
    title: 'Veteran Hunter',
    description: 'Complete 100 quests',
    icon: '🏅',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.TOTAL_QUESTS,
      value: 100,
    },
  },
  {
    title: 'Elite Hunter',
    description: 'Complete 250 quests',
    icon: '🎗️',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.TOTAL_QUESTS,
      value: 250,
    },
  },
  {
    title: 'Master Hunter',
    description: 'Complete 500 quests',
    icon: '🏆',
    rarity: AchievementRarity.EPIC,
    requirement: {
      type: AchievementType.TOTAL_QUESTS,
      value: 500,
    },
  },
  {
    title: 'Legendary Hunter',
    description: 'Complete 1000 quests',
    icon: '👑',
    rarity: AchievementRarity.LEGENDARY,
    requirement: {
      type: AchievementType.TOTAL_QUESTS,
      value: 1000,
    },
  },

  // ============================================================================
  // LEVEL ACHIEVEMENTS (Rare to Legendary)
  // ============================================================================
  {
    title: 'D-Rank Hunter',
    description: 'Reach level 10',
    icon: '📗',
    rarity: AchievementRarity.COMMON,
    requirement: {
      type: AchievementType.LEVEL,
      value: 10,
    },
  },
  {
    title: 'C-Rank Hunter',
    description: 'Reach level 25',
    icon: '📘',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.LEVEL,
      value: 25,
    },
  },
  {
    title: 'B-Rank Hunter',
    description: 'Reach level 50',
    icon: '📙',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.LEVEL,
      value: 50,
    },
  },
  {
    title: 'A-Rank Hunter',
    description: 'Reach level 75',
    icon: '📕',
    rarity: AchievementRarity.EPIC,
    requirement: {
      type: AchievementType.LEVEL,
      value: 75,
    },
  },
  {
    title: 'S-Rank Hunter',
    description: 'Reach level 100',
    icon: '📚',
    rarity: AchievementRarity.EPIC,
    requirement: {
      type: AchievementType.LEVEL,
      value: 100,
    },
  },
  {
    title: 'National Level Hunter',
    description: 'Reach level 150',
    icon: '🌟',
    rarity: AchievementRarity.LEGENDARY,
    requirement: {
      type: AchievementType.LEVEL,
      value: 150,
    },
  },
  {
    title: 'Shadow Monarch',
    description: 'Reach level 200',
    icon: '👤',
    rarity: AchievementRarity.LEGENDARY,
    requirement: {
      type: AchievementType.LEVEL,
      value: 200,
    },
  },

  // ============================================================================
  // STREAK ACHIEVEMENTS (Rare to Legendary)
  // ============================================================================
  {
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.STREAK,
      value: 7,
    },
  },
  {
    title: 'Monthly Dedication',
    description: 'Maintain a 30-day streak',
    icon: '⭐',
    rarity: AchievementRarity.EPIC,
    requirement: {
      type: AchievementType.STREAK,
      value: 30,
    },
  },
  {
    title: 'Unstoppable',
    description: 'Maintain a 50-day streak',
    icon: '💥',
    rarity: AchievementRarity.EPIC,
    requirement: {
      type: AchievementType.STREAK,
      value: 50,
    },
  },
  {
    title: 'Century Mark',
    description: 'Maintain a 100-day streak',
    icon: '💯',
    rarity: AchievementRarity.LEGENDARY,
    requirement: {
      type: AchievementType.STREAK,
      value: 100,
    },
  },
  {
    title: 'Year of Excellence',
    description: 'Maintain a 365-day streak',
    icon: '🎊',
    rarity: AchievementRarity.LEGENDARY,
    requirement: {
      type: AchievementType.STREAK,
      value: 365,
    },
  },

  // ============================================================================
  // CATEGORY-SPECIFIC ACHIEVEMENTS
  // ============================================================================
  {
    title: 'Clean Freak',
    description: 'Complete 30 hygiene quests',
    icon: '🧼',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.CATEGORY_QUESTS,
      value: 30,
      metadata: { category: QuestCategory.HYGIENE },
    },
  },
  {
    title: 'Health Enthusiast',
    description: 'Complete 50 health quests',
    icon: '🥗',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.CATEGORY_QUESTS,
      value: 50,
      metadata: { category: QuestCategory.HEALTH },
    },
  },
  {
    title: 'Fitness Fanatic',
    description: 'Complete 50 fitness quests',
    icon: '💪',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.CATEGORY_QUESTS,
      value: 50,
      metadata: { category: QuestCategory.FITNESS },
    },
  },
  {
    title: 'Bookworm',
    description: 'Complete 50 learning quests',
    icon: '📚',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.CATEGORY_QUESTS,
      value: 50,
      metadata: { category: QuestCategory.LEARNING },
    },
  },
  {
    title: 'Zen Master',
    description: 'Complete 50 mindfulness quests',
    icon: '🧘',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.CATEGORY_QUESTS,
      value: 50,
      metadata: { category: QuestCategory.MINDFULNESS },
    },
  },
  {
    title: 'Productivity Pro',
    description: 'Complete 50 productivity quests',
    icon: '📋',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.CATEGORY_QUESTS,
      value: 50,
      metadata: { category: QuestCategory.PRODUCTIVITY },
    },
  },

  // ============================================================================
  // STAT ACHIEVEMENTS
  // ============================================================================
  {
    title: 'Strong as Steel',
    description: 'Reach 50 Strength',
    icon: '💪',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.STAT,
      value: 50,
      metadata: { stat: StatType.STRENGTH },
    },
  },
  {
    title: 'Lightning Fast',
    description: 'Reach 50 Agility',
    icon: '⚡',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.STAT,
      value: 50,
      metadata: { stat: StatType.AGILITY },
    },
  },
  {
    title: 'Genius Mind',
    description: 'Reach 50 Intelligence',
    icon: '🧠',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.STAT,
      value: 50,
      metadata: { stat: StatType.INTELLIGENCE },
    },
  },
  {
    title: 'Vitality Peak',
    description: 'Reach 50 Vitality',
    icon: '❤️',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.STAT,
      value: 50,
      metadata: { stat: StatType.VITALITY },
    },
  },
  {
    title: 'Heightened Senses',
    description: 'Reach 50 Sense',
    icon: '👁️',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.STAT,
      value: 50,
      metadata: { stat: StatType.SENSE },
    },
  },

  // ============================================================================
  // PERFECT DAY/WEEK ACHIEVEMENTS
  // ============================================================================
  {
    title: 'Perfect Day',
    description: 'Complete all your quests in a single day',
    icon: '✨',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.PERFECT_DAY,
      value: 1,
    },
  },
  {
    title: 'Perfect Week',
    description: 'Complete all quests every day for 7 days',
    icon: '🌟',
    rarity: AchievementRarity.EPIC,
    requirement: {
      type: AchievementType.PERFECT_WEEK,
      value: 1,
    },
  },
  {
    title: 'Flawless Month',
    description: 'Complete all quests every day for 30 days',
    icon: '🏅',
    rarity: AchievementRarity.LEGENDARY,
    requirement: {
      type: AchievementType.PERFECT_DAY,
      value: 30,
    },
  },

  // ============================================================================
  // SPECIAL/FUN ACHIEVEMENTS
  // ============================================================================
  {
    title: 'Early Bird',
    description: 'Complete a quest before 6 AM',
    icon: '🌅',
    rarity: AchievementRarity.COMMON,
    requirement: {
      type: AchievementType.SPECIFIC_QUEST,
      value: 1,
      metadata: { special: 'early_morning' },
    },
  },
  {
    title: 'Night Owl',
    description: 'Complete a quest after 11 PM',
    icon: '🦉',
    rarity: AchievementRarity.COMMON,
    requirement: {
      type: AchievementType.SPECIFIC_QUEST,
      value: 1,
      metadata: { special: 'late_night' },
    },
  },
  {
    title: 'Weekend Warrior',
    description: 'Complete all quests on Saturday and Sunday',
    icon: '🎉',
    rarity: AchievementRarity.RARE,
    requirement: {
      type: AchievementType.SPECIFIC_QUEST,
      value: 1,
      metadata: { special: 'weekend' },
    },
  },
  {
    title: 'Balanced Life',
    description: 'Complete quests from all categories in one week',
    icon: '⚖️',
    rarity: AchievementRarity.EPIC,
    requirement: {
      type: AchievementType.SPECIFIC_QUEST,
      value: 1,
      metadata: { special: 'all_categories' },
    },
  },
  {
    title: 'Rising Star',
    description: 'Gain 1000 XP in a single day',
    icon: '🌠',
    rarity: AchievementRarity.EPIC,
    requirement: {
      type: AchievementType.SPECIFIC_QUEST,
      value: 1000,
      metadata: { special: 'daily_xp' },
    },
  },
];

export default ACHIEVEMENTS;
