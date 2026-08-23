import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }
}, { timestamps: true });

// Prevent same user from subscribing with same email multiple times
subscriberSchema.index({ user: 1, email: 1 }, { unique: true });

export default mongoose.model('Subscriber', subscriberSchema);
