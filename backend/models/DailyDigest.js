import mongoose from 'mongoose';

const dailyDigestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String, // Full HTML content from AI
        required: true
    },
    excerpt: {
        type: String,
        required: true
    },
    keywords: [{
        type: String
    }],
    thumbnail: {
        type: String,
        default: "https://images.unsplash.com/photo-1611974717482-9707310c9c5e?auto=format&fit=crop&q=80&w=1200" // Default finance news image
    },
    publishedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Create text index for search
dailyDigestSchema.index({ title: 'text', content: 'text', keywords: 'text' });

const DailyDigest = mongoose.model('DailyDigest', dailyDigestSchema);
export default DailyDigest;
