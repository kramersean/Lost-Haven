import { Router } from 'express';
import { listEnemies, startCombatEncounter } from '../controllers/combatController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);
router.get('/', listEnemies);
router.post('/start', startCombatEncounter);

export default router;
