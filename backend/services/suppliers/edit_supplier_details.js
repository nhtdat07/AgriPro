import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { updateSupplier } from '../../db/queries/generated/suppliers.js';

/**
 * Handles EditSupplierDetails logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} params - The request params.
 * @param {Object} data - The supplier data to be updated from the request body.
 * @returns {Object} - Success message or error.
 */
export const editSupplierDetailsService = async (pool, user, params, data) => {
    const { supplierName, address, phoneNumber, email } = data;

    try {
        // Update supplier details to database
        const result = await updateSupplier(pool, {
            name: supplierName,
            address,
            phone: phoneNumber,
            email,
            agency_id: user.userAgencyId,
            id: params.supplierId
        })
        if (!result) {
            return { error: new errors.InternalError('Failed to update supplier details to the database') };
        }
        if (result.length == consts.ZERO_LENGTH) {
            return { error: new errors.UndefinedError('Supplier not found') };
        }

        return { message: 'Update supplier successfully' };
    } catch (error) {
        console.log(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};