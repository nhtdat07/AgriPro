import * as consts from "../consts/consts.js";

// Middleware to validate sign-up request data.
export const validateSignUpData = (req, res, next) => {
    const { agencyName, ownerName, email, phone, password } = req.body;

    if (!agencyName || !ownerName || !email || !password) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing required fields' });
    }

    next();
};