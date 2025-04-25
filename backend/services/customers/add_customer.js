import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import * as dbUtils from '../../utils/db.js';
import { addCustomer } from '../../db/queries/generated/customers.js';
import { addNotification } from '../../db/queries/generated/notification.js';

/**
 * Handles AddCustomer logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} data - The data from the request body.
 * @returns {Object} - Success message or error.
 */
export const addCustomerService = async (pool, user, data) => {
    const { customerName, address, phoneNumber, email } = data;

    try {
        // Start DB transaction
        await dbUtils.startTransaction(pool);

        // Add customer to database
        let result = await addCustomer(pool, {
            agency_id: user.userAgencyId,
            name: customerName,
            address,
            phone: phoneNumber,
            email
        });
        if (!result) {
            throw new errors.InternalError('Database failed to add customer');
        }

        // Add notification of successfully recording customer
        result = await addNotification(pool, {
            agency_id: user.userAgencyId,
            category: consts.NOTI_TYPES.SUCCESSFULLY_RECORDED,
            content: `Đã ghi nhận thành công khách hàng mới!
Mã khách hàng: ${result[consts.FIRST_IDX_ARRAY].id}
Tên khách hàng: ${customerName}
Địa chỉ: ${address}
Số điện thoại: ${phoneNumber}`
        });
        if (!result) {
            throw new errors.InternalError('Database failed to add notification');
        }

        // Commit DB transaction
        await dbUtils.commitTransaction(pool);

        return { message: 'Add customer successfully' };
    } catch (error) {
        // Rollback DB transaction
        await dbUtils.rollbackTransaction(pool);

        if (error.statusCode) {
            return { error };
        }
        console.log(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};