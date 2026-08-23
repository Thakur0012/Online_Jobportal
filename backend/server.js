import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import cron from 'node-cron';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cmsRoutes from './routes/cmsRoutes.js';
import employerRoutes from './routes/employerRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { generateDailyDigestTask } from './controllers/aiController.js';
import { runJobAutomation } from './tasks/jobAutomationTask.js';
import newsRoutes from './routes/newsRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import linkedinRoutes from './routes/linkedinRoutes.js';
import FormField from './models/FormField.js';
import JobCategory from './models/JobCategory.js';
import FAQ from './models/FAQ.js';
import User from './models/User.js';
import Job from './models/Job.js';
import Counter from './models/Counter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ULTIMATE CORS FIX - MANUAL HEADERS
const ALLOWED_ORIGINS = [
    'https://www.ledgerbandhu.com',
    'https://ledgerbandhu.com',
    'https://finance-bandhu.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
];

// CORS - Allow all configured origins and handle preflight
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const isAllowed = !origin || ALLOWED_ORIGINS.some(o => origin.startsWith(o) || o.startsWith(origin.replace(/\/$/, '')));

    if (isAllowed || origin) {
        const allowedOrigin = isAllowed ? (origin || ALLOWED_ORIGINS[0]).replace(/\/$/, '') : ALLOWED_ORIGINS[0];
        res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cookie,Accept,X-Requested-With');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Vary', 'Origin');
    }

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    next();
});

// ── Security Headers ─────────────────────────────────────────────────────────
// Fixes: X-Content-Type-Options, X-Frame-Options, Referrer-Policy,
//        Content-Security-Policy, Strict-Transport-Security warnings
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    next();
});

app.use(cookieParser());

// Serve uploaded files as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/newsletters', newsletterRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/linkedin', linkedinRoutes);

// Public: Job Categories (no auth required)
const DEFAULT_CATEGORIES = [
    { name: 'Investment Banking', icon: '🏦' },
    { name: 'Financial Analysis', icon: '📊' },
    { name: 'Accountancy & Audit', icon: '📝' },
    { name: 'Fintech Solutions', icon: '📱' },
    { name: 'Insurance & Risk', icon: '🛡️' },
    { name: 'Taxation & Compliance', icon: '⚖️' },
    { name: 'Wealth Management', icon: '💰' },
    { name: 'Corporate Finance', icon: '🏢' },
    { name: 'Equity Research', icon: '📈' },
    { name: 'Commercial Banking', icon: '🏛️' },
    { name: 'Data Visualization', icon: '📊' },
    { name: 'Cryptocurrency', icon: '₿' },
    { name: 'Forex Trading', icon: '💹' },
    { name: 'Financial Planning', icon: '📅' },
    { name: 'Treasury Management', icon: '🏧' },
    { name: 'Credit Analysis', icon: '💳' },
    { name: 'Stock Broking', icon: '📜' },
    { name: 'Asset Management', icon: '🏘️' },
    { name: 'Remote Finance', icon: '🌐' },
    { name: 'Business Analysis', icon: '📐' },
];

app.get('/api/categories', async (req, res) => {
    try {
        let cats = await JobCategory.find({ isActive: true }).sort({ name: 1 });
        // Seed defaults if empty
        if (cats.length === 0) {
            await JobCategory.insertMany(DEFAULT_CATEGORIES);
            cats = await JobCategory.find({ isActive: true }).sort({ name: 1 });
        }

        // Attach real job counts per category
        const countsAgg = await Job.aggregate([
            { $match: { jobStatus: 'approved' } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        const countMap = {};
        countsAgg.forEach(c => { countMap[c._id] = c.count; });

        const formatCount = (n) => {
            if (!n || n === 0) return '';
            if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k+ jobs`;
            return `${n} job${n !== 1 ? 's' : ''}`;
        };

        const result = cats.map(cat => ({
            ...cat.toObject(),
            count: formatCount(countMap[cat.name] || 0),
        }));

        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Public: Form Fields (so Register page can fetch without auth)
app.get('/api/form-fields', async (req, res) => {
    try {
        const fields = await FormField.find({ isActive: true }).sort({ order: 1 });
        res.status(200).json(fields);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.get('/api/secret-admin-setup', async (req, res) => {
    try {
        const email = 'naukripost@gmail.com';
        const password = 'Naukripost12@admin';
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate(
            { email },
            {
                name: 'LedgerBandhu Admin',
                password: hashedPassword,
                role: 'admin'
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            message: 'ADMIN_SETUP_SUCCESSFUL',
            details: `Account ${email} created/updated with role: admin`
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/debug-db', async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('email role');
        res.status(200).json({
            adminCount: admins.length,
            admins: admins.map(a => a.email)
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'Ok',
        message: 'LedgerBandhu Clone API is running - DEPLOYMENT_VERIFIED_v1.0.6',
        time: new Date().toISOString()
    });
});

// Migration: Assign jobId to existing jobs
const migrateJobIds = async () => {
    try {
        const jobsWithoutId = await Job.find({ jobId: { $exists: false } });
        if (jobsWithoutId.length > 0) {
            console.log(`Migrating ${jobsWithoutId.length} jobs to have sequential IDs...`);
            for (const job of jobsWithoutId) {
                const counter = await Counter.findOneAndUpdate(
                    { id: 'jobId' },
                    { $inc: { seq: 1 } },
                    { new: true, upsert: true }
                );
                if (counter.seq < 1000) {
                    counter.seq = 1000;
                    await counter.save();
                }
                job.jobId = counter.seq;
                await job.save({ validateBeforeSave: false }); // Bypass any strict validation if needed
            }
            console.log('Job ID migration completed.');
        }
    } catch (error) {
        console.error('Job ID migration failed:', error);
    }
};

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
    await migrateJobIds();

    // Catch-up mechanism: Run AI Digest task on startup if today's is missing
    console.log('[SYSTEM] Performing startup check for Daily AI Digest...');
    try {
        await generateDailyDigestTask();
    } catch (error) {
        console.error('[SYSTEM] Startup AI Digest check failed:', error.message);
    }

    console.log('[SYSTEM] Performing startup check for Job Automation...');
    try {
        await runJobAutomation();
    } catch (error) {
        console.error('[SYSTEM] Startup Job Automation failed:', error.message);
    }

    // Schedule Daily AI Digest Generation at 08:00 AM Everyday
    cron.schedule('0 8 * * *', async () => {
        console.log('[CRON] Initiating automated AI Daily Digest generation...');
        try {
            await generateDailyDigestTask();
        } catch (error) {
            console.error('[CRON] Automated task failed:', error.message);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });

    // Schedule Automated Finance Job Posting every 4 hours
    // (runs at 0, 4, 8, 12, 16, 20 hrs)
    cron.schedule('0 */4 * * *', async () => {
        console.log('[CRON] Initiating automated Finance Job Posting...');
        try {
            await runJobAutomation();
        } catch (error) {
            console.error('[CRON-JOB] Job automation error:', error.message);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });

    app.listen(PORT, () => {
        console.log(`LedgerBandhu Backend running on port ${PORT}`);
    });
});
