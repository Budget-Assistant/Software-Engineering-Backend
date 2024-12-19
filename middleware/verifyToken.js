const jwt = require('jsonwebtoken');
const session = require('express-session');


const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming you send token in `Authorization: Bearer <token>`

    if (!token) {
        return res.status(403).json({ message: 'Token required' });
    }

    jwt.verify(token, process.env.JWT_TOKEN || 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = decoded; // Attach user data to the request
        next();
    });
};
module.exports = verifyToken;