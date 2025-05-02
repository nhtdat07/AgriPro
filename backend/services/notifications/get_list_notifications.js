import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { getNextPagination } from '../../utils/pagination.js';
import { getNotifications } from '../../db/queries/generated/notification.js';
import { formatTimestamp } from '../../utils/format.js';

/**
 * Handles GetListNotifications logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} query - The query params from the request.
 * @returns {Object} - Success message + data or error.
 */
export const getListNotificationsService = async (pool, user, query) => {
    let { limit, offset } = query;
    try {
        // Get list notifications from the database
        const result = await getNotifications(pool, {
            agency_id: user.userAgencyId,
            limit,
            offset
        });
        if (!result) {
            throw new errors.InternalError('Failed to get list notifications');
        }

        // Transform to return data
        let notificationList = [];
        let hasUnreadNotification = false;
        if (result.length > consts.ZERO_LENGTH) {
            hasUnreadNotification = result[consts.FIRST_IDX_ARRAY].all_read;
        }
        result.forEach(notification => {
            notificationList.push({
                notificationId: notification.id,
                category: notification.category,
                timestamp: formatTimestamp(notification.timestamp),
                isRead: notification.is_read
            });
        });

        return {
            message: 'Get list notifications successfully',
            data: {
                notifications: notificationList,
                hasUnreadNotification,
                pagination: getNextPagination(limit, offset, result.length)
            }
        };
    } catch (error) {
        if (error.statusCode) {
            return { error };
        }
        console.error(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};