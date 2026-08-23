import express from 'express';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '../controllers/faqController.js';

const router = express.Router();

// Public route to fetch FAQs
router.get('/', getFAQs);

// Admin only routes
router.post('/', createFAQ);
router.put('/:id', updateFAQ);
router.delete('/:id', deleteFAQ);

export default router;
