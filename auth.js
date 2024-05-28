const jwt = require('jsonwebtoken');
function ensureToken(req, res, next) {
    const token = req.headers['authorization'];
    if (typeof token !== 'undefined') {
        jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.token = token;
                req.userData = data;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
}

module.exports = ensureToken;