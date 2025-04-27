import { addProduct } from '../../db/queries/generated/products.js';
import { addNotification } from '../../db/queries/generated/notification.js';
import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import * as dbUtils from '../../utils/db.js';

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
        // Start DB transaction
        await dbUtils.startTransaction(pool);

        // Validate product category
        if (!consts.PRODUCT_TYPES.includes(category)) {
            throw new errors.ValidationError('Invalid product category');
        }

        // Add product to database
        let result = await addProduct(pool, {
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
            throw new errors.InternalError('Database failed to add product');
        }

        // Add notification of successfully recording product
        result = await addNotification(pool, {
            agency_id: user.userAgencyId,
            category: consts.NOTI_TYPES.SUCCESSFULLY_RECORDED,
            content: `Đã ghi nhận thành công sản phẩm mới!
Mã sản phẩm: ${result[consts.FIRST_IDX_ARRAY].id}
Tên sản phẩm: ${productName}
Loại sản phẩm: ${category}
Nơi sản xuất: ${productionPlace}`
        });
        if (!result) {
            throw new errors.InternalError('Database failed to add notification');
        }

        // Commit DB transaction
        await dbUtils.commitTransaction(pool);

        return { message: 'Add product successfully' };
    } catch (error) {
        // Rollback DB transaction
        await dbUtils.rollbackTransaction(pool);

        if (error.statusCode) {
            return { error };
        }
        console.error(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};