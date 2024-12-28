const jwt = require('jsonwebtoken');
const User = require('../modele/user'); // Adjust path as needed

const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('_id username email');
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = authenticateUser;
