const jwt = require('jsonwebtoken');

const methods = {
    async requireAuth(req, res, next)
    {
        try
        {
            if (!req.headers.authorization) return res.status(401).json({
                message: 'Unauthorization'
            });
            const token = (req.headers.authorization.includes(" ")) ? req.headers.authorization.split(" ")[1] : req.headers.authorization;
            const user = jwt.verify(token, process.env.JWT_SECRET);
            req.user = user;
            next();
        } catch (error)
        {
            return res.status(400).json({
                message: error.message
            });
        }
    }
};

module.exports = methods;