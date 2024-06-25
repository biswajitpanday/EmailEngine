import { Router } from 'express';
import { container } from '../../infrastructure/di/container';
import { TYPES } from '../../infrastructure/di/types';
import { ElasticSearchController } from '../controllers/ElasticSearchController';

const router = Router();
const elasticsearchController = container.get<ElasticSearchController>(
  TYPES.ElasticSearchController,
);

router.post('/forcereindex', (req, res) =>
  elasticsearchController.forceReIndex(req, res),
);

export default router;
