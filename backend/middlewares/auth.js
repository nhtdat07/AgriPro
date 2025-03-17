import * as consts from "../consts/consts.js";

// Middleware to validate sign-up request data.
export const validateSignUpData = (req, res, next) => {
    const { agencyName, ownerName, email, _, password } = req.body;

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