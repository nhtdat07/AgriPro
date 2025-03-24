import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { getProducts } from '../../db/queries/generated/products.js';
import { getNextPagination } from '../../utils/pagination.js';
import { transformToPatternQueryLike } from '../../utils/format.js';

/**
 * Handles GetListProducts logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} query - The query params from the request.
 * @returns {Object} - Success message + data or error.
 */
export const getListProductsService = async (pool, user, query) => {
    let { productId, category, usage, limit, offset } = query;
    try {
        // Validate product category
        if (category && !consts.PRODUCT_TYPES.includes(category)) {
            return { error: new errors.ValidationError('Invalid product category') };
        }

        // Transform usage to pattern
        usage = transformToPatternQueryLike(usage);

        // Get list products from the database
        const result = await getProducts(pool, {
            agency_id: user.userAgencyId,
            id: productId,
            category,
            usages: usage,
            limit,
            offset
        });
        if (!result) {
            return { error: new errors.InternalError('Failed to get list products') };
        }

        // Transform to return data
        let productList = [];
        result.forEach(product => {
            productList.push({
                productId: product.id,
                productName: product.name,
                imagePath: product.image_path,
                category: product.category,
                outPrice: product.out_price
            });
        });

        return {
            message: 'Get list products successfully',
            data: {
                products: productList,
                pagination: getNextPagination(limit, offset, result.length)
            }
        };
    } catch (error) {
        console.log(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};