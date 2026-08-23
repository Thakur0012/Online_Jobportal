import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async ({ to, subject, html }) => {
    try {
        // --- DEVELOPMENT FALLBACK REMOVED FOR PRODUCTION TESTING ---
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error("SMTP Credentials missing!");
            return { error: 'Missing credentials' };
        }
        // ---------------------------

        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'Ledger Bandhu'}" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
