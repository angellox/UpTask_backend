import express from 'express';
import { 
    register, 
    authenticate, 
    checkAccount, 
    forgottenPassword, 
    checkToken, 
    setNewPassword,
    account
} from '../controllers/userController.js';

import checkAuth from '../middlewares/checkAuth.js';

const router = express.Router();

// Routes for authentication, creating and confirming users
// Public routes
router.post('/', register);
router.post('/login', authenticate);
router.get('/confirm/:token', checkAccount);
router.post('/forgotten-password', forgottenPassword);
router.route('/forgotten-password/:token').get(checkToken).post(setNewPassword);

// Private Routes
router.get('/account', checkAuth, account);

export default router;