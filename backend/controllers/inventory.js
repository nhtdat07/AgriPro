import * as consts from '../consts/consts.js';
import { errorHandler } from '../errors/error_handler.js';
import { pool } from '../db.js';
import { getListInventoryService } from '../services/inventory/get_list_inventory.js';

// Controller for handling user GetListInventory requests
export const getListInventoryController = async (req, res) => {
    try {
        const result = await getListInventoryService(pool, req.user, req.query);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({
                message: result.message,
                data: result.data
            });
        }
    } catch (error) {
        console.error('GetListInventory error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};