import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { markCustomerAsDeleted } from '../../db/queries/generated/customers.js';

/**
 * Handles DeleteCustomer logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} params - The request params.
 * @returns {Object} - Success message or error.
 */
export const deleteCustomerService = async (pool, user, params) => {
    try {
        // Mark customer as deleted in the database
        const result = await markCustomerAsDeleted(pool, {
            agency_id: user.userAgencyId,
            id: params.customerId
        });
        if (!result) {
            throw new errors.InternalError('Database failed to delete customer');
        }
        if (result.length == consts.ZERO_LENGTH) {
            throw new errors.UndefinedError('Customer not found');
        }

        return { message: 'Delete customer successfully' };
    } catch (error) {
        if (error.statusCode) {
            return { error };
        }
        console.error(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};