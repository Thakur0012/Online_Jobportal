import mongoose from "mongoose";

const jobCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    icon: {
        type: String,
        default: "💼",
    },
    image: {
        type: String,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

const JobCategory = mongoose.model("JobCategory", jobCategorySchema);
export default JobCategory;
