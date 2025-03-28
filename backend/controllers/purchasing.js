import * as consts from '../consts/consts.js';
import { errorHandler } from '../errors/error_handler.js';
import { pool } from '../db.js';
import { addPurchaseOrderService } from '../services/purchasing/add_purchase_order.js';

// Controller for handling user AddPurchaseOrder requests
export const addPurchaseOrderController = async (req, res) => {
    try {
        const result = await addPurchaseOrderService(pool, req.user, req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.CREATED).json({ message: result.message });
        }
    } catch (error) {
        console.error('AddPurchaseOrder error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};