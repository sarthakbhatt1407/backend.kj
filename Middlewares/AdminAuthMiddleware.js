const jwt = require('jsonwebtoken');


const adminAuthenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_ADMIN_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

module.exports = adminAuthenticateToken;
