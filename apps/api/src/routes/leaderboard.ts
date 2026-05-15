import { Router } from 'express';
import { authMiddleware, AuthRequest } from '@/middleware/authMiddleware';
import { userRepository } from '@/repositories/UserRepository';

const router = Router();

// All leaderboard routes require authentication
router.use(authMiddleware);

// GET /api/v1/leaderboard - Get leaderboard
router.get('/', async (req: AuthRequest, res) => {
  const { type = 'level', limit = '50' } = req.query;

  const leaderboardType = type as 'level' | 'xp' | 'streak';
  const limitNum = parseInt(limit as string, 10);

  const leaderboard = await userRepository.getLeaderboard(limitNum, leaderboardType);

  // Convert BigInt to Number for JSON serialization
  const serializedLeaderboard = leaderboard.map((user) => ({
    ...user,
    totalXP: Number(user.totalXP),
  }));

  // Find current user's position
  const currentUserId = req.userId!;
  const currentUserPosition = serializedLeaderboard.findIndex((u) => u.id === currentUserId);

  res.json({
    success: true,
    data: {
      type: leaderboardType,
      leaderboard: serializedLeaderboard,
      currentUserPosition: currentUserPosition !== -1 ? currentUserPosition + 1 : null,
    },
  });
});

export default router;
