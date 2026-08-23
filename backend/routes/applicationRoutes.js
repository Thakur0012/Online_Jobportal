import express from "express";
import { applyForJob, getSeekerApplications, getEmployerApplications, updateApplicationStatus } from "../controllers/applicationController.js";
import { protectRoute, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protectRoute, authorizeRoles("seeker"), applyForJob);
router.get("/seeker", protectRoute, authorizeRoles("seeker"), getSeekerApplications);

router.get("/employer", protectRoute, authorizeRoles("employer"), getEmployerApplications);
router.put("/:id/status", protectRoute, authorizeRoles("employer"), updateApplicationStatus);

export default router;
