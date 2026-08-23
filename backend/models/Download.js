import mongoose from 'mongoose';

const downloadSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    newsletter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Newsletter',
        required: true
    },
    downloadedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Download = mongoose.model('Download', downloadSchema);
export default Download;
