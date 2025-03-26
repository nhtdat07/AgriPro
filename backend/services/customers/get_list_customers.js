import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { getNextPagination } from '../../utils/pagination.js';
import { transformToPatternQueryLike } from '../../utils/format.js';
import { getCustomers } from '../../db/queries/generated/customers.js';

/**
 * Handles GetListCustomers logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} query - The query params from the request.
 * @returns {Object} - Success message + data or error.
 */
export const getListCustomersService = async (pool, user, query) => {
    let { customerName, address, phoneNumber, limit, offset } = query;
    try {
        // Transform to pattern
        customerName = transformToPatternQueryLike(customerName);
        address = transformToPatternQueryLike(address);
        phoneNumber = transformToPatternQueryLike(phoneNumber);

        // Get list customers from the database
        const result = await getCustomers(pool, {
            agency_id: user.userAgencyId,
            name: customerName,
            address,
            phone: phoneNumber,
            limit,
            offset
        });
        if (!result) {
            return { error: new errors.InternalError('Failed to get list customers') };
        }

        // Transform to return data
        let customerList = [];
        result.forEach(customer => {
            customerList.push({
                customerId: customer.id,
                customerName: customer.name,
                address: customer.address,
                phoneNumber: customer.phone,
                email: customer.email || consts.EMPTY_STRING
            });
        });

        return {
            message: 'Get list customers successfully',
            data: {
                customers: customerList,
                pagination: getNextPagination(limit, offset, result.length)
            }
        };
    } catch (error) {
        console.log(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};