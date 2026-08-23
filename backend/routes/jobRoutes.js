import express from "express";
import { createJob, getJobs, getJobById, deleteJob, getMyJobs } from "../controllers/jobController.js";
import { protectRoute, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/my-jobs", protectRoute, authorizeRoles("employer"), getMyJobs);
router.get("/:id", getJobById);

// Protected routes (Employer only for creating, Employer/Admin for deleting)
router.post("/", protectRoute, authorizeRoles("employer"), createJob);
router.delete("/:id", protectRoute, authorizeRoles("employer", "admin"), deleteJob);

export default router;
