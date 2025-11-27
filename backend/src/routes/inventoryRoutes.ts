import { Router } from 'express';
import { buy, equip, getInventoryForUser, getItems, sell, unequipSlot } from '../controllers/inventoryController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);
router.get('/items', getItems);
router.get('/', getInventoryForUser);
router.post('/buy', buy);
router.post('/sell', sell);
router.post('/equip', equip);
router.post('/unequip', unequipSlot);

export default router;
