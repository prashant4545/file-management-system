const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, 'a55efbb9f5e6bfe5c2c69d9cff9f3f9e66ad4d1f0ef2f6dde36acd53676fd245cad97c3e4a01821c25c2b419fbe25592765a1cde0bca5144af550c66d5d93a17');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
