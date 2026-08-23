import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyForJob = async (req, res) => {
    try {
        const { jobId, resumeUrl } = req.body;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Check if user already applied
        const existingApplication = await Application.findOne({
            jobId,
            applicantId: req.user._id,
        });

        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        const application = new Application({
            jobId,
            applicantId: req.user._id,
            employerId: job.employerId,
            resumeUrl: resumeUrl || req.user.resumeUrl,
        });

        await application.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSeekerApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicantId: req.user._id })
            .populate("jobId", "title companyName location salary");
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getEmployerApplications = async (req, res) => {
    try {
        const applications = await Application.find({ employerId: req.user._id })
            .populate("applicantId", "name email skills resumeUrl")
            .populate("jobId", "title");
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Only employer who posted the job can update status
        if (application.employerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        application.status = status;
        await application.save();

        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
