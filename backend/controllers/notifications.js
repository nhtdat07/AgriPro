import * as consts from '../consts/consts.js';
import { errorHandler } from '../errors/error_handler.js';
import { pool } from '../db.js';
import { readNotificationService } from '../services/notifications/read_notification.js';

// Controller for handling user ReadNotification requests
export const readNotificationController = async (req, res) => {
    try {
        const result = await readNotificationService(pool, req.user, req.params);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({
                message: result.message,
                data: result.data
            });
        }
    } catch (error) {
        console.error('ReadNotification error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};