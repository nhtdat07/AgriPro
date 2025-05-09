import * as consts from "../consts/consts.js";

// Middleware to validate sign-up request data.
export const validateSignUpData = (req, res, next) => {
    const { agencyName, ownerName, email, password } = req.body;

    if (!agencyName) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing agency name' });
    }

    if (!ownerName) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing owner name' });
    }

    if (!email) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing email' });
    }

    if (!password) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing password' });
    }

    next();
};

// Middleware to validate sign-in request data.
export const validateSignInData = (req, res, next) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing email' });
    }

    if (!password) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing password' });
    }

    next();
};

// Middleware to validate HandleForgottenPassword request data.
export const validateHandleForgottenPasswordData = (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing email' });
    }

    next();
};

// Middleware to validate VerifyOtp request data.
export const validateVerifyOtpData = (req, res, next) => {
    const { email, inputOtp } = req.body;

    if (!email) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing email' });
    }

    if (!inputOtp) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing input OTP' });
    }
    if (!consts.REGEX.OTP.test(inputOtp)) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid input OTP' });
    }

    next();
};

// Middleware to validate ResetPassword request data.
export const validateResetPasswordData = (req, res, next) => {
    const { email, resetToken, newPassword } = req.body;

    if (!email) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing email' });
    }

    if (!resetToken) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing reset token' });
    }

    if (!newPassword) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing new password' });
    }

    next();
}; 