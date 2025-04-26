import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { getCustomerById } from '../../db/queries/generated/customers.js';

/**
 * Handles GetCustomerDetails logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} params - The request params.
 * @returns {Object} - Success message + customer details or error.
 */
export const getCustomerDetailsService = async (pool, user, params) => {
    try {
        // Get customer details from database
        const result = await getCustomerById(pool, {
            agency_id: user.userAgencyId,
            id: params.customerId
        });
        if (!result) {
            throw new errors.InternalError('Failed to get customer details from the database');
        }
        if (result.length == consts.ZERO_LENGTH) {
            throw new errors.UndefinedError('Customer not found');
        }
        const customerDetails = result[consts.FIRST_IDX_ARRAY];

        return {
            message: 'Get customer details successfully',
            data: {
                customerId: customerDetails.id,
                customerName: customerDetails.name,
                address: customerDetails.address,
                phoneNumber: customerDetails.phone,
                email: customerDetails.email || consts.EMPTY_STRING
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