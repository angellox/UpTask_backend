import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const checkAuth = async (req, res, next) => {

    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {

            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password -isConfirmed -token -createdAt -updatedAt -__v');

        } catch (error) {
            return res.status(404).json({ msg: 'An error has occurred' });
        }

        return next(); // The user has passed all required for logging
    }

    if(!token) {
        const error = new Error('Token is not valid');
        return res.status(401).json({ msg: error.message });
    }
    
}

export default checkAuth;