import express from 'express';
import DailyDigest from '../models/DailyDigest.js';
import { generateDailyDigest } from '../controllers/aiController.js';
import { protectRoute, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public: Get all digests
router.get('/', async (req, res) => {
    try {
        const digests = await DailyDigest.find().sort({ publishedAt: -1 });
        res.status(200).json(digests);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Public: Get single digest by slug
router.get('/:slug', async (req, res) => {
    try {
        const digest = await DailyDigest.findOne({ slug: req.params.slug });
        if (!digest) return res.status(404).json({ error: "Digest not found" });
        res.status(200).json(digest);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Admin Only: Generate a new digest
router.post('/generate', protectRoute, authorizeRoles('admin'), generateDailyDigest);

// Admin Only: Fix existing thumbnails
router.post('/fix-thumbnails', protectRoute, authorizeRoles('admin'), async (req, res) => {
    const { fixExistingThumbnails } = await import('../controllers/aiController.js');
    await fixExistingThumbnails(req, res);
});

// Admin Only: Delete a digest
router.delete('/:id', protectRoute, authorizeRoles('admin'), async (req, res) => {
    try {
        await DailyDigest.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Digest deleted successfully" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Admin Only: Bulk delete digests
router.post('/bulk-delete', protectRoute, authorizeRoles('admin'), async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) return res.status(400).json({ error: "Invalid IDs provided" });
        await DailyDigest.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: "Selected digests deleted successfully" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
