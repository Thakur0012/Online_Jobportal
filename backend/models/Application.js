import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "reviewed", "accepted", "rejected"],
        default: "pending",
    },
    resumeUrl: {
        type: String, // Link to resume at the time of application
    }
}, { timestamps: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;
