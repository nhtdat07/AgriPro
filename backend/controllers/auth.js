import { signUpService } from '../services/auth/sign_up.js';
import * as consts from '../consts/consts.js';
import { errorHandler } from '../errors/error_handler.js';

// Controller for handling user sign-up requests
export const signUpController = async (req, res) => {
    try {
        const result = await signUpService(req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.CREATED).json({ message: result.message });
        }
    } catch (error) {
        console.error('Sign-up error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};
