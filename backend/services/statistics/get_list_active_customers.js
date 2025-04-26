import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { getNextPagination } from '../../utils/pagination.js';
import { getActiveCustomers } from '../../db/queries/generated/statistics.js';

/**
 * Handles GetListActiveCustomers logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} query - The query params from the request.
 * @returns {Object} - Success message + data or error.
 */
export const getListActiveCustomersService = async (pool, user, query) => {
    let { startDate, endDate, customerId, limit, offset } = query;
    try {
        // Get list active customers from the database
        const result = await getActiveCustomers(pool, {
            agency_id: user.userAgencyId,
            id: customerId,
            start_date: startDate,
            end_date: endDate,
            limit,
            offset
        });
        if (!result) {
            throw new errors.InternalError('Failed to get list active customers from the database');
        }

        // Transform to return data
        let customerList = [];
        result.forEach(customer => {
            customerList.push({
                customerId: customer.customer_id,
                customerName: customer.customer_name,
                buyingAmount: customer.buying_amount
            });
        });

        return {
            message: 'Get list active customers successfully',
            data: {
                customers: customerList,
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