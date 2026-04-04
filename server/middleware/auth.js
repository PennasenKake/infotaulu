
const jwt = require('jsonwebtoken');

const authenticate =(req, res, next) => {
    const autHeader = req.headers['authorization'];
    const token = autHeader && autHeader.split(' ')[1];  
    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, uset) =>{
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = user;
        next();
    })
}

module.exports = { authenticate };