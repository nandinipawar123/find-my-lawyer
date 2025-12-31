const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey_dev_only');

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', decoded.id)
                .maybeSingle();

            if (error || !profile) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            req.user = {
                id: profile.id,
                name: profile.full_name,
                phone: profile.phone,
                role: profile.role,
                isPhoneVerified: profile.is_phone_verified
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
