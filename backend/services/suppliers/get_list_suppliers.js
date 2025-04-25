import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { getNextPagination } from '../../utils/pagination.js';
import { transformToPatternQueryLike } from '../../utils/format.js';
import { getSuppliers } from '../../db/queries/generated/suppliers.js';

/**
 * Handles GetListSuppliers logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} query - The query params from the request.
 * @returns {Object} - Success message + data or error.
 */
export const getListSuppliersService = async (pool, user, query) => {
    let { supplierName, address, phoneNumber, limit, offset } = query;
    try {
        // Transform to pattern
        supplierName = transformToPatternQueryLike(supplierName);
        address = transformToPatternQueryLike(address);
        phoneNumber = transformToPatternQueryLike(phoneNumber);

        // Get list suppliers from the database
        const result = await getSuppliers(pool, {
            agency_id: user.userAgencyId,
            name: supplierName,
            address,
            phone: phoneNumber,
            limit,
            offset
        });
        if (!result) {
            throw new errors.InternalError('Failed to get list suppliers');
        }

        // Transform to return data
        let supplierList = [];
        result.forEach(supplier => {
            supplierList.push({
                supplierId: supplier.id,
                supplierName: supplier.name,
                address: supplier.address,
                phoneNumber: supplier.phone,
                email: supplier.email || consts.EMPTY_STRING
            });
        });

        return {
            message: 'Get list suppliers successfully',
            data: {
                suppliers: supplierList,
                pagination: getNextPagination(limit, offset, result.length)
            }
        };
    } catch (error) {
        if (error.statusCode) {
            return { error };
        }
        console.log(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};