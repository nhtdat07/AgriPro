import * as errors from '../../errors/error_handler.js';
import { getNextPagination } from '../../utils/pagination.js';
import { formatTimestampUTC } from '../../utils/format.js';
import { getSalesInvoices } from '../../db/queries/generated/selling.js';

/**
 * Handles GetListSalesInvoices logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} query - The query params from the request.
 * @returns {Object} - Success message + data or error.
 */
export const getListSalesInvoicesService = async (pool, user, query) => {
    let { salesInvoiceId, recordedDate, customerId, limit, offset } = query;
    try {
        // Get list sales invoices from the database
        const result = await getSalesInvoices(pool, {
            agency_id: user.userAgencyId,
            id: salesInvoiceId,
            recorded_at: recordedDate,
            customer_id: customerId,
            limit,
            offset
        });
        if (!result) {
            throw new errors.InternalError('Failed to get list sales invoices');
        }

        // Transform to return data
        let invoiceList = [];
        result.forEach(invoice => {
            invoiceList.push({
                salesInvoiceId: invoice.id,
                recordedTimestamp: formatTimestampUTC(invoice.recorded_at),
                customerName: invoice.customer_name
            });
        });

        return {
            message: 'Get list sales invoices successfully',
            data: {
                salesInvoices: invoiceList,
                pagination: getNextPagination(limit, offset, result.length)
            }
        };
    } catch (error) {
        if (error.statusCode) {
            return { error };
        }
        console.error(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};