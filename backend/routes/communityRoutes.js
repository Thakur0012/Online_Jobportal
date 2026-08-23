import express from "express";
import { 
    getAllPosts, 
    createPost, 
    toggleLikePost, 
    getComments, 
    addComment, 
    deletePost 
} from "../controllers/communityController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/posts", getAllPosts);
router.get("/posts/:id/comments", getComments);

// Auth protected routes
router.post("/posts", protectRoute, createPost);
router.post("/posts/:id/like", protectRoute, toggleLikePost);
router.post("/posts/:id/comments", protectRoute, addComment);
router.delete("/posts/:id", protectRoute, deletePost);

export default router;
