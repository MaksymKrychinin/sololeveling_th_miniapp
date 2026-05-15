import { Router, type IRouter } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { userService } from '../services/UserService';

const router: IRouter = Router();

// All user routes require authentication
router.use(authMiddleware);

// GET /api/v1/users/profile - Get user profile
router.get('/profile', async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized' },
    });
  }

  const profile = await userService.getProfile(userId);

  return res.json({
    success: true,
    data: profile,
  });
});

// PATCH /api/v1/users/profile - Update user profile
router.patch('/profile', async (req: AuthRequest, res) => {
  const { avatar, timezone } = req.body;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized' },
    });
  }

  const profile = await userService.updateProfile(userId, {
    avatar,
    timezone,
  });

  return res.json({
    success: true,
    data: profile,
  });
});

// GET /api/v1/users/stats - Get user statistics
router.get('/stats', async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized' },
    });
  }

  const stats = await userService.getStats(userId);

  return res.json({
    success: true,
    data: stats,
  });
});

export default router;
