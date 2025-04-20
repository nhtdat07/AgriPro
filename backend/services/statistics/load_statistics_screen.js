import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { getStatisticsPurchasing, getStatisticsSelling, getTotalBenefit } from '../../db/queries/generated/statistics.js';

/**
 * Handles LoadStatisticsScreen logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} query - The query params from the request.
 * @returns {Object} - Success message + data or error.
 */
export const loadStatisticsScreenService = async (pool, user, query) => {
    let { startDate, endDate } = query;
    try {
        // Get total benefit from the database
        let result = await getTotalBenefit(pool, {
            agency_id: user.userAgencyId,
            start_date: startDate,
            end_date: endDate
        });
        if (!result) {
            return { error: new errors.InternalError('Failed to get total benefits from the database') };
        }
        const totalBenefit = result[consts.FIRST_IDX_ARRAY].total_benefit;

        // Get purchasing summary from the database
        result = await getStatisticsPurchasing(pool, {
            agency_id: user.userAgencyId,
            start_date: startDate,
            end_date: endDate
        });
        if (!result) {
            return { error: new errors.InternalError('Failed to get purchasing summary from the database') };
        }
        const purchasingSummary = result[consts.FIRST_IDX_ARRAY];

        // Get selling summary from the database
        result = await getStatisticsSelling(pool, {
            agency_id: user.userAgencyId,
            start_date: startDate,
            end_date: endDate
        });
        if (!result) {
            return { error: new errors.InternalError('Failed to get selling summary from the database') };
        }
        const sellingSummary = result[consts.FIRST_IDX_ARRAY];

        return {
            message: 'Load statistics screen successfully',
            data: {
                totalBenefit,
                purchaseOrdersAmount: purchasingSummary.order_quantity,
                totalPurchase: purchasingSummary.total_purchasing,
                salesInvoicesAmount: sellingSummary.invoice_quantity,
                totalSale: sellingSummary.total_selling
            }
        };
    } catch (error) {
        console.log(error)
        return { error: new errors.InternalError('Internal server error') };
    }
};