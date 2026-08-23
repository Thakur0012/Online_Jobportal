import express from "express";
import multer from "multer";
import {
    getDashboardStats,
    deleteUser,
    bulkDeleteUsers,
    getAllUsers,
    getAllJobs,
    deleteJob,
    bulkDeleteJobs,
    getAllApplications,
    deleteApplication,
    approveEmployer,
    rejectEmployer,
    adminCreateJob,
    approveJob,
    rejectJob,
    getCategories,
    addCategory,
    deleteCategory,
    updateCategory,
    getFormFields,
    addFormField,
    deleteFormField,
    toggleFormField,
    getRegistrations,
    updateJob,
    bulkDeleteApplications,
} from "../controllers/adminController.js";
import { generateJobFromAI, postScrapedJob } from "../controllers/aiController.js";
import { protectRoute, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectRoute, authorizeRoles("admin")); // apply to all routes

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.post("/users/bulk-delete", bulkDeleteUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/approve", approveEmployer);
router.patch("/users/:id/reject", rejectEmployer);

router.get("/jobs", getAllJobs);
router.post("/jobs", adminCreateJob);
router.patch("/jobs/:id/approve", approveJob);
router.patch("/jobs/:id/reject", rejectJob);
router.put("/jobs/:id", updateJob);
router.post("/jobs/bulk-delete", bulkDeleteJobs);
router.delete("/jobs/:id", deleteJob);

router.get("/applications", getAllApplications);
router.post("/applications/bulk-delete", bulkDeleteApplications);
router.delete("/applications/:id", deleteApplication);

const upload = multer({ storage: multer.memoryStorage() });

router.get("/categories", getCategories);
router.post("/categories", upload.single("image"), addCategory);
router.put("/categories/:id", upload.single("image"), updateCategory);
router.delete("/categories/:id", deleteCategory);

// Registration Form Manager
router.get("/form-fields", getFormFields);
router.post("/form-fields", addFormField);
router.delete("/form-fields/:id", deleteFormField);
router.patch("/form-fields/:id/toggle", toggleFormField);
router.get("/registrations", getRegistrations);

// AI Job Agent
router.post("/ai/generate", generateJobFromAI);
router.post("/ai/post", postScrapedJob);

export default router;
