import { getProductById, getProductQuantityInInventory } from "../../db/queries/generated/products.js";
import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';

/**
 * Handles GetProductDetails logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} params - The request params.
 * @returns {Object} - Success message + product details or error.
 */
export const getProductDetailsService = async (pool, user, params) => {
    try {
        // Get product details from database
        let result = await getProductById(pool, {
            agency_id: user.userAgencyId,
            id: params.productId
        });
        if (!result) {
            return { error: new errors.InternalError('Failed to get product details from the database') };
        }
        if (result.length == consts.ZERO_LENGTH || result[consts.FIRST_IDX_ARRAY].is_deleted) {
            return { error: new errors.UndefinedError('Product not found') };
        }
        const productDetails = result[consts.FIRST_IDX_ARRAY];

        // Get product quantity in inventory
        result = await getProductQuantityInInventory(pool, {
            agency_id: user.userAgencyId,
            id: params.productId
        });
        if (!result || result.length == consts.ZERO_LENGTH) {
            return { error: new errors.InternalError('Failed to get product quantity from the database') };
        }

        // Convert quantity to int
        const quantity = parseInt(result[consts.FIRST_IDX_ARRAY].total_quantity, consts.DECIMAL_BASE);
        if (isNaN(quantity)) {
            return { error: new errors.InternalError('Failed to convert quantity to int') };
        }

        return {
            message: 'Get product details successfully',
            data: {
                productId: productDetails.id,
                productName: productDetails.name,
                brand: productDetails.brand,
                category: productDetails.category,
                productionPlace: productDetails.production_place,
                outPrice: productDetails.out_price,
                usage: productDetails.usages,
                guideline: productDetails.guidelines,
                imagePath: productDetails.image_path || consts.EMPTY_STRING,
                availableQuantity: quantity
            }
        };
    } catch (error) {
        console.log(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};