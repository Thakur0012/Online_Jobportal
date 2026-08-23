import Job from "../models/Job.js";
import User from "../models/User.js";

// =============================================
// EMPLOYER: Post a job (goes to pending review)
// =============================================
export const createJob = async (req, res) => {
    try {
        // Only admin-approved employers can post jobs
        const employer = await User.findById(req.user._id);
        if (!employer || !employer.isApproved) {
            return res.status(403).json({
                message: employer?.approvalStatus === 'rejected'
                    ? "Your employer account has been rejected. Please contact admin."
                    : "Your account is pending admin approval. You cannot post jobs yet."
            });
        }

        const { title, description, location, salary, requirements, category, openings, deadline, educationLevel, experienceLevel } = req.body;

        const newJob = new Job({
            title,
            description,
            location,
            salary,
            requirements: requirements || [],
            category,
            employerId: req.user._id,
            jobStatus: "pending",   // employer jobs need admin review
            postedByAdmin: false,
            isActive: true,
            openings: openings || 1,
            deadline: deadline || undefined, // let schema default handle it
            educationLevel: educationLevel || 'Graduation',
            experienceLevel: experienceLevel || '0-2 Years',
        });

        await newJob.save();
        res.status(201).json({ message: "Job submitted for admin review.", job: newJob });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// PUBLIC: Get only approved jobs (for frontend)
// =============================================
export const getJobs = async (req, res) => {
    try {
    const { search, category, location, experienceLevel, educationLevel } = req.query;
    let query = { jobStatus: "approved" };

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { requirements: { $regex: search, $options: "i" } }
        ];
    }
    if (category) {
        const categoryArray = Array.isArray(category) ? category : category.split(',').filter(Boolean);
        if (categoryArray.length > 0) {
            query.category = { $in: categoryArray };
        }
    }
    if (location) query.location = { $regex: location, $options: "i" };
    if (experienceLevel) {
        const expArray = Array.isArray(experienceLevel) ? experienceLevel : experienceLevel.split(',').filter(Boolean);
        if (expArray.length > 0) query.experienceLevel = { $in: expArray };
    }
    if (educationLevel) {
        const eduArray = Array.isArray(educationLevel) ? educationLevel : educationLevel.split(',').filter(Boolean);
        if (eduArray.length > 0) query.educationLevel = { $in: eduArray };
    }

        const jobs = await Job.find(query)
            .populate("employerId", "name companyName companyDescription")
            .sort({ isSponsored: -1, createdAt: -1 });

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// EMPLOYER: Get MY jobs (all statuses)
// =============================================
export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ employerId: req.user._id })
            .sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// PUBLIC: Get single job by ID
// =============================================
export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        let job;

        // Try searching by sequential jobId first if it's a number
        if (!isNaN(id) && id.length < 10) {
            job = await Job.findOne({ jobId: parseInt(id) })
                .populate("employerId", "name companyName companyDescription email");
        } 
        
        // Fallback to MongoDB _id if not found or not a number
        if (!job && id.match(/^[0-9a-fA-F]{24}$/)) {
            job = await Job.findById(id)
                .populate("employerId", "name companyName companyDescription email");
        }

        if (!job) return res.status(404).json({ message: "Job not found" });
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// EMPLOYER / ADMIN: Delete job
// =============================================
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.employerId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized to delete this job" });
        }

        await job.deleteOne();
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
