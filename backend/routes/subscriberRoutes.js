import express from "express";
import { 
    subscribe, 
    getSubscribers,
    removeSubscriber 
} from "../controllers/subscriberController.js";
import { protectRoute, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected: join newsletter (logged in users only)
router.post("/", protectRoute, subscribe);

// Admin: manage subscribers
router.get("/", protectRoute, authorizeRoles("admin"), getSubscribers);
router.delete("/:id", protectRoute, authorizeRoles("admin"), removeSubscriber);

export default router;
