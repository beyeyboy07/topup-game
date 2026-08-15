import jwt from 'jsonwebtoken';


export const authenticate = (req, res, next) => {

    console.log('=== AUTH MIDDLEWARE DIPANGGIL ===');

    try {

        const authHeader = req.headers.authorization;

        console.log('AUTH HEADER:', authHeader);

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token required'
            });
        }

        const [type, token] = authHeader.split(' ');

        console.log('TYPE:', type);
        console.log('TOKEN:', token);

        if (type !== 'Bearer' || !token) {
            return res.status(401).json({
                success: false,
                message: 'Invalid authorization format'
            });
        }

        console.log('JWT SECRET:', process.env.JWT_SECRET);

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log('DECODED:', decoded);

        req.user = decoded;

        next();

    } catch (error) {

        console.error('JWT ERROR:', error.name);
        console.error('JWT MESSAGE:', error.message);

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};