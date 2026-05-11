import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { userService } from '../services/UserService';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// GET /api/v1/users/profile - Get user profile
router.get('/profile', async (req: AuthRequest, res) => {
  const profile = await userService.getProfile(req.userId!);

  res.json({
    success: true,
    data: profile,
  });
});

// PATCH /api/v1/users/profile - Update user profile
router.patch('/profile', async (req: AuthRequest, res) => {
  const { avatar, timezone } = req.body;

  const profile = await userService.updateProfile(req.userId!, {
    avatar,
    timezone,
  });

  res.json({
    success: true,
    data: profile,
  });
});

// GET /api/v1/users/stats - Get user statistics
router.get('/stats', async (req: AuthRequest, res) => {
  const stats = await userService.getStats(req.userId!);

  res.json({
    success: true,
    data: stats,
  });
});

export default router;
