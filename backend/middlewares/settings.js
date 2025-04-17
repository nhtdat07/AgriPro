import * as consts from "../consts/consts.js";

// Middleware to validate UpdateProfileAndSettings request data.
export const validateUpdateProfileAndSettingsData = (req, res, next) => {
    const { userProfile, settings } = req.body;

    if (!req.body || Object.keys(req.body).length === consts.ZERO_LENGTH) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: "At least one field must be provided for update" });
    }

    if (userProfile) {
        if (userProfile.phoneNumber && !consts.REGEX.PHONE.test(userProfile.phoneNumber)) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid phone number' });
        }

        if (userProfile.email && !consts.REGEX.EMAIL.test(userProfile.email)) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid email' });
        }
    }

    if (settings) {
        if (!Array.isArray(settings)) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid settings. Expected an array' });
        }

        for (let param of settings) {
            const { category, key, value } = param;

            if (!category) {
                return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing category in settings param' });
            }

            if (!key) {
                return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing key in settings param' });
            }

            if (!value) {
                return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing value in settings param' });
            }
        }
    }

    next();
};