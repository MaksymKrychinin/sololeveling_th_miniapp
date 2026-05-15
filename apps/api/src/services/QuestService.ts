import { questRepository } from '@/repositories/QuestRepository';
import { userRepository } from '@/repositories/UserRepository';
import { achievementRepository } from '@/repositories/AchievementRepository';
import { userService } from './UserService';
import { AppError } from '@/middleware/errorHandler';
import { isToday, isYesterday, isWithinStreakGracePeriod } from '@solo-leveling/shared';

export class QuestService {
  /**
   * Get user's quests
   */
  async getUserQuests(userId: string, isActive?: boolean) {
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
  ) {
    const quest = await questRepository.create({
      userId,
      ...data,
    });

    return quest;
  }

  /**
   * Update quest
   */
  async updateQuest(questId: string, userId: string, data: any) {
    const quest = await questRepository.findById(questId);

    if (!quest) {
      throw new AppError(404, 'Quest not found');
    }

    if (quest.userId !== userId) {
      throw new AppError(403, 'Not authorized to update this quest');
    }

    const updated = await questRepository.update(questId, data);
    return updated;
  }

  /**
   * Delete quest
   */
  async deleteQuest(questId: string, userId: string) {
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
  async completeQuest(questId: string, userId: string) {
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

    // Check quest completion achievements
    const updatedUser = await userRepository.findById(userId);
    if (updatedUser) {
      await achievementRepository.checkAndUnlock(userId, 'quests_50', updatedUser.totalTasksCompleted);
      await achievementRepository.checkAndUnlock(userId, 'quests_200', updatedUser.totalTasksCompleted);
      await achievementRepository.checkAndUnlock(userId, 'quests_500', updatedUser.totalTasksCompleted);
      await achievementRepository.checkAndUnlock(userId, 'quests_1000', updatedUser.totalTasksCompleted);
    }

    return {
      quest: completedQuest,
      xpGained: quest.xpReward,
      levelUp: xpResult.leveledUp ? {
        newLevel: xpResult.newLevel,
        newTitle: xpResult.newTitle,
      } : undefined,
      statBonus: quest.statBonus,
    };
  }

  /**
   * Get quest templates
   */
  async getTemplates() {
    return questRepository.getAllTemplates();
  }

  /**
   * Create quest from template
   */
  async createFromTemplate(userId: string, templateId: string) {
    const template = await questRepository.getTemplateById(templateId);

    if (!template) {
      throw new AppError(404, 'Template not found');
    }

    const quest = await questRepository.create({
      userId,
      templateId: template.id,
      title: template.title,
      description: template.description,
      category: template.category,
      xpReward: template.xpReward,
      statBonus: template.statBonus,
      frequency: template.frequency,
      icon: template.icon,
      difficulty: template.difficulty,
    });

    return quest;
  }

  /**
   * Toggle quest activation
   */
  async toggleQuest(questId: string, userId: string, isActive: boolean) {
    const quest = await questRepository.findById(questId);

    if (!quest) {
      throw new AppError(404, 'Quest not found');
    }

    if (quest.userId !== userId) {
      throw new AppError(403, 'Not authorized to toggle this quest');
    }

    const updated = await questRepository.toggleActive(questId, isActive);
    return updated;
  }
}

export const questService = new QuestService();
