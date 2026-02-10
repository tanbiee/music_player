import express from 'express'
import { signup, login, editProfile, getMe, toggleFavorite } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router()

router.post('/signup', signup);
router.post('/login', login);
router.patch('/profile', protect, editProfile);
router.get('/me', protect, getMe);
router.patch('/favorites', protect, toggleFavorite);

export default router;