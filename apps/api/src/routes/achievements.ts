import { Router, type IRouter } from 'express';
import { authMiddleware, AuthRequest } from '@/middleware/authMiddleware';
import { achievementRepository } from '@/repositories/AchievementRepository';
import { achievementService } from '@/services/achievementService';

const router: IRouter = Router();

// All achievement routes require authentication
router.use(authMiddleware);

// GET /api/v1/achievements - Get all achievements
router.get('/', async (_req: AuthRequest, res) => {
  const achievements = await achievementRepository.findAll();

  return res.json({
    success: true,
    data: achievements,
  });
});

// GET /api/v1/achievements/user - Get user achievements with progress
router.get('/user', async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized' },
    });
  }

  const achievements = await achievementService.getUserAchievementsWithProgress(userId);

  return res.json({
    success: true,
    data: achievements,
  });
});

// GET /api/v1/achievements/stats - Get achievement statistics
router.get('/stats', async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized' },
    });
  }

  const stats = await achievementService.getAchievementStats(userId);

  return res.json({
    success: true,
    data: stats,
  });
});

// POST /api/v1/achievements/check - Manually check all achievements
router.post('/check', async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized' },
    });
  }

  const newlyUnlocked = await achievementService.checkAllAchievements(userId);

  return res.json({
    success: true,
    data: {
      newlyUnlocked,
      count: newlyUnlocked.length,
    },
  });
});

export default router;
