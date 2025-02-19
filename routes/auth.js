const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const { generateJwt } = require('../config/jwt'); // Reuse the modular JWT function
const router = express.Router();
const passport = require('passport');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//Root route for the homepage
router.get('/', (req, res) => res.send('<a href="/auth/google">Login with Google</a>'));

// Google login route using token from the client
router.post('/google', async (req, res) => {
    const { token } = req.body;

    try {
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { sub: googleId, email, name } = ticket.getPayload();

        // Check if the user already exists in the database
        let user = await User.findOne({ googleId });
        if (!user) {
            user = new User({ googleId, email, name });
            await user.save();
        }

        // Generate JWT
        const jwtToken = generateJwt(user);

        res.json({ success: true, token: jwtToken });
    } catch (err) {
        console.error('Error during Google token verification:', err);
        res.status(401).json({ success: false, message: 'Invalid Google token' });
    }
});

// Google login route using Passport
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        try {
            const { token } = req.user; // Extract token generated by Passport strategy
            res.redirect(`https://budget-assistant-frontend.onrender.com/login?token=${token}`);
        } catch (error) {
            console.error('Error during Google login callback:', error);
            res.status(500).send('Something went wrong during Google authentication.');
        }
    }
);

module.exports = router;
