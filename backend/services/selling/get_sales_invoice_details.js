import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { getProductsForSalesInvoice, getSalesInvoiceById } from '../../db/queries/generated/selling.js';

/**
 * Handles GetSalesInvoiceDetails logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} params - The request params.
 * @returns {Object} - Success message + sales invoice details or error.
 */
export const getSalesInvoiceDetailsService = async (pool, user, params) => {
    try {
        // Get sales invoice details from the database
        let result = await getSalesInvoiceById(pool, {
            agency_id: user.userAgencyId,
            id: params.invoiceId
        });
        if (!result) {
            throw new errors.InternalError('Failed to get sales invoice details from the database');
        }
        if (result.length == consts.ZERO_LENGTH) {
            throw new errors.UndefinedError('Sales invoice not found');
        }
        const invoiceDetails = result[consts.FIRST_IDX_ARRAY];

        // Get products included in the sales invoice
        result = await getProductsForSalesInvoice(pool, {
            agency_id: user.userAgencyId,
            id: params.invoiceId
        });
        if (!result) {
            throw new errors.InternalError(`Failed to get products for sales invoice ${params.invoiceId} from the database`);
        }

        // Transform products to return
        const productList = [];
        result.forEach(product => {
            productList.push({
                productName: product.name,
                quantity: product.quantity,
                outPrice: product.price,
                totalPrice: product.quantity * product.price
            });
        });

        return {
            message: 'Get sales invoice details successfully',
            data: {
                salesInvoiceId: invoiceDetails.id,
                customerName: invoiceDetails.customer_name,
                products: productList,
                totalPrice: invoiceDetails.total_price
            }
        };
    } catch (error) {
        if (error.statusCode) {
            return { error };
        }
        console.error(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};