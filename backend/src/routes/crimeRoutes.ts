import { Router } from 'express';
import { getCrimes, performCrime } from '../controllers/crimeController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);
router.get('/', getCrimes);
router.post('/attempt', performCrime);

export default router;
