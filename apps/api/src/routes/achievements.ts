import { Router, type IRouter } from 'express';
import { authMiddleware, AuthRequest } from '@/middleware/authMiddleware';
import { achievementRepository } from '@/repositories/AchievementRepository';

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

// GET /api/v1/achievements/user - Get user achievements
router.get('/user', async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized' },
    });
  }

  const userAchievements = await achievementRepository.findUserAchievements(userId);

  return res.json({
    success: true,
    data: userAchievements,
  });
});

export default router;
