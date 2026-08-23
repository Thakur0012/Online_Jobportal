import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    isGlobal: { type: Boolean, default: false },
    targetRole: { type: String }, // 'seeker', 'employer', 'all'
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For targeted
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String }, // Where to redirect
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // For global notifications tracking
    isRead: { type: Boolean, default: false } // For individual notifications
}, { timestamps: true });

// Auto-delete notifications after 12 hours (43200 seconds) using MongoDB TTL index
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 43200 });

export default mongoose.model('Notification', notificationSchema);
