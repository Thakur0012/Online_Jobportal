import path from "path";
import axios from "axios";
import Newsletter from "../models/Newsletter.js";
import Download from "../models/Download.js";
import cloudinary from "../config/cloudinary.js";

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, originalName, resourceType = 'auto') => {
    return new Promise((resolve, reject) => {
        // For raw files, public_id MUST include the extension
        // For images/auto, it's better to keep it clean but Cloudinary handles it
        const parsed = path.parse(originalName);
        const fileName = parsed.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        const uploadOptions = { 
            folder, 
            resource_type: resourceType,
            public_id: fileName,
            use_filename: true,
            unique_filename: true
        };

        const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) reject(error);
                else {
                    let url = result.secure_url;
                    
                    // For PDFs, ensure the URL ends with .pdf or has .pdf before parameters
                    // This is CRITICAL for browser recognition and Cloudinary flags
                    if (originalName.toLowerCase().endsWith('.pdf')) {
                        if (!url.toLowerCase().split('?')[0].endsWith('.pdf')) {
                            url = url.split('?')[0] + '.pdf';
                        }
                    }
                    resolve(url);
                }
            }
        );
        uploadStream.end(buffer);
    });
};

// =============================================
// PUBLIC: Get all newsletters
// =============================================
export const getAllNewsletters = async (req, res) => {
    try {
        const newsletters = await Newsletter.find().sort({ createdAt: -1 });
        res.status(200).json(newsletters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// ADMIN: Create a newsletter
// =============================================
export const createNewsletter = async (req, res) => {
    try {
        const { title } = req.body;
        const files = req.files;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        if (!files || !files.image || !files.pdf) {
            return res.status(400).json({ message: "Both cover image and PDF brochure are required" });
        }

        const imageUrl = `/uploads/newsletters/${files.image[0].filename}`;
        const pdfUrl = `/uploads/newsletters/${files.pdf[0].filename}`;

        const newNewsletter = new Newsletter({
            title,
            image: imageUrl,
            pdfUrl: pdfUrl
        });

        await newNewsletter.save();
        res.status(201).json({ message: "Newsletter published successfully", newsletter: newNewsletter });
    } catch (error) {
        console.error("Newsletter creation error:", error);
        res.status(500).json({ message: error.message || "Failed to publish newsletter" });
    }
};

// =============================================
// ADMIN: Delete a newsletter
// =============================================
export const deleteNewsletter = async (req, res) => {
    try {
        const newsletter = await Newsletter.findById(req.params.id);
        if (!newsletter) return res.status(404).json({ message: "Newsletter not found" });

        await newsletter.deleteOne();
        res.status(200).json({ message: "Newsletter deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// AUTH: Track newsletter download
// =============================================
export const trackDownload = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const download = new Download({
            user: userId,
            newsletter: id
        });

        await download.save();
        res.status(201).json({ message: "Download tracked successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// ADMIN: Get all download logs
// =============================================
export const getDownloads = async (req, res) => {
    try {
        const downloads = await Download.find()
            .populate('user', 'name email')
            .populate('newsletter', 'title')
            .sort({ downloadedAt: -1 });
        
        res.status(200).json(downloads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =============================================
// PUBLIC: Proxy View PDF
// =============================================
export const viewNewsletter = async (req, res) => {
    try {
        const newsletter = await Newsletter.findById(req.params.id);
        if (!newsletter) return res.status(404).json({ message: "Newsletter not found" });

        if (newsletter.pdfUrl.startsWith('/uploads')) {
            const filePath = path.join(process.cwd(), newsletter.pdfUrl.startsWith('/') ? newsletter.pdfUrl.substring(1) : newsletter.pdfUrl);
            return res.sendFile(filePath);
        }

        const response = await axios({
            method: 'get',
            url: newsletter.pdfUrl,
            responseType: 'stream'
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        response.data.pipe(res);
    } catch (error) {
        console.error("View proxy error:", error);
        res.status(500).json({ message: "Failed to load PDF" });
    }
};

// =============================================
// AUTH: Proxy Download PDF
// =============================================
export const downloadNewsletterFile = async (req, res) => {
    try {
        const newsletter = await Newsletter.findById(req.params.id);
        if (!newsletter) return res.status(404).json({ message: "Newsletter not found" });

        // track download logic
        const download = new Download({
            user: req.user._id,
            newsletter: newsletter._id
        });
        await download.save();

        if (newsletter.pdfUrl.startsWith('/uploads')) {
            const filePath = path.join(process.cwd(), newsletter.pdfUrl.startsWith('/') ? newsletter.pdfUrl.substring(1) : newsletter.pdfUrl);
            const fileName = `${newsletter.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
            return res.download(filePath, fileName);
        }

        const response = await axios({
            method: 'get',
            url: newsletter.pdfUrl,
            responseType: 'stream'
        });

        const fileName = `${newsletter.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        response.data.pipe(res);
    } catch (error) {
        console.error("Download proxy error:", error);
        res.status(500).json({ message: "Failed to download PDF" });
    }
};
