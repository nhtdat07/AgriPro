import { signUpService } from '../services/auth/sign_up.js';
import { signInService } from '../services/auth/sign_in.js';
import * as consts from '../consts/consts.js';
import { errorHandler } from '../errors/error_handler.js';
import { pool } from '../db.js';
import { handleForgottenPasswordService } from '../services/auth/handle_forgotten_password.js';
import { verifyOtpService } from '../services/auth/verify_otp.js';
import { resetPasswordService } from '../services/auth/reset_password.js';

// Controller for handling user sign-up requests
export const signUpController = async (req, res) => {
    try {
        const result = await signUpService(pool, req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.CREATED).json({ message: result.message });
        }
    } catch (error) {
        console.error('SignUp error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user sign-in requests
export const signInController = async (req, res) => {
    try {
        const result = await signInService(pool, req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({
                message: result.message,
                data: result.data
            });
        }
    } catch (error) {
        console.error('SignIn error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user HandleForgottenPassword requests
export const handleForgottenPasswordController = async (req, res) => {
    try {
        const result = await handleForgottenPasswordService(pool, req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({ message: result.message });
        }
    } catch (error) {
        console.error('HandleForgottenPassword error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user VerifyOtp requests
export const verifyOtpController = async (req, res) => {
    try {
        const result = await verifyOtpService(req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({
                message: result.message,
                data: result.data
            });
        }
    } catch (error) {
        console.error('VerifyOtp error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user ResetPassword requests
export const resetPasswordController = async (req, res) => {
    try {
        const result = await resetPasswordService(pool, req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({ message: result.message });
        }
    } catch (error) {
        console.error('ResetPassword error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};