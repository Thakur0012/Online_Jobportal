import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const setup = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI not found in .env');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'LedgerBandhu1@gmail.com';
        const password = 'LedgerBandhu12@admin';
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

        console.log('✅ Admin user created/updated successfully');
        console.log('📧 Email   :', email);
        console.log('🔑 Password:', password);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

setup();
