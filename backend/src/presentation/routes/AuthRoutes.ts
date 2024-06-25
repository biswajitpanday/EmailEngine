import { Router, Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/di/container';
import { TYPES } from '../../infrastructure/di/types';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

// Define the type for async handlers
type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

// Wrapper to handle async routes
const asyncHandler =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.get(
  '/outlook',
  asyncHandler((req: Request, res: Response) =>
    authController.redirectToOutlook(req, res),
  ),
);

router.get(
  '/outlook/callback',
  asyncHandler((req: Request, res: Response) =>
    authController.handleOutlookCallback(req, res),
  ),
);

export default router;
