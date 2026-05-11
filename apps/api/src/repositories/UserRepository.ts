import { prisma } from '@solo-leveling/database';
import { User } from '@prisma/client';

export class UserRepository {
  async findByTelegramId(telegramId: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: {
    telegramId: number;
    username: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        telegramId: BigInt(data.telegramId),
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
        level: 1,
        currentXP: 0,
        totalXP: BigInt(0),
        title: 'E-Rank Hunter',
        timezone: 'UTC',
      },
    });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateStats(
    id: string,
    stats: {
      strength?: number;
      agility?: number;
      intelligence?: number;
      vitality?: number;
      sense?: number;
    }
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: stats,
    });
  }

  async updateXP(id: string, xpGained: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new Error('User not found');

    const newCurrentXP = user.currentXP + xpGained;
    const newTotalXP = BigInt(user.totalXP) + BigInt(xpGained);

    return prisma.user.update({
      where: { id },
      data: {
        currentXP: newCurrentXP,
        totalXP: newTotalXP,
      },
    });
  }

  async updateStreak(id: string, streak: number, longestStreak?: number): Promise<User> {
    const data: any = { streak };
    if (longestStreak !== undefined) {
      data.longestStreak = longestStreak;
    }
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async getLeaderboard(limit: number = 50, type: 'level' | 'xp' | 'streak' = 'level') {
    const orderBy: any = {};
    if (type === 'level') {
      orderBy.level = 'desc';
    } else if (type === 'xp') {
      orderBy.totalXP = 'desc';
    } else if (type === 'streak') {
      orderBy.streak = 'desc';
    }

    return prisma.user.findMany({
      take: limit,
      orderBy,
      select: {
        id: true,
        username: true,
        avatar: true,
        level: true,
        title: true,
        totalXP: true,
        streak: true,
        totalTasksCompleted: true,
      },
    });
  }
}

export const userRepository = new UserRepository();
