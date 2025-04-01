import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { formatTimestamp } from '../../utils/format.js';
import { addInventory, addProductForPurchaseOrder, addPurchaseOrder } from '../../db/queries/generated/purchasing.js';

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
                return { error: new errors.InternalError(`Database failed to update inventory with product ${productId}`) };
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
            return { error: new errors.InternalError('Database failed to add purchase order') };
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
                return {
                    error: new errors.InternalError(`
                        Database failed to add product ${product.productId} for purchase order ${purchaseOrderId}
                    `)
                };
            }
        }

        return { message: 'Add purchase order successfully' };
    } catch (error) {
        console.log(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};