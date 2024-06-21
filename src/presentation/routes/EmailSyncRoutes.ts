import { Router, Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/di/container';
import { TYPES } from '../../infrastructure/di/types';
import { EmailSyncController } from '../controllers/EmailSyncController';

const router = Router();
const emailSyncController = container.get<EmailSyncController>(
  TYPES.EmailSyncController,
);

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const asyncHandler =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.get(
  '/emails/:userId',
  asyncHandler((req: Request, res: Response) =>
    emailSyncController.syncEmails(req, res),
  ),
);

export default router;
