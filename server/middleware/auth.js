const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {     
    const authHeader = req.headers['authorization'];   
    const token = authHeader && authHeader.split(' ')[1];  

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - Token puuttuu' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {  
        if (err) {
            return res.status(403).json({ error: 'Forbidden - Token virheellinen tai vanhentunut' });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticate };   // 