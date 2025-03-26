import * as errors from '../../errors/error_handler.js';
import { addCustomer } from '../../db/queries/generated/customers.js';

/**
 * Handles AddCustomer logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} data - The data from the request body.
 * @returns {Object} - Success message or error.
 */
export const addCustomerService = async (pool, user, data) => {
    const { customerName, address, phoneNumber, email } = data;

    try {
        // Add customer to database
        const result = await addCustomer(pool, {
            agency_id: user.userAgencyId,
            name: customerName,
            address,
            phone: phoneNumber,
            email
        });
        if (!result) {
            return { error: new errors.InternalError('Database failed to add customer') };
        }

        return { message: 'Add customer successfully' };
    } catch (error) {
        console.log(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};