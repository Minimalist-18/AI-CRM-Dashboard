import {Router} from 'express';
import {
    registerUser,
    login,
    getMe,
    updateProfile
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

export default router;