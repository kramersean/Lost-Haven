import { Router } from 'express';
import { login, me, register } from '../controllers/authController';
import { authRateLimiter } from '../middleware/rateLimit';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.get('/me', authMiddleware, me);

export default router;
