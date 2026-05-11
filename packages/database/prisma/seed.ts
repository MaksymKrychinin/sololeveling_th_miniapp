import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.questCompletion.deleteMany();
  await prisma.userAchievement.deleteMany();
  await prisma.quest.deleteMany();
  await prisma.questTemplate.deleteMany();
  await prisma.achievement.deleteMany();

  // Quest templates
  console.log('📋 Creating quest templates...');
  const questTemplates = [
    { title: 'Morning Shower', description: 'Take a refreshing morning shower', category: 'hygiene', xpReward: 10, statBonus: { stat: 'vitality', amount: 1 }, frequency: 'daily', icon: '🚿', difficulty: 'easy', isDefault: true },
    { title: 'Brush Teeth', description: 'Brush your teeth', category: 'hygiene', xpReward: 5, statBonus: { stat: 'vitality', amount: 1 }, frequency: 'daily', icon: '🪥', difficulty: 'easy', isDefault: true },
    { title: 'Drink Water', description: 'Drink 8 glasses of water', category: 'health', xpReward: 15, statBonus: { stat: 'vitality', amount: 2 }, frequency: 'daily', icon: '💧', difficulty: 'medium', isDefault: true },
    { title: 'Healthy Breakfast', description: 'Eat a nutritious breakfast', category: 'health', xpReward: 10, statBonus: { stat: 'vitality', amount: 1 }, frequency: 'daily', icon: '🥗', difficulty: 'easy', isDefault: true },
    { title: 'Morning Run', description: 'Go for a 30-minute run', category: 'fitness', xpReward: 20, statBonus: { stat: 'agility', amount: 2 }, frequency: 'daily', icon: '🏃', difficulty: 'medium', isDefault: true },
    { title: 'Gym Workout', description: 'Complete a gym workout', category: 'fitness', xpReward: 25, statBonus: { stat: 'strength', amount: 2 }, frequency: 'daily', icon: '💪', difficulty: 'hard', isDefault: true },
    { title: 'Read 30 Minutes', description: 'Read a book', category: 'learning', xpReward: 20, statBonus: { stat: 'intelligence', amount: 2 }, frequency: 'daily', icon: '📚', difficulty: 'medium', isDefault: true },
    { title: 'Learn New Words', description: 'Expand vocabulary', category: 'learning', xpReward: 15, statBonus: { stat: 'intelligence', amount: 2 }, frequency: 'daily', icon: '📖', difficulty: 'medium', isDefault: true },
    { title: 'Meditation', description: 'Meditate for 15 minutes', category: 'mindfulness', xpReward: 15, statBonus: { stat: 'sense', amount: 2 }, frequency: 'daily', icon: '🧘', difficulty: 'medium', isDefault: true },
    { title: 'Journaling', description: 'Write in journal', category: 'mindfulness', xpReward: 10, statBonus: { stat: 'sense', amount: 1 }, frequency: 'daily', icon: '📝', difficulty: 'easy', isDefault: true },
    { title: 'Complete Main Task', description: 'Complete important task', category: 'productivity', xpReward: 25, statBonus: null, frequency: 'daily', icon: '⚡', difficulty: 'hard', isDefault: true },
    { title: 'Plan Tomorrow', description: 'Plan tasks for tomorrow', category: 'productivity', xpReward: 10, statBonus: { stat: 'intelligence', amount: 1 }, frequency: 'daily', icon: '📅', difficulty: 'easy', isDefault: true },
  ];

  for (const template of questTemplates) {
    await prisma.questTemplate.create({ data: template });
  }
  console.log(`✅ Created ${questTemplates.length} quest templates`);

  // Achievements
  console.log('🏆 Creating achievements...');
  const achievements = [
    { title: 'First Step', description: 'Complete your first quest', icon: '👣', rarity: 'common', requirement: { type: 'total_quests', value: 1 } },
    { title: 'Getting Started', description: 'Reach level 10', icon: '🎯', rarity: 'common', requirement: { type: 'level', value: 10 } },
    { title: '7 Day Warrior', description: 'Maintain 7-day streak', icon: '🔥', rarity: 'rare', requirement: { type: 'streak', value: 7 } },
    { title: 'Quest Master', description: 'Complete 50 quests', icon: '⭐', rarity: 'rare', requirement: { type: 'total_quests', value: 50 } },
    { title: 'Month Champion', description: 'Maintain 30-day streak', icon: '💎', rarity: 'epic', requirement: { type: 'streak', value: 30 } },
    { title: 'Centurion', description: 'Complete 100 quests', icon: '💯', rarity: 'epic', requirement: { type: 'total_quests', value: 100 } },
    { title: 'S-Rank Hunter', description: 'Reach level 100', icon: '👑', rarity: 'legendary', requirement: { type: 'level', value: 100 } },
    { title: 'Shadow Monarch', description: 'Reach level 200', icon: '🌑', rarity: 'legendary', requirement: { type: 'level', value: 200 } },
    { title: 'Eternal Flame', description: 'Maintain 100-day streak', icon: '🔥', rarity: 'legendary', requirement: { type: 'streak', value: 100 } },
    { title: 'Legend', description: 'Complete 500 quests', icon: '🏆', rarity: 'legendary', requirement: { type: 'total_quests', value: 500 } },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.create({ data: achievement });
  }
  console.log(`✅ Created ${achievements.length} achievements`);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
