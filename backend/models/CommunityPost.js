import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['General', 'Career Advice', 'Job Help', 'Finance Tips', 'Market Trends'],
        default: 'General'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    commentsCount: {
        type: Number,
        default: 0
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const CommunityPost = mongoose.model("CommunityPost", communityPostSchema);
export default CommunityPost;
