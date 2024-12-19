const jwt = require('jsonwebtoken');

const generateJwt = (user) => {
    const secretKey = process.env.JWT_TOKEN || 'your_jwt_secret';

    const payload = {
        userId: user._id,
        email: user.email,
    };

    const options = {
        expiresIn: '1h', // Token expiration
    };

    return jwt.sign(payload, secretKey, options);
};

module.exports = { generateJwt };
