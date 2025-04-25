import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { updateCustomer } from '../../db/queries/generated/customers.js';

/**
 * Handles EditCustomerDetails logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} params - The request params.
 * @param {Object} data - The customer data to be updated from the request body.
 * @returns {Object} - Success message or error.
 */
export const editCustomerDetailsService = async (pool, user, params, data) => {
    const { customerName, address, phoneNumber, email } = data;

    try {
        // Update customer details to database
        const result = await updateCustomer(pool, {
            name: customerName,
            address,
            phone: phoneNumber,
            email,
            agency_id: user.userAgencyId,
            id: params.customerId
        })
        if (!result) {
            throw new errors.InternalError('Failed to update customer details to the database');
        }
        if (result.length == consts.ZERO_LENGTH) {
            throw new errors.UndefinedError('Customer not found');
        }

        return { message: 'Update customer successfully' };
    } catch (error) {
        if (error.statusCode) {
            return { error };
        }
        console.log(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};