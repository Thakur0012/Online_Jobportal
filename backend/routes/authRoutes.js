import express from "express";
import multer from "multer";
import { register, login, logout, getMe, updateProfile, sendOTP, sendForgotOTP, resetPassword } from "../controllers/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import { uploadResume } from "../middleware/uploadMiddleware.js";

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

router.post("/send-otp", sendOTP);
router.post("/forgot-otp", sendForgotOTP);
router.post("/reset-password", resetPassword);
router.post("/register", handleUpload(uploadResume), register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);
router.put("/profile", protectRoute, handleUpload(uploadResume), updateProfile);

export default router;
