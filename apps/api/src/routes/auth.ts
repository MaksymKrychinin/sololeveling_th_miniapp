import { Router, type IRouter } from 'express';
import { authService } from '@/services/AuthService';

const router: IRouter = Router();

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

  return res.json({
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

  return res.json({
    success: true,
    data: result,
  });
});

// POST /api/v1/auth/dev-login - Dev login (only in development)
router.post('/dev-login', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      error: { message: 'Dev login is only available in development' },
    });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: { message: 'username and password are required' },
    });
  }

  const result = await authService.authenticateWithDevCredentials(username, password);

  return res.json({
    success: true,
    data: result,
  });
});

// POST /api/v1/auth/logout - Logout user
router.post('/logout', async (_req, res) => {
  // For JWT, logout is handled client-side by removing the token
  // Here we just return success
  return res.json({
    success: true,
    data: { message: 'Logged out successfully' },
  });
});

export default router;
