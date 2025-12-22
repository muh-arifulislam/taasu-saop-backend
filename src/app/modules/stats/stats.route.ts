import { Router } from 'express';
import { StatsControllers } from './stats.controller';

const router = Router();

router.get('/', StatsControllers.getDashboardStats);
router.get('/key-metrics', StatsControllers.getKeyMetrics);

export const StatsRoutes = router;
