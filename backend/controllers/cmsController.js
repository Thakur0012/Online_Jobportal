import Blog from '../models/Blog.js';
import FAQ from '../models/FAQ.js';
import Contact from '../models/Contact.js';
import PageContent from '../models/PageContent.js';
import { sendEmail } from '../utils/emailService.js';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Multer memory storage (no local files) ──────────────────────────────────
const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
};

export const uploadLogoMiddleware = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).single('logo');

export const uploadIconMiddleware = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
}).single('icon');

// ── Upload handlers ──────────────────────────────────────────────────────────
export const uploadLogo = (req, res) => {
    uploadLogoMiddleware(req, res, async (err) => {
        if (err) return res.status(400).json({ message: err.message });
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        try {
            // Upload to Cloudinary using stream
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'LedgerBandhu/logo' },
                async (error, result) => {
                    if (error) return res.status(500).json({ message: "Cloudinary upload failed" });
                    
                    const url = result.secure_url;

                    // Persist URL into branding page content
                    const updateField = req.query.type === 'footer' ? 'content.footerLogoUrl' : 'content.logoUrl';
                    await PageContent.findOneAndUpdate(
                        { pageName: 'branding' },
                        { $set: { [updateField]: url } },
                        { upsert: true, new: true }
                    );
                    res.status(200).json({ url });
                }
            );
            uploadStream.end(req.file.buffer);
        } catch (error) {
            res.status(500).json({ message: "Failed to persist logo" });
        }
    });
};

export const uploadIcon = (req, res) => {
    uploadIconMiddleware(req, res, async (err) => {
        if (err) return res.status(400).json({ message: err.message });
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        try {
            // Upload to Cloudinary using stream
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'LedgerBandhu/icon' },
                async (error, result) => {
                    if (error) return res.status(500).json({ message: "Cloudinary upload failed" });
                    
                    const url = result.secure_url;

                    await PageContent.findOneAndUpdate(
                        { pageName: 'branding' },
                        { $set: { 'content.iconUrl': url } },
                        { upsert: true, new: true }
                    );
                    res.status(200).json({ url });
                }
            );
            uploadStream.end(req.file.buffer);
        } catch (error) {
            res.status(500).json({ message: "Failed to persist icon" });
        }
    });
};

// ── Public branding GET ──────────────────────────────────────────────────────
export const getBranding = async (req, res) => {
    try {
        const branding = await PageContent.findOne({ pageName: 'branding' });
        res.status(200).json(branding?.content || {});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── Blog Controllers ─────────────────────────────────────────────────────────
export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createBlog = async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── FAQ Controllers ──────────────────────────────────────────────────────────
export const getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createFAQ = async (req, res) => {
    try {
        const faq = await FAQ.create(req.body);
        res.status(201).json(faq);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteFAQ = async (req, res) => {
    try {
        await FAQ.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── Page Content Controllers ─────────────────────────────────────────────────
export const getPageContent = async (req, res) => {
    try {
        const content = await PageContent.findOne({ pageName: req.params.pageName });
        res.status(200).json(content || { pageName: req.params.pageName, content: {} });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePageContent = async (req, res) => {
    try {
        const { pageName, content } = req.body;
        const updated = await PageContent.findOneAndUpdate(
            { pageName },
            { content },
            { upsert: true, new: true }
        );
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ── Contact Controllers ──────────────────────────────────────────────────────
export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markContactRead = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(req.params.id, { status: 'read', isRead: true }, { new: true });
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const contact = await Contact.create({ name, email, message });

        // Send Email Notification to Admin
        try {
            await sendEmail({
                to: 'LedgerBandhu1@gmail.com',
                subject: `New Contact Form Submission: ${name}`,
                html: `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">New Inquiry Received</h1>
                        </div>
                        <div style="padding: 40px 30px;">
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">You have received a new message from the contact form on <strong>Ledger Bandhu</strong>.</p>
                            
                            <div style="background-color: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                                <div style="margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
                                    <span style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Sender Name</span>
                                    <span style="color: #1f2937; font-size: 16px; font-weight: 500;">${name}</span>
                                </div>
                                <div style="margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
                                    <span style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Email Address</span>
                                    <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-size: 16px; font-weight: 500;">${email}</a>
                                </div>
                                <div>
                                    <span style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 8px;">Message Content</span>
                                    <div style="color: #374151; font-size: 15px; line-height: 1.7; background: #ffffff; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
                                        ${message}
                                    </div>
                                </div>
                            </div>
                            
                            <div style="text-align: center;">
                                <a href="https://LedgerBandhu.com/admin" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 600; text-decoration: none; transition: background-color 0.3s ease;">View in Admin Panel</a>
                            </div>
                        </div>
                        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} Ledger Bandhu. All rights reserved.</p>
                        </div>
                    </div>
                `
            });
        } catch (emailError) {
            console.error("Failed to send admin notification email:", emailError);
            // We don't block the response even if email fails
        }

        res.status(201).json({ message: "Message sent successfully!", contact });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteContact = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Contact deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const bulkDeleteContacts = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: "Invalid IDs provided" });
        }
        await Contact.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: "Contacts deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

