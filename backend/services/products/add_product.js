import { addProduct } from '../../db/queries/generated/products.js';
import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';

/**
 * Handles AddProduct logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} data - The data from the request body.
 * @returns {Object} - Success message or error.
 */
export const addProductService = async (pool, user, data) => {
    const {
        productName, brand, category, productionPlace, outPrice, usage, guideline, imagePath
    } = data;

    try {
        // Validate product category
        if (!consts.PRODUCT_TYPES.includes(category)) {
            return { error: new errors.ValidationError('Invalid product category') };
        }

        // Add product to database
        const result = await addProduct(pool, {
            agency_id: user.userAgencyId,
            name: productName,
            brand,
            category,
            out_price: outPrice,
            production_place: productionPlace,
            usages: usage,
            guidelines: guideline,
            image_path: imagePath
        });

        if (!result) {
            return { error: new errors.InternalError('Database failed to add product') };
        }

        return { message: 'Add product successfully' };
    } catch (error) {
        console.log(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};