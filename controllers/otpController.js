const User = require('../models/UserModel');
const transporter = require('../config/nodemailer'); // Import the transporter
const bcrypt = require('bcryptjs');

let otpStore = {}; // Temporary OTP storage

// Send OTP
const sendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('Email not found. Please create a new account.');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = { otp, expiresAt: Date.now() + 300000 };

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send('OTP sent to your email.');
    } catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).send('Error sending email.');
    }
};

// Verify OTP and Reset Password
const verifyOtp = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (otpStore[email] && otpStore[email].otp === otp && Date.now() < otpStore[email].expiresAt) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).send('User not found');
            }

            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            if (isSamePassword) {
                return res.status(400).send('New password cannot be the same as the old password');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();

            delete otpStore[email];
            res.status(200).send('Password reset successful.');
        } catch (error) {
            console.error('Error during password reset:', error);
            res.status(500).send('Error resetting password');
        }
    } else {
        res.status(400).send('Invalid or expired OTP');
    }
};

module.exports = { sendOtp, verifyOtp };
