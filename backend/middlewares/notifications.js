import * as consts from "../consts/consts.js";

// Middleware to validate ReadNotification request data.
export const validateReadNotificationData = (req, res, next) => {
    const { notificationId } = req.params;

    if (!notificationId) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing notification ID' });
    }

    next();
};