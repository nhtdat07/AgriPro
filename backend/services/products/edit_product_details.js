import { updateProduct } from '../../db/queries/generated/products.js';
import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';

/**
 * Handles EditProductDetails logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} params - The request params.
 * @param {Object} data - The product data to be updated from the request body.
 * @returns {Object} - Success message or error.
 */
export const editProductDetailsService = async (pool, user, params, data) => {
    const {
        productName, brand, category, productionPlace, outPrice, usage, guideline, imagePath
    } = data;

    try {
        // Validate product category
        if (category && !consts.PRODUCT_TYPES.includes(category)) {
            throw new errors.ValidationError('Invalid product category');
        }

        // Update product details to database
        const result = await updateProduct(pool, {
            name: productName,
            brand,
            category,
            production_place: productionPlace,
            out_price: outPrice,
            usages: usage,
            guidelines: guideline,
            image_path: imagePath,
            agency_id: user.userAgencyId,
            id: params.productId
        })
        if (!result) {
            throw new errors.InternalError('Failed to update product details to the database');
        }
        if (result.length == consts.ZERO_LENGTH) {
            throw new errors.UndefinedError('Product not found');
        }

        return { message: 'Update product successfully' };
    } catch (error) {
        if (error.statusCode) {
            return { error };
        }
        console.error(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};