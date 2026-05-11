import { Router } from 'express';
import { authService } from '../services/AuthService';

const router = Router();

// POST /api/v1/auth/telegram - Authenticate with Telegram
router.post('/telegram', async (req, res) => {
  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({
      success: false,
      error: { message: 'initData is required' },
    });
  }

  const result = await authService.authenticateWithTelegram(initData);

  res.json({
    success: true,
    data: result,
  });
});

// POST /api/v1/auth/refresh - Refresh JWT token
router.post('/refresh', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: { message: 'token is required' },
    });
  }

  const result = await authService.refreshToken(token);

  res.json({
    success: true,
    data: result,
  });
});

// POST /api/v1/auth/logout - Logout user
router.post('/logout', async (req, res) => {
  // For JWT, logout is handled client-side by removing the token
  // Here we just return success
  res.json({
    success: true,
    data: { message: 'Logged out successfully' },
  });
});

export default router;
