import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { markProductAsDeleted } from '../../db/queries/generated/products.js';

/**
 * Handles DeleteProduct logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} params - The request params.
 * @returns {Object} - Success message or error.
 */
export const deleteProductService = async (pool, user, params) => {
    try {
        // Mark product as deleted in the database
        const result = await markProductAsDeleted(pool, {
            agency_id: user.userAgencyId,
            id: params.productId
        });
        if (!result) {
            throw new errors.InternalError('Database failed to delete product');
        }
        if (result.length == consts.ZERO_LENGTH) {
            throw new errors.UndefinedError('Product not found');
        }

        return { message: 'Delete product successfully' };
    } catch (error) {
        if (error.statusCode) {
            return { error };
        }
        console.log(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};