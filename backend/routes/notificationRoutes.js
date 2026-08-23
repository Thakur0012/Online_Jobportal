import express from 'express';
import { getMyNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

// All notification routes require authentication
router.use(protectRoute);

router.get('/', getMyNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);

export default router;
