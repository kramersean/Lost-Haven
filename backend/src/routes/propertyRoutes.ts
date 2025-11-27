import { Router } from 'express';
import { buy, collect, listOwned, listPropertyTemplates, upgrade } from '../controllers/propertyController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);
router.get('/', listPropertyTemplates);
router.get('/mine', listOwned);
router.post('/buy', buy);
router.post('/collect-income', collect);
router.post('/upgrade', upgrade);

export default router;
