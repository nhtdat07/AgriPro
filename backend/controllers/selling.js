import * as consts from '../consts/consts.js';
import { errorHandler } from '../errors/error_handler.js';
import { pool } from '../db.js';
import { getListSalesInvoicesService } from '../services/selling/get_list_sales_invoices.js';

// Controller for handling user GetListSalesInvoices requests
export const getListSalesInvoicesController = async (req, res) => {
    try {
        const result = await getListSalesInvoicesService(pool, req.user, req.query);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({
                message: result.message,
                data: result.data
            });
        }
    } catch (error) {
        console.error('GetListSalesInvoices error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};