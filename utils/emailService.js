const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Generate password reset token
const generateResetToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: 'Password Reset Request',
        html: `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    generateResetToken,
    sendPasswordResetEmail
};