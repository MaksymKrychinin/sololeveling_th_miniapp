import { prisma } from '@solo-leveling/database';
import { Quest, QuestTemplate } from '@prisma/client';

export class QuestRepository {
  async findUserQuests(userId: string, isActive?: boolean) {
    const where: any = { userId };
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return prisma.quest.findMany({
      where,
      include: {
        template: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Quest | null> {
    return prisma.quest.findUnique({
      where: { id },
      include: {
        template: true,
      },
    });
  }

  async create(data: {
    userId: string;
    templateId?: string;
    title: string;
    description?: string;
    category: string;
    xpReward: number;
    statBonus?: any;
    frequency: string;
    icon: string;
    difficulty: string;
  }): Promise<Quest> {
    return prisma.quest.create({
      data,
    });
  }

  async update(id: string, data: Partial<Quest>): Promise<Quest> {
    return prisma.quest.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Quest> {
    return prisma.quest.delete({
      where: { id },
    });
  }

  async toggleActive(id: string, isActive: boolean): Promise<Quest> {
    return prisma.quest.update({
      where: { id },
      data: { isActive },
    });
  }

  async completeQuest(id: string): Promise<Quest> {
    return prisma.quest.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date(),
        streak: { increment: 1 },
      },
    });
  }

  async resetDailyQuests(userId: string): Promise<void> {
    await prisma.quest.updateMany({
      where: {
        userId,
        frequency: 'daily',
        status: 'completed',
      },
      data: {
        status: 'pending',
        completedAt: null,
      },
    });
  }

  async getAllTemplates(): Promise<QuestTemplate[]> {
    return prisma.questTemplate.findMany({
      orderBy: [{ isDefault: 'desc' }, { category: 'asc' }],
    });
  }

  async getTemplateById(id: string): Promise<QuestTemplate | null> {
    return prisma.questTemplate.findUnique({
      where: { id },
    });
  }

  async getTodayCompletions(userId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.questCompletion.findMany({
      where: {
        userId,
        completedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  async createCompletion(data: {
    userId: string;
    questId: string;
    xpGained: number;
    statsGained?: any;
  }) {
    return prisma.questCompletion.create({
      data,
    });
  }
}

export const questRepository = new QuestRepository();
