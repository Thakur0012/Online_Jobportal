import express from "express";
import { 
    getAllNewsletters, 
    createNewsletter, 
    deleteNewsletter,
    trackDownload,
    getDownloads,
    viewNewsletter,
    downloadNewsletterFile
} from "../controllers/newsletterController.js";
import { protectRoute, authorizeRoles } from "../middleware/authMiddleware.js";
import { uploadNewsletter } from "../middleware/uploadMiddleware.js";

import multer from "multer";

const router = express.Router();

const handleUpload = (uploadFn) => (req, res, next) => {
    uploadFn(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

router.get("/", getAllNewsletters);

// Protected routes (Logged in users only)
router.post("/:id/download", protectRoute, trackDownload);
router.get("/:id/view", viewNewsletter);
router.get("/:id/download_file", protectRoute, downloadNewsletterFile);

// Protected routes (Admin only)
router.get("/downloads", protectRoute, authorizeRoles("admin"), getDownloads);
router.post("/", protectRoute, authorizeRoles("admin"), handleUpload(uploadNewsletter), createNewsletter);
router.delete("/:id", protectRoute, authorizeRoles("admin"), deleteNewsletter);

export default router;
