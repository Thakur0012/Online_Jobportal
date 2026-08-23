import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import JobCategory from "../models/JobCategory.js";
import FormField from "../models/FormField.js";
import Contact from "../models/Contact.js";
import Notification from "../models/Notification.js";
import { uploadToCloudinary } from "../utils/cloudinaryHelper.js";
import { postJobToLinkedIn } from "../utils/linkedinService.js";

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        // Stats by role
        const seekers = await User.countDocuments({ role: "seeker" });
        const employers = await User.countDocuments({ role: "employer" });

        const pendingEmployers = await User.countDocuments({ role: "employer", approvalStatus: "pending" });
        const pendingJobs = await Job.countDocuments({ jobStatus: "pending" });
        const totalContacts = await Contact.countDocuments();
        const unreadContacts = await Contact.countDocuments({ isRead: false });

        res.status(200).json({
            totalUsers,
            totalJobs,
            totalApplications,
            seekers,
            employers,
            pendingEmployers,
            pendingJobs,
            totalContacts,
            unreadContacts,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: "Admin cannot delete themselves" });
        }

        await user.deleteOne();
        // Cascade delete jobs and applications? Simplified logic for MVP
        await Job.deleteMany({ employerId: user._id });
        await Application.deleteMany({ applicantId: user._id });

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const bulkDeleteUsers = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: "Invalid IDs provided" });
        }
        
        // Prevent deleting the current admin user if included
        const idsToDelete = ids.filter(id => id !== req.user._id.toString());
        
        await User.deleteMany({ _id: { $in: idsToDelete } });
        // Cascade deletes
        await Job.deleteMany({ employerId: { $in: idsToDelete } });
        await Application.deleteMany({ applicantId: { $in: idsToDelete } });

        res.status(200).json({ message: "Users deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filter = role ? { role } : {};
        const users = await User.find(filter).select("-password").sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const approveEmployer = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== 'employer') return res.status(404).json({ message: "Employer not found" });
        user.isApproved = true;
        user.approvalStatus = 'approved';
        await user.save();
        res.status(200).json({ message: "Employer approved successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const rejectEmployer = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== 'employer') return res.status(404).json({ message: "Employer not found" });
        user.isApproved = false;
        user.approvalStatus = 'rejected';
        await user.save();
        res.status(200).json({ message: "Employer rejected", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Job Management
export const getAllJobs = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { jobStatus: status } : {};
        const jobs = await Job.find(filter)
            .populate("employerId", "name companyName email")
            .sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        await job.deleteOne();
        await Application.deleteMany({ jobId: req.params.id });

        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const bulkDeleteJobs = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: "Invalid IDs provided" });
        }
        await Job.deleteMany({ _id: { $in: ids } });
        await Application.deleteMany({ jobId: { $in: ids } });
        res.status(200).json({ message: "Jobs deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        const { title, description, location, salary, requirements, category, openings, deadline, educationLevel, experienceLevel } = req.body;
        
        if (title) job.title = title;
        if (description) job.description = description;
        if (location) job.location = location;
        if (salary !== undefined) job.salary = salary;
        if (requirements) job.requirements = requirements;
        if (category) job.category = category;
        if (openings) job.openings = openings;
        if (deadline !== undefined) job.deadline = deadline;
        if (educationLevel) job.educationLevel = educationLevel;
        if (experienceLevel) job.experienceLevel = experienceLevel;
        if (req.body.isSponsored !== undefined) job.isSponsored = req.body.isSponsored;

        await job.save();

        res.status(200).json({ message: "Job updated successfully", job });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const adminCreateJob = async (req, res) => {
    try {
        const { title, description, location, salary, requirements, category, openings, deadline, educationLevel, experienceLevel } = req.body;
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            requirements: requirements || [],
            category,
            employerId: req.user._id,   // admin's own id
            jobStatus: "approved",       // admin posts are auto-approved
            postedByAdmin: true,
            isActive: true,
            openings: openings || 1,
            deadline: deadline || undefined,
            educationLevel: educationLevel || 'Graduation',
            experienceLevel: experienceLevel || '0-2 Years',
            isSponsored: req.body.isSponsored || false,
        });
        await newJob.save();

        if (newJob.isActive) {
            await Notification.create({
                isGlobal: true,
                targetRole: 'seeker',
                title: 'New Job Posted!',
                message: `A new job "${title}" has been posted.`,
                link: `/jobs/${newJob.jobId || newJob._id}`,
            });

            // Auto-post to LinkedIn (fire-and-forget)
            postJobToLinkedIn(newJob).then(result => {
                if (result.success) console.log(`[LinkedIn] Job "${title}" posted. ID: ${result.postId}`);
                else console.warn(`[LinkedIn] Skipped for "${title}": ${result.reason}`);
            }).catch(e => console.error('[LinkedIn] Unexpected error:', e.message));
        }

        res.status(201).json({ message: "Job posted successfully.", job: newJob });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const approveJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        job.jobStatus = "approved";
        await job.save();

        if (job.isActive) {
            await Notification.create({
                isGlobal: true,
                targetRole: 'seeker',
                title: 'New Job Available!',
                message: `A new job "${job.title}" has been approved and is now live.`,
                link: `/jobs/${job.jobId || job._id}`,
            });

            // Auto-post to LinkedIn (fire-and-forget)
            postJobToLinkedIn(job).then(result => {
                if (result.success) console.log(`[LinkedIn] Job "${job.title}" posted. ID: ${result.postId}`);
                else console.warn(`[LinkedIn] Skipped for "${job.title}": ${result.reason}`);
            }).catch(e => console.error('[LinkedIn] Unexpected error:', e.message));
        }

        res.status(200).json({ message: "Job approved", job });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const rejectJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        job.jobStatus = "rejected";
        await job.save();
        res.status(200).json({ message: "Job rejected", job });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Application Management
export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate("jobId", "title externalUrl")
            .populate("applicantId", "name email phone skills resumeUrl");
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: "Application not found" });

        await application.deleteOne();
        res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const bulkDeleteApplications = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: "Invalid IDs provided" });
        }
        await Application.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: "Applications deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// JOB CATEGORY MANAGEMENT
