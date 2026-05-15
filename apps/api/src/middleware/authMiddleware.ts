import { Request, Response, NextFunction } from 'express';
import { authService } from '@/services/AuthService';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided');
    }

    const token = authHeader.substring(7);
    const { userId } = authService.verifyToken(token);

    req.userId = userId;
    next();
  } catch (error) {
    next(error);
  }
};
