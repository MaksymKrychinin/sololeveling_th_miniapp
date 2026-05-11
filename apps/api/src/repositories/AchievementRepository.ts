import { prisma } from '@solo-leveling/database';
import { Achievement } from '@prisma/client';

export class AchievementRepository {
  async findAll(): Promise<Achievement[]> {
    return prisma.achievement.findMany({
      orderBy: { rarity: 'asc' },
    });
  }

  async findById(id: string): Promise<Achievement | null> {
    return prisma.achievement.findUnique({
      where: { id },
    });
  }

  async findUserAchievements(userId: string) {
    return prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: { unlockedAt: 'desc' },
    });
  }

  async getUserAchievement(userId: string, achievementId: string) {
    return prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
      include: {
        achievement: true,
      },
    });
  }

  async createUserAchievement(data: {
    userId: string;
    achievementId: string;
    progress: number;
    isCompleted: boolean;
  }) {
    return prisma.userAchievement.create({
      data,
      include: {
        achievement: true,
      },
    });
  }

  async updateUserAchievement(userId: string, achievementId: string, progress: number, isCompleted: boolean) {
    return prisma.userAchievement.update({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
      data: {
        progress,
        isCompleted,
        unlockedAt: isCompleted ? new Date() : undefined,
      },
      include: {
        achievement: true,
      },
    });
  }

  async checkAndUnlock(userId: string, achievementId: string, currentValue: number) {
    const achievement = await this.findById(achievementId);
    if (!achievement) return null;

    const requirement = achievement.requirement as any;
    const isCompleted = currentValue >= requirement.value;
    const progress = Math.min((currentValue / requirement.value) * 100, 100);

    const existing = await this.getUserAchievement(userId, achievementId);

    if (existing) {
      if (!existing.isCompleted && isCompleted) {
        return this.updateUserAchievement(userId, achievementId, progress, true);
      }
      return this.updateUserAchievement(userId, achievementId, progress, isCompleted);
    } else {
      return this.createUserAchievement({
        userId,
        achievementId,
        progress,
        isCompleted,
      });
    }
  }
}

export const achievementRepository = new AchievementRepository();
