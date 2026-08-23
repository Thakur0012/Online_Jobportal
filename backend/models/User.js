import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["seeker", "employer", "admin"],
        default: "seeker",
    },
    // Seeker Specific Fields
    resumeUrl: {
        type: String,
        default: "",
    },
    skills: [{
        type: String,
    }],
    phone: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    },
    // Dynamic extra fields from form field manager
    extraFields: {
        type: Map,
        of: String,
        default: {},
    },
    // Employer Specific Fields
    companyName: {
        type: String,
        default: "",
    },
    companyDescription: {
        type: String,
        default: "",
    },
    // Employer Approval Fields
    isApproved: {
        type: Boolean,
        default: false,
    },
    approvalStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
