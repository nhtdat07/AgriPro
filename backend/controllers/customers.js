import * as consts from '../consts/consts.js';
import { errorHandler } from '../errors/error_handler.js';
import { pool } from '../db.js';
import { addCustomerService } from '../services/customers/add_customer.js';

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