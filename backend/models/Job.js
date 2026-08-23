import mongoose from "mongoose";
import JobCategory from "./JobCategory.js";
import Counter from "./Counter.js";

const jobSchema = new mongoose.Schema({
    jobId: {
        type: Number,
        unique: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
        required: false,
        default: "Not disclosed"
    },
    requirements: [{
        type: String,
    }],
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    category: {
        type: String,
        required: true,
    },
    // Job approval system
    jobStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    postedByAdmin: {
        type: Boolean,
        default: false,
    },
    openings: {
        type: Number,
        default: 1,
        min: 1,
    },
    deadline: {
        type: Date,
        default: () => {
            const d = new Date();
            d.setDate(d.getDate() + 45);
            return d;
        },
    },
    educationLevel: {
        type: String,
        enum: ['10th', '12th', 'ITI', 'Diploma', 'Graduation', 'Post Grad', 'PhD'],
        default: 'Graduation',
    },
    experienceLevel: {
        type: String,
        enum: ['0-2 Years', '2-5 Years', '5-10 Years', '10+ Years'],
        default: '0-2 Years',
    },
    linkedInPost: {
        type: String,
        required: false,
    },
    externalUrl: {
        type: String,
        required: false,
    },
    isSponsored: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

jobSchema.pre('save', async function () {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { id: 'jobId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        // Start from 1000 if it's the first one
        if (counter.seq < 1000) {
            counter.seq = 1000;
            await counter.save();
        }
        this.jobId = counter.seq;
    }
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
