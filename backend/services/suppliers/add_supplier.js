import * as errors from '../../errors/error_handler.js';
import { addSupplier } from '../../db/queries/generated/suppliers.js';

/**
 * Handles AddSupplier logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} data - The data from the request body.
 * @returns {Object} - Success message or error.
 */
export const addSupplierService = async (pool, user, data) => {
    const { supplierName, address, phoneNumber, email } = data;

    try {
        // Add supplier to database
        const result = await addSupplier(pool, {
            agency_id: user.userAgencyId,
            name: supplierName,
            address,
            phone: phoneNumber,
            email
        })

        if (!result) {
            return { error: new errors.InternalError('Database failed to add supplier') };
        }

        return { message: 'Add supplier successfully' };
    } catch (error) {
        console.log(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};