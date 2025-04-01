import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { getProductsForPurchaseOrder, getPurchaseOrderById } from '../../db/queries/generated/purchasing.js';
import { formatTimestamp } from '../../utils/format.js';

/**
 * Handles GetPurchaseOrderDetails logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} params - The request params.
 * @returns {Object} - Success message + purchase order details or error.
 */
export const getPurchaseOrderDetailsService = async (pool, user, params) => {
    try {
        // Get purchase order details from the database
        let result = await getPurchaseOrderById(pool, {
            agency_id: user.userAgencyId,
            id: params.orderId
        });
        if (!result) {
            return { error: new errors.InternalError('Failed to get purchase order details from the database') };
        }
        if (result.length == consts.ZERO_LENGTH) {
            return { error: new errors.UndefinedError('Purchase order not found') };
        }
        const orderDetails = result[consts.FIRST_IDX_ARRAY];

        // Get products included in the purchase order
        result = await getProductsForPurchaseOrder(pool, {
            agency_id: user.userAgencyId,
            id: params.orderId
        });
        if (!result) {
            return { error: new errors.InternalError(`Failed to get products for purchase order ${params.orderId} from the database`) };
        }

        // Transform products to return
        const productList = [];
        result.forEach(product => {
            productList.push({
                productName: product.name,
                expiredDate: formatTimestamp(product.expired_date).split(consts.SPACE)[consts.FIRST_IDX_ARRAY],
                quantity: product.quantity,
                inPrice: product.price,
                totalPrice: product.quantity * product.price
            });
        });

        return {
            message: 'Get purchase order details successfully',
            data: {
                purchaseOrderId: orderDetails.id,
                supplierName: orderDetails.supplier_name,
                products: productList,
                totalPrice: orderDetails.total_payment
            }
        };
    } catch (error) {
        console.log(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};