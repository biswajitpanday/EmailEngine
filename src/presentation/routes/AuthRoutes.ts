import { Router, Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/di/container';
import { TYPES } from '../../infrastructure/di/types';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = container.get<AuthController>(TYPES.AuthController);

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const asyncHandler =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post(
  '/account/create',
  asyncHandler((req: Request, res: Response) =>
    authController.createAccount(req, res),
  ),
);
router.get(
  '/auth/outlook',
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    authController.initiateOutlookAuth(req, res, next),
  ),
);
router.post(
  '/auth/outlook/callback',
  asyncHandler((req: Request, res: Response, next: NextFunction) =>
    authController.handleOutlookCallback(req, res, next),
  ),
);

export default router;
