import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding dev users...');

  const devUsers = [
    {
      username: 'dev',
      password: 'dev123',
      telegramId: 100000001,
      firstName: 'Dev',
      lastName: 'Hunter',
    },
    {
      username: 'hunter',
      password: 'hunter123',
      telegramId: 100000002,
      firstName: 'Shadow',
      lastName: 'Monarch',
    },
    {
      username: 'test',
      password: 'test123',
      telegramId: 100000003,
      firstName: 'Test',
      lastName: 'Hunter',
    },
  ];

  for (const devUser of devUsers) {
    const hashedPassword = await bcrypt.hash(devUser.password, 10);
    
    const user = await prisma.user.upsert({
      where: { telegramId: devUser.telegramId },
      update: {
        username: devUser.username,
        passwordHash: hashedPassword,
      },
      create: {
        telegramId: devUser.telegramId,
        username: devUser.username,
        firstName: devUser.firstName,
        lastName: devUser.lastName,
        passwordHash: hashedPassword,
        level: 1,
        currentXP: 0,
        totalXP: 0,
        title: 'E-Rank Hunter',
        streak: 0,
        longestStreak: 0,
        totalTasksCompleted: 0,
        strength: 1,
        agility: 1,
        intelligence: 1,
        vitality: 1,
        sense: 1,
      },
    });

    console.log(`✅ Created/Updated user: ${user.username} (ID: ${user.id})`);
  }

  console.log('✅ Dev users seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding dev users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
