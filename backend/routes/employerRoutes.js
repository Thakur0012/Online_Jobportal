import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Get all approved employers
router.get("/", async (req, res) => {
    try {
        const employers = await User.find({
            role: "employer",
            approvalStatus: "approved"
        }).select("-password -email"); // Exclude sensitive info but keep IDs, names, desc, etc.
        res.json(employers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
