import * as errors from '../../errors/error_handler.js';
import { getNextPagination } from '../../utils/pagination.js';
import { getPurchaseOrders } from '../../db/queries/generated/purchasing.js';
import { formatTimestampUTC, transformToPatternQueryLike } from '../../utils/format.js';

/**
 * Handles GetListPurchaseOrders logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} query - The query params from the request.
 * @returns {Object} - Success message + data or error.
 */
export const getListPurchaseOrdersService = async (pool, user, query) => {
    let { purchaseOrderId, recordedDate, supplierName, limit, offset } = query;
    try {
        // Transform to pattern
        supplierName = transformToPatternQueryLike(supplierName);

        // Get list purchase orders from the database
        const result = await getPurchaseOrders(pool, {
            agency_id: user.userAgencyId,
            id: purchaseOrderId,
            recorded_at: recordedDate,
            supplier_name: supplierName,
            limit,
            offset
        });
        if (!result) {
            throw new errors.InternalError('Failed to get list purchase orders');
        }

        // Transform to return data
        let orderList = [];
        result.forEach(order => {
            orderList.push({
                purchaseOrderId: order.id,
                recordedTimestamp: formatTimestampUTC(order.recorded_at),
                supplierName: order.supplier_name
            });
        });

        return {
            message: 'Get list purchase orders successfully',
            data: {
                purchaseOrders: orderList,
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