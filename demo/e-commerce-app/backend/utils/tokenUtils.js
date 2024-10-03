import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';

// Utility to genereate a JWT token
export const generateToken = (id) => {
    return jsonwebtoken.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h'});
}


export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        req.user = user;
        next();
    })
}