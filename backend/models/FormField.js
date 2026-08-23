import mongoose from "mongoose";

const formFieldSchema = new mongoose.Schema({
    fieldName: {
        type: String,
        required: true,
        trim: true,
    },
    label: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['text', 'email', 'password', 'tel', 'number', 'textarea', 'select', 'file', 'url', 'date'],
        default: 'text',
    },
    placeholder: {
        type: String,
        default: '',
    },
    required: {
        type: Boolean,
        default: false,
    },
    options: [{
        type: String, // for select fields
    }],
    forRole: {
        type: String,
        enum: ['seeker', 'employer', 'both'],
        default: 'both',
    },
    isCore: {
        type: Boolean,
        default: false, // true = cannot be deleted (name, email, password)
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    order: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const FormField = mongoose.model("FormField", formFieldSchema);
export default FormField;
