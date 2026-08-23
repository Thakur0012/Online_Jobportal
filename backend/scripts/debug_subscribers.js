import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from one level up
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import Subscriber from '../models/Subscriber.js';
import User from '../models/User.js';

const debug = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully');

        const subscribers = await Subscriber.find().populate('user', 'name email');
        console.log(`\nFound ${subscribers.length} total subscribers:`);
        
        if (subscribers.length > 0) {
            console.log('--------------------------------------------------');
            subscribers.forEach((sub, i) => {
                const userName = sub.user?.name || 'NULL/DELETED';
                const userEmail = sub.user?.email || 'N/A';
                console.log(`${i + 1}. [Subscribed Email: ${sub.email}]`);
                console.log(`    User Ref: ${sub.user ? `${userName} (${userEmail})` : 'MISSING USER REFERENCE'}`);
                console.log(`    Created At: ${sub.createdAt}`);
                console.log('--------------------------------------------------');
            });
        } else {
            console.log('No subscribers found in database.');
        }

        const totalUsers = await User.countDocuments();
        console.log(`\nTotal users in database: ${totalUsers}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Debug Error:', error);
        process.exit(1);
    }
};

debug();
