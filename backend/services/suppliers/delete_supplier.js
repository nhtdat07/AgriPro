import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { markSupplierAsDeleted } from '../../db/queries/generated/suppliers.js';

/**
 * Handles DeleteSupplier logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} params - The request params.
 * @returns {Object} - Success message or error.
 */
export const deleteSupplierService = async (pool, user, params) => {
    try {
        // Mark supplier as deleted in the database
        const result = await markSupplierAsDeleted(pool, {
            agency_id: user.userAgencyId,
            id: params.supplierId
        });
        if (!result) {
            throw new errors.InternalError('Database failed to delete supplier');
        }
        if (result.length == consts.ZERO_LENGTH) {
            throw new errors.UndefinedError('Supplier not found');
        }

        return { message: 'Delete supplier successfully' };
    } catch (error) {
        if (error.statusCode) {
            return { error };
        }
        console.error(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};