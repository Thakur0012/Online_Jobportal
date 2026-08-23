import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    pdfUrl: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Newsletter', newsletterSchema);
