const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String, // Keep it optional for users who log in via Google
        required: false,
    },
    googleId: {
        type: String, // Store Google account ID for Google-authenticated users
        required: false,
    },
    username: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model('User', userSchema);
