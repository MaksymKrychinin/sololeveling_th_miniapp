import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { achievementRepository } from '../repositories/AchievementRepository';

const router = Router();

// All achievement routes require authentication
router.use(authMiddleware);

// GET /api/v1/achievements - Get all achievements
router.get('/', async (req: AuthRequest, res) => {
  const achievements = await achievementRepository.findAll();

  res.json({
    success: true,
    data: achievements,
  });
});

// GET /api/v1/achievements/user - Get user achievements
router.get('/user', async (req: AuthRequest, res) => {
  const userAchievements = await achievementRepository.findUserAchievements(req.userId!);

  res.json({
    success: true,
    data: userAchievements,
  });
});

export default router;
