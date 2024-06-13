const jwt = require('jsonwebtoken');

const JWT_SECRET = 'newtonslawofmotion';

const fetchuser = (req, res, next) => {
    // Get user details from JWT token
    const token = req.header('auth_token');
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    // Verifies the token and retrieves user's data
    try {
        const data = jwt.verify(token, JWT_SECRET);
        if (!data.user) {
            return res.status(401).send('Invalid token: No user data.');
        }
        req.user = data.user;
        next();
    } catch (error) {
        console.error(`Token verification error: ${error.message}`);

        if (error.name === 'JsonWebTokenError') {
            // This will catch invalid token format or corrupted token errors
            return res.status(400).send('Invalid token format.');
        } else if (error.name === 'TokenExpiredError') {
            // This will catch token expiration errors
            return res.status(401).send('Token has expired.');
        } else {
            // This will catch any other errors
            return res.status(500).send('Internal Server Error.');
        }
    }
};

module.exports = fetchuser;
