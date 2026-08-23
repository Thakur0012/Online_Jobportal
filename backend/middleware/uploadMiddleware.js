import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let subFolder = 'misc';
        if (file.fieldname === 'resume') subFolder = 'resumes';
        else if (file.fieldname === 'image' || file.fieldname === 'pdf') subFolder = 'newsletters';
        
        const dir = path.join(__dirname, '..', 'uploads', subFolder);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('File type not allowed'), false);
};

export const uploadResume = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (['.pdf', '.doc', '.docx'].includes(ext)) cb(null, true);
        else cb(new Error('Only PDF, DOC, DOCX files allowed for resume'), false);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('resume');

export const uploadNewsletter = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (file.fieldname === 'image') {
            if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) cb(null, true);
            else cb(new Error('Only image files (JPG, PNG, WEBP) allowed for cover'), false);
        } else if (file.fieldname === 'pdf') {
            if (ext === '.pdf') cb(null, true);
            else cb(new Error('Only PDF files allowed for brochure'), false);
        } else {
            cb(null, true);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit for newsletter files
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
]);
