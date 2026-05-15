import { questRepository } from '@/repositories/QuestRepository';
import { userRepository } from '@/repositories/UserRepository';
import { userService } from './UserService';
import { achievementService } from './achievementService';
import { AppError } from '@/middleware/errorHandler';
import { isToday, isYesterday, isWithinStreakGracePeriod } from '@solo-leveling/shared';
import type { Prisma } from '@solo-leveling/database';

// Define explicit return types to avoid Prisma type inference issues
type QuestResponse = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  xpReward: number;
  statBonus: Prisma.JsonValue;
  frequency: string;
  status: string;
  completedAt: Date | null;
  streak: number;
  icon: string;
  difficulty: string;
  isActive: boolean;
  template: any;
};

type QuestCompleteResponse = {
  quest: any;
  xpGained: number;
  levelUp?: {
    newLevel: number;
    newTitle: string;
  };
  statBonus: Prisma.JsonValue;
  achievementsUnlocked?: any[];
};

type DeleteQuestResponse = {
  message: string;
};

export class QuestService {
  /**
   * Get user's quests
   */
  async getUserQuests(userId: string, isActive?: boolean): Promise<QuestResponse[]> {
    const quests = await questRepository.findUserQuests(userId, isActive);

    return quests.map((quest) => ({
      id: quest.id,
      title: quest.title,
      description: quest.description,
      category: quest.category,
      xpReward: quest.xpReward,
      statBonus: quest.statBonus,
      frequency: quest.frequency,
      status: quest.status,
      completedAt: quest.completedAt,
      streak: quest.streak,
      icon: quest.icon,
      difficulty: quest.difficulty,
      isActive: quest.isActive,
      template: quest.template,
    }));
  }

  /**
   * Create custom quest
   */
  async createQuest(
    userId: string,
    data: {
      title: string;
      description?: string;
      category: string;
      xpReward: number;
      statBonus?: any;
      frequency: string;
      icon: string;
      difficulty: string;
      templateId?: string;
    }
  ): Promise<any> {
    return await questRepository.create({
      userId,
      ...data,
    });
  }

  /**
   * Update quest
   */
  async updateQuest(questId: string, userId: string, data: any): Promise<any> {
    const quest = await questRepository.findById(questId);

    if (!quest) {
      throw new AppError(404, 'Quest not found');
    }

    if (quest.userId !== userId) {
      throw new AppError(403, 'Not authorized to update this quest');
    }

    return await questRepository.update(questId, data);
  }

  /**
   * Delete quest
   */
  async deleteQuest(questId: string, userId: string): Promise<DeleteQuestResponse> {
    const quest = await questRepository.findById(questId);

    if (!quest) {
      throw new AppError(404, 'Quest not found');
    }

    if (quest.userId !== userId) {
      throw new AppError(403, 'Not authorized to delete this quest');
    }

    await questRepository.delete(questId);
    return { message: 'Quest deleted successfully' };
  }

  /**
   * Complete quest
   */
  async completeQuest(questId: string, userId: string): Promise<QuestCompleteResponse> {
    const quest = await questRepository.findById(questId);

    if (!quest) {
      throw new AppError(404, 'Quest not found');
    }

    if (quest.userId !== userId) {
      throw new AppError(403, 'Not authorized to complete this quest');
    }

    if (quest.status === 'completed' && isToday(quest.completedAt!)) {
      throw new AppError(400, 'Quest already completed today');
    }

    // Complete the quest
    const completedQuest = await questRepository.completeQuest(questId);

    // Create completion record
    await questRepository.createCompletion({
      userId,
      questId,
      xpGained: quest.xpReward,
      statsGained: quest.statBonus,
    });

    // Add XP to user
    const xpResult = await userService.addXP(userId, quest.xpReward);

    // Update stats if quest has stat bonus
    if (quest.statBonus) {
      const statBonus = quest.statBonus as any;
      const user = await userRepository.findById(userId);
      if (user) {
        const newStats: any = {};
        newStats[statBonus.stat] = (user as any)[statBonus.stat] + statBonus.amount;
        await userRepository.updateStats(userId, newStats);
      }
    }

    // Update streak
    const user = await userRepository.findById(userId);
    if (user) {
      const lastStreakDate = user.lastStreakAt;
      let shouldIncrementStreak = false;

      if (!lastStreakDate) {
        shouldIncrementStreak = true;
      } else if (isYesterday(lastStreakDate)) {
        shouldIncrementStreak = true;
      } else if (isWithinStreakGracePeriod(lastStreakDate)) {
        shouldIncrementStreak = true;
      } else if (!isToday(lastStreakDate)) {
        // Streak broken
        await userService.updateStreak(userId, false);
      }

      if (shouldIncrementStreak) {
        await userService.updateStreak(userId, true);
        await userRepository.update(userId, { lastStreakAt: new Date() });
      }
    }

    // Increment total tasks completed
    await userRepository.update(userId, {
      totalTasksCompleted: { increment: 1 },
    });

    // Check achievements after quest completion
    const achievementsUnlocked: any[] = [];
    
    // Check quest-related achievements (total quests)
    const questAchievements = await achievementService.checkAchievementsByType(userId, 'total_quests');
    achievementsUnlocked.push(...questAchievements);
    
    // Check level achievements (in case XP gain caused level up)
    const levelAchievements = await achievementService.checkAchievementsByType(userId, 'level');
    achievementsUnlocked.push(...levelAchievements);
    
    // Check stat achievements (if quest gave stat bonus)
    if (quest.statBonus) {
      const statAchievements = await achievementService.checkAchievementsByType(userId, 'stat');
      achievementsUnlocked.push(...statAchievements);
    }
    
    // Check streak achievements (if streak was updated)
    const updatedUser = await userRepository.findById(userId);
    if (updatedUser && updatedUser.streak > (user?.streak ?? 0)) {
      const streakAchievements = await achievementService.checkAchievementsByType(userId, 'streak');
      achievementsUnlocked.push(...streakAchievements);
    }

    return {
      quest: completedQuest,
      xpGained: quest.xpReward,
      levelUp: xpResult.leveledUp && xpResult.newTitle ? {
        newLevel: xpResult.newLevel,
        newTitle: xpResult.newTitle,
      } : undefined,
      statBonus: quest.statBonus,
      achievementsUnlocked: achievementsUnlocked.length > 0 ? achievementsUnlocked : undefined,
    };
  }

  /**
   * Get quest templates
   */
  async getTemplates(): Promise<any[]> {
    return questRepository.getAllTemplates();
  }

  /**
   * Create quest from template
   */
  async createFromTemplate(userId: string, templateId: string): Promise<any> {
    const template = await questRepository.getTemplateById(templateId);

    if (!template) {
      throw new AppError(404, 'Template not found');
    }

    return await questRepository.create({
      userId,
      templateId: template.id,
      title: template.title,
      description: template.description ?? undefined,
      category: template.category,
      xpReward: template.xpReward,
      statBonus: template.statBonus,
      frequency: template.frequency,
      icon: template.icon,
      difficulty: template.difficulty,
    });
  }

  /**
   * Toggle quest activation
   */
  async toggleQuest(questId: string, userId: string, isActive: boolean): Promise<any> {
    const quest = await questRepository.findById(questId);

    if (!quest) {
      throw new AppError(404, 'Quest not found');
    }

    if (quest.userId !== userId) {
      throw new AppError(403, 'Not authorized to toggle this quest');
    }

    return await questRepository.toggleActive(questId, isActive);
  }
}

export const questService = new QuestService();
