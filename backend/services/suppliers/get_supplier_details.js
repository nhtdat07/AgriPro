import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { getSupplierById } from '../../db/queries/generated/suppliers.js';

/**
 * Handles GetSupplierDetails logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} params - The request params.
 * @returns {Object} - Success message + supplier details or error.
 */
export const getSupplierDetailsService = async (pool, user, params) => {
    try {
        // Get supplier details from database
        const result = await getSupplierById(pool, {
            agency_id: user.userAgencyId,
            id: params.supplierId
        });
        if (!result) {
            throw new errors.InternalError('Failed to get supplier details from the database');
        }
        if (result.length == consts.ZERO_LENGTH) {
            throw new errors.UndefinedError('Supplier not found');
        }
        const supplierDetails = result[consts.FIRST_IDX_ARRAY];

        return {
            message: 'Get supplier details successfully',
            data: {
                supplierId: supplierDetails.id,
                supplierName: supplierDetails.name,
                address: supplierDetails.address,
                phoneNumber: supplierDetails.phone,
                email: supplierDetails.email || consts.EMPTY_STRING
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