// =============================================
const DEFAULT_CATEGORIES = [
    { name: 'Investment Banking', icon: '🏦' },
    { name: 'Accounting & Audit', icon: '📋' },
    { name: 'Fintech Solutions', icon: '📱' },
    { name: 'Banking Operations', icon: '🏛️' },
    { name: 'Insurance & Risk', icon: '🛡️' },
    { name: 'Taxation & Legal', icon: '⚖️' },
    { name: 'Wealth Management', icon: '💰' },
    { name: 'Corporate Finance', icon: '🏢' },
    { name: 'Equity Research', icon: '📈' },
    { name: 'Forex & Treasury', icon: '💹' },
    { name: 'Financial Planning', icon: '📅' },
    { name: 'Credit & Loans', icon: '💳' },
];

export const getCategories = async (req, res) => {
    try {
        let categories = await JobCategory.find({ isActive: true }).sort({ name: 1 });
        // Seed defaults if empty
        if (categories.length === 0) {
            await JobCategory.insertMany(DEFAULT_CATEGORIES);
            categories = await JobCategory.find({ isActive: true }).sort({ name: 1 });
        }
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Category name is required' });
        const exists = await JobCategory.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (exists) return res.status(400).json({ message: 'Category already exists' });

        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file.buffer, 'categories');
        }

        const cat = new JobCategory({ 
            name: name.trim(), 
            image: imageUrl
        });
        await cat.save();
        res.status(201).json(cat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const cat = await JobCategory.findById(req.params.id);
        if (!cat) return res.status(404).json({ message: 'Category not found' });
        await cat.deleteOne();
        res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const cat = await JobCategory.findById(req.params.id);
        if (!cat) return res.status(404).json({ message: 'Category not found' });

        const { name } = req.body;
        if (name && name.trim()) {
            // Check for duplicate name (excluding self)
            const duplicate = await JobCategory.findOne({
                name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
                _id: { $ne: req.params.id }
            });
            if (duplicate) return res.status(400).json({ message: 'Another category with this name already exists' });
            cat.name = name.trim();
        }

        if (req.file) {
            cat.image = await uploadToCloudinary(req.file.buffer, 'categories');
        }

        await cat.save();
        res.status(200).json(cat);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// REGISTRATION FORM FIELD MANAGEMENT
// =============================================
const CORE_FIELDS = [
    { fieldName: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', required: true, forRole: 'both', isCore: true, order: 1 },
    { fieldName: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email', required: true, forRole: 'both', isCore: true, order: 2 },
    { fieldName: 'password', label: 'Password', type: 'password', placeholder: 'Create a password', required: true, forRole: 'both', isCore: true, order: 3 },
    { fieldName: 'phone', label: 'Phone Number', type: 'tel', placeholder: '10-digit mobile number', required: false, forRole: 'both', isCore: false, order: 4 },
    { fieldName: 'skills', label: 'Skills (comma-separated)', type: 'text', placeholder: 'e.g. CA, CMA, ACCA', required: false, forRole: 'seeker', isCore: false, order: 5 },
    { fieldName: 'resume', label: 'Upload Resume (PDF/DOC)', type: 'file', placeholder: '', required: false, forRole: 'seeker', isCore: false, order: 6 },
    { fieldName: 'companyName', label: 'Company Name', type: 'text', placeholder: 'Your company name', required: true, forRole: 'employer', isCore: false, order: 7 },
    { fieldName: 'companyDescription', label: 'Company Description', type: 'textarea', placeholder: 'Briefly describe your company', required: false, forRole: 'employer', isCore: false, order: 8 },
];

export const getFormFields = async (req, res) => {
    try {
        let fields = await FormField.find().sort({ order: 1 });
        if (fields.length === 0) {
            await FormField.insertMany(CORE_FIELDS);
            fields = await FormField.find().sort({ order: 1 });
        }
        res.status(200).json(fields);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addFormField = async (req, res) => {
    try {
        const { fieldName, label, type, placeholder, required, forRole, options } = req.body;
        if (!fieldName || !label) return res.status(400).json({ message: 'fieldName and label are required' });
        const exists = await FormField.findOne({ fieldName });
        if (exists) return res.status(400).json({ message: 'A field with this field name already exists' });
        const maxOrder = await FormField.findOne().sort({ order: -1 });
        const field = new FormField({
            fieldName: fieldName.trim().replace(/\s+/g, '_').toLowerCase(),
            label, type: type || 'text', placeholder: placeholder || '',
            required: required || false, forRole: forRole || 'both',
            options: options || [], isCore: false,
            order: (maxOrder?.order || 0) + 1
        });
        await field.save();
        res.status(201).json(field);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteFormField = async (req, res) => {
    try {
        const field = await FormField.findById(req.params.id);
        if (!field) return res.status(404).json({ message: 'Field not found' });
        if (field.isCore) return res.status(400).json({ message: 'Core fields cannot be deleted' });
        await field.deleteOne();
        res.status(200).json({ message: 'Field deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const toggleFormField = async (req, res) => {
    try {
        const field = await FormField.findById(req.params.id);
        if (!field) return res.status(404).json({ message: 'Field not found' });
        field.isActive = !field.isActive;
        await field.save();
        res.status(200).json(field);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all registered users with their registration data (for admin view)
export const getRegistrations = async (req, res) => {
    try {
        const role = req.query.role; // 'seeker', 'employer', or all
        const query = role ? { role } : { role: { $in: ['seeker', 'employer'] } };
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
