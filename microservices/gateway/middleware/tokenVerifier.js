const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');

class TokenVerifier {
    verify(skipValidation = false) {
        return (req, res, next) => {
            const token = req.headers.authorization;
            if (!token) {
                if (!skipValidation) {
                    return res.status(401).json({message: 'No token provided'});
                }
                if (skipValidation) {
                    next();
                    return;
                }
            }
            jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        return res.status(401).json({message: 'Token expired'});
                    }
                    return res.status(401).json({message: 'Invalid token'});
                }
                req.user = decoded;
                next();
            });

        }
    }
}

module.exports = TokenVerifier;