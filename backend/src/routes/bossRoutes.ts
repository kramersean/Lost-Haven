import { Router } from 'express';
import { allocateStats, getBoss, getResources, layLow } from '../controllers/bossController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);
router.get('/', getBoss);
router.get('/resources', getResources);
router.post('/allocate-stats', allocateStats);
router.post('/lay-low', layLow);

export default router;
