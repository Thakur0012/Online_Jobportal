import express from 'express';
import {
    getBlogs, createBlog, deleteBlog,
    getFAQs, createFAQ, deleteFAQ,
    getPageContent, updatePageContent,
    getContacts, markContactRead, deleteContact, bulkDeleteContacts,
    uploadLogo, uploadIcon, getBranding,
    submitContact
} from '../controllers/cmsController.js';
import { protectRoute, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (for frontend consumption)
router.get('/blogs', getBlogs);
router.get('/faqs', getFAQs);
router.get('/page/:pageName', getPageContent);
router.get('/branding', getBranding);
router.post('/contact', submitContact);

// Admin only routes
router.use(protectRoute, authorizeRoles('admin'));

router.post('/blogs', createBlog);
router.delete('/blogs/:id', deleteBlog);

router.post('/faqs', createFAQ);
router.delete('/faqs/:id', deleteFAQ);

router.post('/page', updatePageContent);

router.get('/contacts', getContacts);
router.patch('/contacts/:id/read', markContactRead);
router.delete('/contacts/:id', deleteContact);
router.post('/contacts/bulk-delete', bulkDeleteContacts);

// Branding uploads (multer handles multipart inside controller)
router.post('/upload-logo', uploadLogo);
router.post('/upload-icon', uploadIcon);

export default router;
