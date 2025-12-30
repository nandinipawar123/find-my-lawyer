const jwt = require('jsonwebtoken');
const { eq } = require('drizzle-orm');
const { db, profiles } = require('../db');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey_dev_only');

            const [profile] = await db.select()
                .from(profiles)
                .where(eq(profiles.id, decoded.id))
                .limit(1);

            if (!profile) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = {
                id: profile.id,
                name: profile.fullName,
                phone: profile.phone,
                role: profile.role,
                isPhoneVerified: profile.isPhoneVerified
            };

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
