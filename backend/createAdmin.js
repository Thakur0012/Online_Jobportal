import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = 'mongodb://localhost:27017/LedgerBandhu';

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'seeker' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const run = async () => {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB:', MONGODB_URI);

    const email = 'admin@LedgerBandhu.com';
    const password = 'admin123';

    // Delete existing admin if any
    await User.deleteOne({ email });
    console.log('Old admin removed (if existed)');

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name: 'System Admin', email, password: hashedPassword, role: 'admin' });

    console.log('\n✅ Admin created successfully!');
    console.log('📧 Email   :', email);
    console.log('🔑 Password:', password);
    process.exit(0);
};

run().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
