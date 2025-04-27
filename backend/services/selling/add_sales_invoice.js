import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import * as dbUtils from '../../utils/db.js';
import { formatTimestamp } from '../../utils/format.js';
import { addNotification } from '../../db/queries/generated/notification.js';
import { addProductForSalesInvoice, addSalesInvoice, updateInventory } from '../../db/queries/generated/selling.js';

/**
 * Handles AddSalesInvoice logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} data - The data from the request body.
 * @returns {Object} - Success message or error.
 */
export const addSalesInvoiceService = async (pool, user, data) => {
    const { customerId, products } = data;
    const agencyId = user.userAgencyId;

    try {
        // Start DB transaction
        await dbUtils.startTransaction(pool);

        let totalPayment = consts.DEFAULT_TOTAL_PAYMENT;
        let result;
        let timestamp = formatTimestamp(new Date());
        let updatedProducts = [];

        for (const product of products) {
            const { productId, quantity, outPrice } = product;

            // Update inventory with sold products
            result = await updateInventory(pool, {
                agency_id: agencyId,
                product_id: productId,
                quantity
            });
            if (!result) {
                throw new errors.InternalError(`Database failed to update inventory with product ${productId}`);
            }

            // Calculate total payment
            totalPayment += quantity * outPrice;

            updatedProducts.push(...result);
        }

        // Add sales invoice to the database
        result = await addSalesInvoice(pool, {
            agency_id: agencyId,
            customer_id: customerId,
            recorded_at: timestamp,
            total_payment: totalPayment
        });
        if (!result) {
            throw new errors.InternalError('Database failed to add sales invoice');
        }

        // Add products for sales invoice
        const salesInvoiceId = result[consts.FIRST_IDX_ARRAY].id;
        for (const product of updatedProducts) {
            const targetProduct = products.find(requestProduct => requestProduct.productId === product.product_id);

            result = await addProductForSalesInvoice(pool, {
                agency_id: agencyId,
                invoice_id: salesInvoiceId,
                product_id: product.product_id,
                quantity: product.subtract_qty,
                price: targetProduct.outPrice,
                imported_timestamp: product.imported_timestamp
            })
            if (!result) {
                throw new errors.InternalError(`
                    Database failed to add product ${product.productId} for sales invoice ${salesInvoiceId}
                `);
            }
        }

        // Add notification of successfully recording sales invoice
        result = await addNotification(pool, {
            agency_id: agencyId,
            category: consts.NOTI_TYPES.SUCCESSFULLY_RECORDED,
            content: `Đã ghi nhận thành công hoá đơn bán hàng mới!
Mã hoá đơn bán hàng: ${salesInvoiceId}
Mã khách hàng: ${customerId}
Thời gian ghi nhận: ${timestamp}`
        });
        if (!result) {
            throw new errors.InternalError('Database failed to add notification');
        }

        // Commit DB transaction
        await dbUtils.commitTransaction(pool);

        return { message: 'Add sales invoice successfully' };
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