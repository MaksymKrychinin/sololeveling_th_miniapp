import { userRepository } from '@/repositories/UserRepository';
import { questRepository } from '@/repositories/QuestRepository';
import { achievementRepository } from '@/repositories/AchievementRepository';
import { calculateXPForLevel, getRankTitle } from '@solo-leveling/shared';
import { AppError } from '@/middleware/errorHandler';

// Define explicit return types
type UserProfileResponse = {
  id: string;
  telegramId: number;
  username: string;
  firstName: string | null;
  lastName: string | null;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  title: string;
  avatar: string | null;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    vitality: number;
    sense: number;
  };
  streak: number;
  longestStreak: number;
  totalTasksCompleted: number;
  totalXP: number;
  joinedAt: Date;
};

type XPResult = {
  leveledUp: boolean;
  newLevel: number;
  xpGained: number;
  currentXP: number;
  xpToNextLevel: number;
  newTitle?: string;
};

type StatsResponse = {
  level: number;
  title: string;
  totalXP: number;
  currentXP: number;
  xpToNextLevel: number;
  streak: number;
  longestStreak: number;
  totalTasksCompleted: number;
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    vitality: number;
    sense: number;
  };
  quests: {
    total: number;
    active: number;
    completed: number;
  };
  categoryStats: Record<string, { total: number; completed: number }>;
};

type StreakUpdateResponse = {
  streak: number;
  longestStreak: number;
};

export class UserService {
  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<UserProfileResponse> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return {
      id: user.id,
      telegramId: Number(user.telegramId),
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      level: user.level,
      currentXP: user.currentXP,
      xpToNextLevel: calculateXPForLevel(user.level + 1),
      title: user.title,
      avatar: user.avatar,
      stats: {
        strength: user.strength,
        agility: user.agility,
        intelligence: user.intelligence,
        vitality: user.vitality,
        sense: user.sense,
      },
      streak: user.streak,
      longestStreak: user.longestStreak,
      totalTasksCompleted: user.totalTasksCompleted,
      totalXP: Number(user.totalXP),
      joinedAt: user.createdAt,
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: { avatar?: string; timezone?: string }): Promise<UserProfileResponse> {
    const user = await userRepository.update(userId, data);
    return this.getProfile(user.id);
  }

  /**
   * Add XP to user and check for level up
   */
  async addXP(userId: string, xpGained: number): Promise<XPResult> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Calculate new XP
    const newCurrentXP = user.currentXP + xpGained;

    let leveledUp = false;
    let newLevel = user.level;
    let remainingXP = newCurrentXP;

    // Check for level up(s)
    while (remainingXP >= calculateXPForLevel(newLevel + 1)) {
      remainingXP -= calculateXPForLevel(newLevel + 1);
      newLevel++;
      leveledUp = true;
    }

    // Update user
    await userRepository.update(userId, {
      level: newLevel,
      currentXP: remainingXP,
      totalXP: BigInt(user.totalXP) + BigInt(xpGained),
      title: getRankTitle(newLevel),
    });

    // Check achievements
    if (leveledUp) {
      await achievementRepository.checkAndUnlock(userId, 'level_10', newLevel);
      await achievementRepository.checkAndUnlock(userId, 'level_50', newLevel);
      await achievementRepository.checkAndUnlock(userId, 'level_100', newLevel);
    }

    return {
      leveledUp,
      newLevel,
      xpGained,
      currentXP: remainingXP,
      xpToNextLevel: calculateXPForLevel(newLevel + 1),
      newTitle: leveledUp ? getRankTitle(newLevel) : undefined,
    };
  }

  /**
   * Update user stats
   */
  async updateStats(
    userId: string,
    stats: {
      strength?: number;
      agility?: number;
      intelligence?: number;
      vitality?: number;
      sense?: number;
    }
  ): Promise<UserProfileResponse> {
    await userRepository.updateStats(userId, stats);
    return this.getProfile(userId);
  }

  /**
   * Get user statistics
   */
  async getStats(userId: string): Promise<StatsResponse> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const quests = await questRepository.findUserQuests(userId);
    const completedQuests = quests.filter((q) => q.status === 'completed');
    const activeQuests = quests.filter((q) => q.isActive);

    // Category breakdown
    const categoryStats: any = {};
    quests.forEach((quest) => {
      if (!categoryStats[quest.category]) {
        categoryStats[quest.category] = { total: 0, completed: 0 };
      }
      categoryStats[quest.category].total++;
      if (quest.status === 'completed') {
        categoryStats[quest.category].completed++;
      }
    });

    return {
      level: user.level,
      title: user.title,
      totalXP: Number(user.totalXP),
      currentXP: user.currentXP,
      xpToNextLevel: calculateXPForLevel(user.level + 1),
      streak: user.streak,
      longestStreak: user.longestStreak,
      totalTasksCompleted: user.totalTasksCompleted,
      stats: {
        strength: user.strength,
        agility: user.agility,
        intelligence: user.intelligence,
        vitality: user.vitality,
        sense: user.sense,
      },
      quests: {
        total: quests.length,
        active: activeQuests.length,
        completed: completedQuests.length,
      },
      categoryStats,
    };
  }

  /**
   * Update streak
   */
  async updateStreak(userId: string, increment: boolean = true): Promise<StreakUpdateResponse> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const newStreak = increment ? user.streak + 1 : 0;
    const newLongestStreak = Math.max(newStreak, user.longestStreak);

    await userRepository.updateStreak(userId, newStreak, newLongestStreak);

    // Check streak achievements
    await achievementRepository.checkAndUnlock(userId, 'streak_7', newStreak);
    await achievementRepository.checkAndUnlock(userId, 'streak_30', newStreak);
    await achievementRepository.checkAndUnlock(userId, 'streak_100', newStreak);
    await achievementRepository.checkAndUnlock(userId, 'streak_365', newStreak);

    return { streak: newStreak, longestStreak: newLongestStreak };
  }
}

export const userService = new UserService();
