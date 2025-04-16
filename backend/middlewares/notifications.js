import * as consts from "../consts/consts.js";

// Middleware to validate GetListNotifications request data.
export const validateGetListNotificationsData = (req, res, next) => {
    let { limit, offset } = req.query;

    if (limit) {
        limit = parseInt(limit, consts.DECIMAL_BASE);
        if (!Number.isInteger(limit) || limit < consts.MIN_LIMIT) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid limit' });
        }
    }

    if (offset) {
        offset = parseInt(offset, consts.DECIMAL_BASE);
        if (!Number.isInteger(offset) || offset < consts.MIN_OFFSET) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid offset' });
        }
    }

    req.query.limit = limit || consts.DEFAULT_LIMIT;
    req.query.offset = offset || consts.DEFAULT_OFFSET;

    next();
};

// Middleware to validate ReadNotification request data.
export const validateReadNotificationData = (req, res, next) => {
    const { notificationId } = req.params;

    if (!notificationId) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing notification ID' });
    }

    next();
};