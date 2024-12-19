require('dotenv').config(); // Load environment variables
console.log(process.env.MONGODB_URI);
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');

const transporter = require('./config/nodemailer');
const TransactionRouter = require('./routes/TransactionRoute');
const UserRouter = require('./routes/UserRoute');
const authRouter = require('./routes/auth');
const CustomizedKindRouter = require('./routes/customizedKindRoute');
const otpRoutes = require('./routes/otpRoutes');
const passport = require('./config/passport');// Configure Passport
const verifyToken = require('./middleware/verifyToken');
const exportMongoToExcel = require('./exportMongoToExcel');
const app = express();
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to database..."))
    .catch(error => console.error("MongoDB connection error:", error));

app.use('/api/transactions', TransactionRouter);
app.use('/api/users', UserRouter);
app.use('/api/customized-kinds', CustomizedKindRouter);
app.use('/api', otpRoutes); // Add OTP routes

// Export MongoDB data to Excel
app.get('/export-excel/:user', async (req, res) => {
    const { user } = req.params;
    console.log(`server : ${user}`);

    try {
        const filePath = await exportMongoToExcel(user); // 產生 Excel 檔案的路徑

        // 傳送檔案給前端
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err.message);
                res.status(500).send('Failed to send the file.');
            } else {
                console.log('File sent successfully.');
            }
        });
    } catch (error) {
        console.error('Error exporting Excel:', error.message);
        res.status(500).send(error.message);
    }
});


// Express middleware
app.use(require('express-session')({ secret: 'your-secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRouter);

// Google OAuth2.0 savegoogleuser
const { saveGoogleUser } = require('./services/googleUserService');

// Use `verifyToken` middleware on protected routes
app.use('/add-transaction', verifyToken, (req, res) => {
    res.json({ message: 'Welcome to the transaction page!' });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
