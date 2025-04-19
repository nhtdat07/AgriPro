import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
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
        let totalPayment = consts.DEFAULT_TOTAL_PAYMENT;
        let result;
        let timestamp = formatTimestamp(new Date());

        for (const product of products) {
            const { productId, quantity, outPrice } = product;

            // Update inventory with sold products
            result = await updateInventory(pool, {
                agency_id: agencyId,
                product_id: productId,
                quantity
            });
            if (!result) {
                return { error: new errors.InternalError(`Database failed to update inventory with product ${productId}`) };
            }

            // Calculate total payment
            totalPayment += quantity * outPrice;
        }

        // Add sales invoice to the database
        result = await addSalesInvoice(pool, {
            agency_id: agencyId,
            customer_id: customerId,
            recorded_at: timestamp,
            total_payment: totalPayment
        });
        if (!result) {
            return { error: new errors.InternalError('Database failed to add sales invoice') };
        }

        // Add products for sales invoice
        const salesInvoiceId = result[consts.FIRST_IDX_ARRAY].id;
        for (const product of products) {
            result = await addProductForSalesInvoice(pool, {
                agency_id: agencyId,
                invoice_id: salesInvoiceId,
                product_id: product.productId,
                quantity: product.quantity,
                price: product.outPrice
            })
            if (!result) {
                return {
                    error: new errors.InternalError(`
                        Database failed to add product ${product.productId} for sales invoice ${salesInvoiceId}
                    `)
                };
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
            return { error: new errors.InternalError('Database failed to add notification') };
        }

        return { message: 'Add sales invoice successfully' };
    } catch (error) {
        console.log(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};