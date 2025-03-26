import * as consts from '../consts/consts.js';
import { errorHandler } from '../errors/error_handler.js';
import { pool } from '../db.js';
import { addCustomerService } from '../services/customers/add_customer.js';
import { getCustomerDetailsService } from '../services/customers/get_customer_details.js';
import { editCustomerDetailsService } from '../services/customers/edit_customer_details.js';
import { deleteCustomerService } from '../services/customers/delete_customer.js';

// Controller for handling user AddCustomer requests
export const addCustomerController = async (req, res) => {
    try {
        const result = await addCustomerService(pool, req.user, req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.CREATED).json({ message: result.message });
        }
    } catch (error) {
        console.error('AddCustomer error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user GetCustomerDetails requests
export const getCustomerDetailsController = async (req, res) => {
    try {
        const result = await getCustomerDetailsService(pool, req.user, req.params);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({
                message: result.message,
                data: result.data
            });
        }
    } catch (error) {
        console.error('GetCustomerDetails error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user EditCustomerDetails requests
export const editCustomerDetailsController = async (req, res) => {
    try {
        const result = await editCustomerDetailsService(pool, req.user, req.params, req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({ message: result.message });
        }
    } catch (error) {
        console.error('EditCustomerDetails error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user DeleteCustomer requests
export const deleteCustomerController = async (req, res) => {
    try {
        const result = await deleteCustomerService(pool, req.user, req.params);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({ message: result.message });
        }
    } catch (error) {
        console.error('DeleteCustomer error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};