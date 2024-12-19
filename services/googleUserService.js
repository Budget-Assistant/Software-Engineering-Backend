// services/googleUserService.js
const User = require('../models/UserModel'); // Ensure correct path to UserModel

const saveGoogleUser = async (profile) => {
    try {
        let user = await User.findOne({ email: profile.email });

        if (!user) {
            user = new User({
                email: profile.email,
                googleId: profile.id,
                name: profile.name,
            });

            await user.save();
            console.log('New Google user saved:', user);
        } else {
            console.log('User already exists:', user);
        }

        return user;
    } catch (error) {
        console.error('Error saving Google user:', error.message);
        throw new Error('Failed to save Google user');
    }
};

module.exports = { saveGoogleUser };
