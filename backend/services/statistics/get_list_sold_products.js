import * as errors from '../../errors/error_handler.js';
import { getNextPagination } from '../../utils/pagination.js';
import { getSoldProducts } from '../../db/queries/generated/statistics.js';
import { transformToPatternQueryLike } from '../../utils/format.js';

/**
 * Handles GetListSoldProducts logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} query - The query params from the request.
 * @returns {Object} - Success message + data or error.
 */
export const getListSoldProductsService = async (pool, user, query) => {
    let { startDate, endDate, productName, limit, offset } = query;
    try {
        // Transform to pattern
        productName = transformToPatternQueryLike(productName);

        // Get list sold products from the database
        const result = await getSoldProducts(pool, {
            agency_id: user.userAgencyId,
            name: productName,
            start_date: startDate,
            end_date: endDate,
            limit,
            offset
        });
        if (!result) {
            throw new errors.InternalError('Failed to get list sold products');
        }

        // Transform to return data
        let productList = [];
        result.forEach(product => {
            productList.push({
                productId: product.product_id,
                productName: product.product_name,
                soldQuantity: product.sold_quantity
            });
        });

        return {
            message: 'Get list sold products successfully',
            data: {
                products: productList,
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