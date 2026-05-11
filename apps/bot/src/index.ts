import 'dotenv/config';
import { Bot, Context, session } from 'grammy';
import cron from 'node-cron';
import { logger } from './utils/logger';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || '');

// Session middleware
bot.use(session({ initial: () => ({}) }));

// Commands
bot.command('start', async (ctx: Context) => {
  await ctx.reply(
    '🎮 Welcome to Solo Leveling!\n\n' +
    'Transform your daily habits into an epic RPG adventure!\n\n' +
    'Commands:\n' +
    '/start - Start the bot\n' +
    '/help - Show help\n' +
    '/stats - View your stats\n' +
    '/quests - View your daily quests\n\n' +
    'Open the Mini App to start your journey! ⚔️',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Open App', web_app: { url: process.env.WEB_APP_URL || '' } }],
        ],
      },
    }
  );
});

bot.command('help', async (ctx: Context) => {
  await ctx.reply(
    '📚 Solo Leveling Bot Help\n\n' +
    'Available Commands:\n' +
    '/start - Welcome message\n' +
    '/help - This help message\n' +
    '/stats - View your current stats and level\n' +
    '/quests - View today\'s quests\n\n' +
    'Use the Mini App for the full experience!'
  );
});

bot.command('stats', async (ctx: Context) => {
  // TODO: Fetch user stats from database
  await ctx.reply('⚡ Your Stats:\n\nLevel: 1\nXP: 0/100\nRank: E-Rank Hunter\n\n(Coming soon!)');
});

bot.command('quests', async (ctx: Context) => {
  // TODO: Fetch user quests from database
  await ctx.reply('⚔️ Today\'s Quests:\n\n(Coming soon!)');
});

// Cron jobs for reminders
// Every day at 9:00 AM
cron.schedule('0 9 * * *', () => {
  logger.info('Running daily reminder job');
  // TODO: Send reminder to users with active quests
});

// Every day at 8:00 PM
cron.schedule('0 20 * * *', () => {
  logger.info('Running evening reminder job');
  // TODO: Send reminder about incomplete quests
});

// Error handling
bot.catch((err) => {
  logger.error('Bot error:', err);
});

// Start bot
bot.start({
  onStart: () => {
    logger.info('🤖 Bot is running');
  },
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());
