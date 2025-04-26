import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import * as dbUtils from '../../utils/db.js';
import { addSupplier } from '../../db/queries/generated/suppliers.js';
import { addNotification } from '../../db/queries/generated/notification.js';

/**
 * Handles AddSupplier logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} data - The data from the request body.
 * @returns {Object} - Success message or error.
 */
export const addSupplierService = async (pool, user, data) => {
    const { supplierName, address, phoneNumber, email } = data;

    try {
        // Start DB transaction
        await dbUtils.startTransaction(pool);

        // Add supplier to database
        let result = await addSupplier(pool, {
            agency_id: user.userAgencyId,
            name: supplierName,
            address,
            phone: phoneNumber,
            email
        })
        if (!result) {
            throw new errors.InternalError('Database failed to add supplier');
        }

        // Add notification of successfully recording product
        result = await addNotification(pool, {
            agency_id: user.userAgencyId,
            category: consts.NOTI_TYPES.SUCCESSFULLY_RECORDED,
            content: `Đã ghi nhận thành công nhà cung cấp mới!
Mã nhà cung cấp: ${result[consts.FIRST_IDX_ARRAY].id}
Tên nhà cung cấp: ${supplierName}
Địa chỉ: ${address}
Số điện thoại: ${phoneNumber}`
        });
        if (!result) {
            throw new errors.InternalError('Database failed to add notification');
        }

        // Commit DB transaction
        await dbUtils.commitTransaction(pool);

        return { message: 'Add supplier successfully' };
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