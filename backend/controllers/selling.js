import * as consts from '../consts/consts.js';
import { errorHandler } from '../errors/error_handler.js';
import { pool } from '../db.js';
import { getListSalesInvoicesService } from '../services/selling/get_list_sales_invoices.js';
import { getSalesInvoiceDetailsService } from '../services/selling/get_sales_invoice_details.js';
import { addSalesInvoiceService } from '../services/selling/add_sales_invoice.js';

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

// Controller for handling user AddSalesInvoice requests
export const addSalesInvoiceController = async (req, res) => {
    try {
        const result = await addSalesInvoiceService(pool, req.user, req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.CREATED).json({ message: result.message });
        }
    } catch (error) {
        console.error('AddSalesInvoice error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user GetSalesInvoiceDetails requests
export const getSalesInvoiceDetailsController = async (req, res) => {
    try {
        const result = await getSalesInvoiceDetailsService(pool, req.user, req.params);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({
                message: result.message,
                data: result.data
            });
        }
    } catch (error) {
        console.error('GetSalesInvoiceDetails error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};