import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { getNextPagination } from '../../utils/pagination.js';
import { formatTimestampUTC } from '../../utils/format.js';
import { getInventory } from '../../db/queries/generated/inventory.js';
import { getLastExpiredDateWarning, getMaxQuantityWarning } from '../../utils/config.js';

/**
 * Handles GetListInventory logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} query - The query params from the request.
 * @returns {Object} - Success message + data or error.
 */
export const getListInventoryService = async (pool, user, query) => {
    let { productId, importDate, expiredDate, isAboutToExpire, isAboutToBeOutOfStock, limit, offset } = query;
    try {
        const userAgencyId = user.userAgencyId;
        let lastExpiredDateWarning;
        let maxQuantityWarning;

        if (isAboutToExpire) {
            lastExpiredDateWarning = await getLastExpiredDateWarning(pool, userAgencyId);
        }

        if (isAboutToBeOutOfStock) {
            maxQuantityWarning = await getMaxQuantityWarning(pool, userAgencyId);
        }

        const result = await getInventory(pool, {
            agency_id: userAgencyId,
            product_id: productId,
            imported_date: importDate,
            expired_date: expiredDate,
            warning_expired: lastExpiredDateWarning,
            warning_out_of_stock: maxQuantityWarning,
            limit,
            offset
        });
        if (!result) {
            throw new errors.InternalError('Database failed to get inventory');
        }

        // Transform to return data
        let inventoryList = [];
        result.forEach(product => {
            inventoryList.push({
                productId: product.product_id,
                productName: product.product_name,
                quantity: product.quantity,
                importDate: formatTimestampUTC(product.imported_timestamp).split(consts.SPACE)[consts.FIRST_IDX_ARRAY],
                expiredDate: formatTimestampUTC(product.expired_date).split(consts.SPACE)[consts.FIRST_IDX_ARRAY],
                inPrice: product.in_price
            });
        });

        return {
            message: 'Get list inventory successfully',
            data: {
                inventory: inventoryList,
                pagination: getNextPagination(limit, offset, result.length)
            }
        };
    } catch (error) {
        if (error.statusCode) {
            return { error };
        }
        console.error(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};
