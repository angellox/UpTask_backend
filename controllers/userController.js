import User from '../models/User.js';
import generateId from '../helpers/generateId.js';
import generateJWT from '../helpers/generateJWT.js';
import { emailShipping, emailForgotPass } from '../helpers/email.js';

const register = async (req, res) => {
    // Avoiding duplicated records
    const { email } = req.body;
    const isUser = await User.findOne({ email }); // email (db) : email (req.body)

    if(isUser) {
        const error = new Error('User is already registered');
        return res.status(400).json({ msg: error.message });
    }

    try {
        const user = new User(req.body);
        user.token = generateId();
        await user.save();

        // Sending email to confirm
        emailShipping({
            email: user.email,
            fullName: user.fullName,
            token: user.token
        });

        res.json({ msg: 'Account\'s been created successfully. Check your email' });
    } catch (error) {
        console.log(error);
    }

};

const authenticate = async (req, res) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Check if user exists
    if(!user) {
        const error = new Error('User does not exist. Create an account');
        return res.status(404).json({ msg: error.message });
    }

    // Check if user has confirmed its account
    if(!user.isConfirmed) {
        const error = new Error('Your account has not been confirmed yet');
        return res.status(403).json({ msg: error.message });
    }

    // Check for password
    if( await user.isPasswordValid(password)) {
        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            token: generateJWT(user._id)
        })
    } else {
        const error = new Error('Password is not valid');
        return res.status(404).json({ msg: error.message });
    }
};

const checkAccount = async (req, res) => {
    const { token } = req.params;
    const checkUser = await User.findOne({ token });

    if(!checkUser) {
        const error = new Error('Token is not valid');
        return res.status(403).json({ msg: error.message });
    }

    try {
        checkUser.isConfirmed = true;
        checkUser.token = '';
        await checkUser.save();

        res.json({ msg: 'Your account has been confirmed successfully!' });
    } catch (error) {
        console.log(error);
    }
}

const forgottenPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Check if user exists
    if(!user) {
        const error = new Error('User does not exist. Create an account');
        return res.status(404).json({ msg: error.message });
    }

    try {
        user.token = generateId();
        await user.save();

        // Sending email
        emailForgotPass({
            email: user.email,
            fullName: user.fullName,
            token: user.token
        });

        res.json({ msg: 'We have sent to you an email with the next steps.' });
    } catch (error) {
        console.log(error);
    }
}

const checkToken = async (req, res) => {
    const { token } = req.params;
    const userValid = await User.findOne({ token });
    
    if(userValid) {
        res.json({ msg: 'Token is valid' })
    } else {
        const error = new Error('Token is not valid');
        return res.status(403).json({ msg: error.message });
    }
};

const setNewPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ token });
    
    if(user) {
        user.password = password;
        user.token = '';
        try {
            await user.save();
            res.json({ msg: 'Password has changed successfully' }); 
        } catch (error) {
            console.log(error);
        }
    } else {
        const error = new Error('Token is not valid');
        return res.status(403).json({ msg: error.message });
    }
};

const account = async (req, res) => {
    const { user } = req;
    res.json(user);
}


export {
    register,
    authenticate,
    checkAccount,
    forgottenPassword,
    checkToken,
    setNewPassword,
    account
}