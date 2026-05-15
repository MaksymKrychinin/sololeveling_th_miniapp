import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { userRepository } from '@/repositories/UserRepository';
import { AppError } from '@/middleware/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Define explicit return types
type AuthResponse = {
  token: string;
  user: {
    id: string;
    telegramId: number;
    username: string;
    firstName: string | null;
    lastName: string | null;
    level: number;
    currentXP: number;
    title: string;
    avatar: string | null;
    stats: {
      strength: number;
      agility: number;
      intelligence: number;
      vitality: number;
      sense: number;
    };
    streak: number;
    totalTasksCompleted: number;
  };
};

type TokenPayload = {
  userId: string;
};

type TokenRefreshResponse = {
  token: string;
};

export class AuthService {
  /**
   * Validate Telegram initData
   */
  validateTelegramInitData(initData: string, botToken: string): boolean {
    try {
      const urlParams = new URLSearchParams(initData);
      const hash = urlParams.get('hash');

      if (!hash) return false;

      urlParams.delete('hash');

      const dataCheckString = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

      const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();

      const calculatedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

      return calculatedHash === hash;
    } catch (error) {
      return false;
    }
  }

  /**
   * Parse Telegram initData
   */
  parseTelegramInitData(initData: string): any {
    const urlParams = new URLSearchParams(initData);
    const userParam = urlParams.get('user');

    if (!userParam) {
      throw new AppError(400, 'Invalid initData: missing user');
    }

    try {
      return JSON.parse(userParam);
    } catch (error) {
      throw new AppError(400, 'Invalid initData: malformed user data');
    }
  }

  /**
   * Authenticate user with Telegram
   */
  async authenticateWithTelegram(initData: string): Promise<AuthResponse> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      throw new AppError(500, 'Bot token not configured');
    }

    // Validate initData
    const isValid = this.validateTelegramInitData(initData, botToken);
    if (!isValid) {
      throw new AppError(401, 'Invalid Telegram authentication');
    }

    // Parse user data
    const telegramUser = this.parseTelegramInitData(initData);

    // Find or create user
    let user = await userRepository.findByTelegramId(telegramUser.id);

    if (!user) {
      user = await userRepository.create({
        telegramId: telegramUser.id,
        username: telegramUser.username || `user_${telegramUser.id}`,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        avatar: telegramUser.photo_url,
      });
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        telegramId: Number(user.telegramId),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        level: user.level,
        currentXP: user.currentXP,
        title: user.title,
        avatar: user.avatar,
        stats: {
          strength: user.strength,
          agility: user.agility,
          intelligence: user.intelligence,
          vitality: user.vitality,
          sense: user.sense,
        },
        streak: user.streak,
        totalTasksCompleted: user.totalTasksCompleted,
      },
    };
  }

  /**
   * Authenticate with dev credentials (development only)
   */
  async authenticateWithDevCredentials(username: string, password: string): Promise<AuthResponse> {
    // Simple dev credentials check
    const validCredentials = {
      'dev': 'dev123',
      'hunter': 'hunter123',
      'test': 'test123',
    };

    if (validCredentials[username as keyof typeof validCredentials] !== password) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Create a fake telegram ID based on username
    const fakeTelegramId = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 1000000);

    // Find or create user
    let user = await userRepository.findByTelegramId(fakeTelegramId);

    if (!user) {
      user = await userRepository.create({
        telegramId: fakeTelegramId,
        username: username,
        firstName: username.charAt(0).toUpperCase() + username.slice(1),
        lastName: 'User',
        avatar: undefined,
      });
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        telegramId: Number(user.telegramId),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        level: user.level,
        currentXP: user.currentXP,
        title: user.title,
        avatar: user.avatar,
        stats: {
          strength: user.strength,
          agility: user.agility,
          intelligence: user.intelligence,
          vitality: user.vitality,
          sense: user.sense,
        },
        streak: user.streak,
        totalTasksCompleted: user.totalTasksCompleted,
      },
    };
  }

  /**
   * Generate JWT token
   */
  generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new AppError(401, 'Invalid or expired token');
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(oldToken: string): Promise<TokenRefreshResponse> {
    const { userId } = this.verifyToken(oldToken);
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const newToken = this.generateToken(userId);
    return { token: newToken };
  }
}

export const authService = new AuthService();
