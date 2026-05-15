import { prisma } from '@solo-leveling/database';
import type { Achievement, UserAchievement, User } from '@solo-leveling/database';
import { achievementRepository } from '../repositories/AchievementRepository';

type AchievementRequirement = {
  type: 'streak' | 'total_quests' | 'level' | 'stat' | 'specific_quest' | 'category_quests';
  value: number;
  metadata?: {
    stat?: string;
    category?: string;
    questId?: string;
  };
};

type AchievementReward = {
  xp?: number;
  title?: string;
  badge?: string;
};

type UserWithAchievement = UserAchievement & { achievement: Achievement };

export class AchievementService {
  /**
   * Check all achievements for a user and unlock any that are now completed
   */
  async checkAllAchievements(userId: string): Promise<UserWithAchievement[]> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return [];

    const allAchievements = await achievementRepository.findAll();
    const newlyUnlocked: UserWithAchievement[] = [];

    for (const achievement of allAchievements) {
      const requirement = achievement.requirement as AchievementRequirement;
      const currentValue = await this.getCurrentValue(user, requirement);

      const result = await achievementRepository.checkAndUnlock(
        userId,
        achievement.id,
        currentValue
      );

      // Check if it was just unlocked
      if (result && result.isCompleted) {
        const existing = await achievementRepository.getUserAchievement(userId, achievement.id);
        if (existing && !existing.isCompleted) {
          newlyUnlocked.push(result);

          // Apply rewards
          await this.applyRewards(userId, achievement);
        }
      }
    }

    return newlyUnlocked;
  }

  /**
   * Check specific achievement types after certain actions
   */
  async checkAchievementsByType(
    userId: string,
    type: AchievementRequirement['type']
  ): Promise<UserWithAchievement[]> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return [];

    const achievements = await prisma.achievement.findMany();
    const relevantAchievements = achievements.filter(a => {
      const req = a.requirement as AchievementRequirement;
      return req.type === type;
    });

    const newlyUnlocked: UserWithAchievement[] = [];

    for (const achievement of relevantAchievements) {
      const requirement = achievement.requirement as AchievementRequirement;
      const currentValue = await this.getCurrentValue(user, requirement);

      const result = await achievementRepository.checkAndUnlock(
        userId,
        achievement.id,
        currentValue
      );

      if (result && result.isCompleted) {
        const wasAlreadyCompleted = await this.wasAlreadyCompleted(userId, achievement.id);
        if (!wasAlreadyCompleted) {
          newlyUnlocked.push(result);
          await this.applyRewards(userId, achievement);
        }
      }
    }

    return newlyUnlocked;
  }

  /**
   * Get current value for achievement requirement
   */
  private async getCurrentValue(user: User, requirement: AchievementRequirement): Promise<number> {
    switch (requirement.type) {
      case 'streak':
        return user.streak;

      case 'total_quests':
        return user.totalTasksCompleted;

      case 'level':
        return user.level;

      case 'stat':
        if (requirement.metadata?.stat) {
          const stat = requirement.metadata.stat as keyof Pick<User, 'strength' | 'agility' | 'intelligence' | 'vitality' | 'sense'>;
          return user[stat];
        }
        return 0;

      case 'specific_quest': {
        if (requirement.metadata?.questId) {
          const completions = await prisma.questCompletion.count({
            where: {
              userId: user.id,
              questId: requirement.metadata.questId,
            },
          });
          return completions;
        }
        return 0;
      }

      case 'category_quests': {
        if (requirement.metadata?.category) {
          const quests = await prisma.quest.findMany({
            where: {
              userId: user.id,
              category: requirement.metadata.category,
            },
            include: {
              completions: true,
            },
          });
          return quests.reduce((sum, quest) => sum + quest.completions.length, 0);
        }
        return 0;
      }

      default:
        return 0;
    }
  }

  /**
   * Check if achievement was already completed before this check
   */
  private async wasAlreadyCompleted(userId: string, achievementId: string): Promise<boolean> {
    const userAchievement = await achievementRepository.getUserAchievement(userId, achievementId);
    return userAchievement?.isCompleted ?? false;
  }

  /**
   * Apply rewards when achievement is unlocked
   */
  private async applyRewards(userId: string, achievement: Achievement): Promise<void> {
    const reward = achievement.reward as AchievementReward | null;
    if (!reward) return;

    const updateData: any = {};

    if (reward.xp) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        updateData.currentXP = user.currentXP + reward.xp;
        updateData.totalXP = BigInt(user.totalXP) + BigInt(reward.xp);
      }
    }

    if (reward.title) {
      updateData.title = reward.title;
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'ACHIEVEMENT_UNLOCKED',
        title: '🏆 Achievement Unlocked!',
        message: `You've earned: ${achievement.title}`,
        data: {
          achievementId: achievement.id,
          reward,
        },
      },
    });
  }

  /**
   * Get user achievements with progress
   */
  async getUserAchievementsWithProgress(userId: string): Promise<{
    achievement: Achievement;
    progress: number;
    isCompleted: boolean;
    unlockedAt?: Date;
  }[]> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return [];

    const allAchievements = await achievementRepository.findAll();
    const userAchievements = await achievementRepository.findUserAchievements(userId);

    const achievementsMap = new Map(
      userAchievements.map(ua => [ua.achievementId, ua])
    );

    return await Promise.all(
      allAchievements.map(async achievement => {
        const userAchievement = achievementsMap.get(achievement.id);
        const requirement = achievement.requirement as AchievementRequirement;
        const currentValue = await this.getCurrentValue(user, requirement);
        const progress = Math.min((currentValue / requirement.value) * 100, 100);

        return {
          achievement,
          progress: userAchievement?.progress ?? progress,
          isCompleted: userAchievement?.isCompleted ?? false,
          unlockedAt: userAchievement?.unlockedAt,
        };
      })
    );
  }

  /**
   * Get achievement statistics
   */
  async getAchievementStats(userId: string): Promise<{
    total: number;
    unlocked: number;
    progress: number;
    byRarity: Record<string, { total: number; unlocked: number }>;
  }> {
    const allAchievements = await achievementRepository.findAll();
    const userAchievements = await achievementRepository.findUserAchievements(userId);

    const unlockedCount = userAchievements.filter(ua => ua.isCompleted).length;
    const totalCount = allAchievements.length;
    const progressPercent = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

    const byRarity: Record<string, { total: number; unlocked: number }> = {};

    for (const achievement of allAchievements) {
      const rarity = achievement.rarity;
      if (!byRarity[rarity]) {
        byRarity[rarity] = { total: 0, unlocked: 0 };
      }
      byRarity[rarity]!.total++;
    }

    for (const userAchievement of userAchievements) {
      if (userAchievement.isCompleted) {
        const rarity = userAchievement.achievement.rarity;
        if (byRarity[rarity]) {
          byRarity[rarity]!.unlocked++;
        }
      }
    }

    return {
      total: totalCount,
      unlocked: unlockedCount,
      progress: progressPercent,
      byRarity,
    };
  }
}

export const achievementService = new AchievementService();
