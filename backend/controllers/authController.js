import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/emailService.js";


const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// Cookie settings differ between local dev (HTTP) and production (HTTPS cross-domain)
const getCookieOptions = () => {
    const isProd = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    };
};

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to DB
        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        if (process.env.NODE_ENV !== 'production') {
            console.log(`\n========================================`);
            console.log(`[LOCAL DEV] Generated OTP for ${email}: ${otp}`);
            console.log(`========================================\n`);
        }

        // Send Email
        try {
            await sendEmail({
                to: email,
                subject: "Your OTP for LedgerBandhu Registration",
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <h2 style="color: #1B2E6B; text-align: center;">Verify Your Email</h2>
                        <p>Hello,</p>
                        <p>Thank you for choosing LedgerBandhu. Use the following OTP to complete your registration. This code is valid for 5 minutes.</p>
                        <div style="background: #f8fafc; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
                            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #F47920;">${otp}</span>
                        </div>
                        <p>If you didn't request this code, you can safely ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                        <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; ${new Date().getFullYear()} LedgerBandhu. All rights reserved.</p>
                    </div>
                `,
            });
            res.status(200).json({ message: "OTP sent successfully" });
        } catch (emailError) {
            console.error("Send OTP Email Error:", emailError.message);
            if (process.env.NODE_ENV !== 'production') {
                // In local dev, allow proceeding by using the OTP printed in the console
                return res.status(200).json({ message: "Email failed to send, but OTP logged in console (Local Dev)" });
            }
            return res.status(500).json({ message: "Failed to send OTP email. Please verify SMTP configuration." });
        }
    } catch (error) {
        console.error("Send OTP Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const register = async (req, res) => {
    try {
        const { name, email, password, role, phone, location, skills, companyName, companyDescription, otp, ...rest } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let resumeUrl = '';
        if (req.file) {
            resumeUrl = `/uploads/resumes/${req.file.filename}`;
        }

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "seeker",
            phone: phone || '',
            location: location || '',
            skills: skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [],
            companyName: companyName || '',
            companyDescription: companyDescription || '',
            resumeUrl,
        });

        // Save any extra dynamic fields into the extraFields map
        const coreFields = ['name', 'email', 'password', 'role', 'phone', 'location', 'skills', 'companyName', 'companyDescription', 'resume'];
        Object.keys(rest).forEach(key => {
            if (!coreFields.includes(key) && rest[key]) {
                newUser.extraFields.set(key, rest[key]);
            }
        });

        await newUser.save();

        // Generate Token
        const token = generateToken(newUser._id, newUser.role);
        res.cookie("jwt", token, getCookieOptions());

        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`[LOGIN DEBUG] User not found for email: ${email}`);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`[LOGIN DEBUG] Password mismatch for user: ${email}`);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id, user.role);
        res.cookie("jwt", token, getCookieOptions());

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { ...getCookieOptions(), maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { name, skills, companyName, companyDescription } = req.body;

        if (name) user.name = name;
        if (skills) user.skills = skills;
        if (companyName) user.companyName = companyName;
        if (companyDescription) user.companyDescription = companyDescription;

        // Handle resume upload if present
        if (req.file) {
            user.resumeUrl = `/uploads/resumes/${req.file.filename}`;
        } else if (req.body.resumeUrl !== undefined) {
            // Allow manual URL update or clearing if sent in body (without file)
            user.resumeUrl = req.body.resumeUrl;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            resumeUrl: updatedUser.resumeUrl,
            skills: updatedUser.skills,
            companyName: updatedUser.companyName,
            companyDescription: updatedUser.companyDescription,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ── FORGOT PASSWORD: Send OTP to existing user's email ──────────────────────
export const sendForgotOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No account found with this email' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.findOneAndUpdate(
            { email },
            { otp, createdAt: new Date() },
            { upsert: true, new: true }
        );

        if (process.env.NODE_ENV !== 'production') {
            console.log(`\n========================================`);
            console.log(`[LOCAL DEV] Forgot Password OTP for ${email}: ${otp}`);
            console.log(`========================================\n`);
        }

        try {
            await sendEmail({
                to: email,
                subject: 'Reset Your LedgerBandhu Password',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <h2 style="color: #F47920; text-align: center;">Reset Your Password</h2>
                        <p>Hello ${user.name},</p>
                        <p>We received a request to reset your LedgerBandhu password. Use the OTP below — it expires in <strong>5 minutes</strong>.</p>
                        <div style="background: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 24px 0;">
                            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #F47920;">${otp}</span>
                        </div>
                        <p>If you did not request a password reset, you can safely ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
                        <p style="font-size: 12px; color: #64748b; text-align: center;">&copy; ${new Date().getFullYear()} LedgerBandhu. All rights reserved.</p>
                    </div>
                `,
            });
            res.status(200).json({ message: 'OTP sent to your email' });
        } catch (emailError) {
            console.error('Forgot OTP Email Error:', emailError.message);
            if (process.env.NODE_ENV !== 'production') {
                return res.status(200).json({ message: 'Email failed but OTP logged in console (Local Dev)' });
            }
            return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
        }
    } catch (error) {
        console.error('sendForgotOTP Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ── RESET PASSWORD: Verify OTP and set new password ─────────────────────────
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword)
            return res.status(400).json({ message: 'Email, OTP, and new password are required' });

        // Find OTP record
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' });
        if (otpRecord.otp !== otp) return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });

        // Hash new password and save
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await User.findOneAndUpdate({ email }, { password: hashedPassword });

        // Delete used OTP
        await OTP.deleteOne({ email });

        res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
    } catch (error) {
        console.error('resetPassword Error:', error);
        res.status(500).json({ message: error.message });
    }
};
