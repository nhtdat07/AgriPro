import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import * as dbUtils from '../../utils/db.js';
import { formatTimestamp } from '../../utils/format.js';
import { addInventory, addProductForPurchaseOrder, addPurchaseOrder } from '../../db/queries/generated/purchasing.js';
import { addNotification } from '../../db/queries/generated/notification.js';

/**
 * Handles AddPurchaseOrder logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} data - The data from the request body.
 * @returns {Object} - Success message or error.
 */
export const addPurchaseOrderService = async (pool, user, data) => {
    const { supplierId, products } = data;
    const agencyId = user.userAgencyId;

    try {
        // Start DB transaction
        await dbUtils.startTransaction(pool);

        let totalPayment = consts.DEFAULT_TOTAL_PAYMENT;
        let result;
        const timestamp = formatTimestamp(new Date());

        for (const product of products) {
            const { productId, expiredDate, quantity, inPrice } = product;

            // Update inventory with imported products
            result = await addInventory(pool, {
                agency_id: agencyId,
                product_id: productId,
                quantity,
                imported_timestamp: timestamp,
                expired_date: expiredDate,
                in_price: inPrice
            });
            if (!result) {
                throw new errors.InternalError(`Database failed to update inventory with product ${productId}`);
            }

            // Calculate total payment
            totalPayment += quantity * inPrice;
        }

        // Add purchase order to the database
        result = await addPurchaseOrder(pool, {
            agency_id: agencyId,
            supplier_id: supplierId,
            recorded_at: timestamp,
            total_payment: totalPayment
        });
        if (!result) {
            throw new errors.InternalError('Database failed to add purchase order');
        }

        // Add products for purchase order
        const purchaseOrderId = result[consts.FIRST_IDX_ARRAY].id;
        for (const product of products) {
            result = await addProductForPurchaseOrder(pool, {
                agency_id: agencyId,
                order_id: purchaseOrderId,
                product_id: product.productId,
                quantity: product.quantity,
                price: product.inPrice
            })
            if (!result) {
                throw new errors.InternalError(`
                    Database failed to add product ${product.productId} for purchase order ${purchaseOrderId}
                `);
            }
        }

        // Add notification of successfully recording purchase order
        result = await addNotification(pool, {
            agency_id: agencyId,
            category: consts.NOTI_TYPES.SUCCESSFULLY_RECORDED,
            content: `Đã ghi nhận thành công đơn mua hàng mới!
Mã đơn mua hàng: ${purchaseOrderId}
Mã nhà cung cấp: ${supplierId}
Thời gian ghi nhận: ${timestamp}`
        });
        if (!result) {
            throw new errors.InternalError('Database failed to add notification');
        }

        // Commit DB transaction
        await dbUtils.commitTransaction(pool);

        return { message: 'Add purchase order successfully' };
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