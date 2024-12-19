const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',  // or another email service like SendGrid
    auth: {
        user: process.env.EMAIL_USER,  // your email address
        pass: process.env.EMAIL_PASS,  // your email password
    },
});

module.exports = transporter;
