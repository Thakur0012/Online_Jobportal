import express from 'express';
import { conductMockInterview, scoreResume, generateRoadmap } from '../controllers/aiController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
import multer from 'multer';

// Use memory storage for resume parsing
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const router = express.Router();

// Mock Interview requires authentication (protectRoute)
router.post('/mock-interview', protectRoute, conductMockInterview);

// AI Tools - require authentication
router.post('/score-resume', protectRoute, upload.single('resume'), scoreResume);
router.post('/career-roadmap', protectRoute, generateRoadmap);

export default router;
