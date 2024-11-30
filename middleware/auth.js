const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Make sure User is correctly imported
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    //const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer token
    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findByPk(decoded.id);
        if (!req.user) {
            return res.status(401).json({ error: 'User not found' });
        }
        next();
    } catch (error) {
        return res.status(400).json({ error: 'Invalid token' });
    }
};


module.exports = authMiddleware;
