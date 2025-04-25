import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { markNotificationAsRead } from '../../db/queries/generated/notification.js';
import { formatTimestamp } from '../../utils/format.js';

/**
 * Handles ReadNotification logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} params - The request params.
 * @returns {Object} - Success message + notification details or error.
 */
export const readNotificationService = async (pool, user, params) => {
    try {
        // Mark the notification as read from database
        const result = await markNotificationAsRead(pool, {
            agency_id: user.userAgencyId,
            id: params.notificationId
        });
        if (!result) {
            throw new errors.InternalError('Failed to mark notification as read from the database');
        }
        if (result.length == consts.ZERO_LENGTH) {
            throw new errors.UndefinedError('Notification not found');
        }
        const notificationDetails = result[consts.FIRST_IDX_ARRAY];

        return {
            message: 'Read notification successfully',
            data: {
                notificationId: notificationDetails.id,
                category: notificationDetails.category,
                timestamp: formatTimestamp(notificationDetails.timestamp),
                content: notificationDetails.content
            }
        };
    } catch (error) {
        if (error.statusCode) {
            return { error };
        }
        console.log(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};