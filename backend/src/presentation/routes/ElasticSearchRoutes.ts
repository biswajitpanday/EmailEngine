import { Router, Request, Response, NextFunction } from 'express';
import { container } from '../../infrastructure/di/container';
import { TYPES } from '../../infrastructure/di/types';
import { ElasticSearchController } from '../controllers/ElasticSearchController';

const router = Router();
const elasticsearchController = container.get<ElasticSearchController>(
  TYPES.ElasticSearchController,
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
  '/forcereindex',
  asyncHandler((req: Request, res: Response) =>
    elasticsearchController.forceReIndex(req, res),
  ),
);

export default router;
