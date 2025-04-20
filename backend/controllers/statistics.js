import * as consts from '../consts/consts.js';
import { errorHandler } from '../errors/error_handler.js';
import { pool } from '../db.js';
import { loadStatisticsScreenService } from '../services/statistics/load_statistics_screen.js';
import { getListSoldProductsService } from '../services/statistics/get_list_sold_products.js';

// Controller for handling user LoadStatisticsScreen requests
export const loadStatisticsScreenController = async (req, res) => {
    try {
        const result = await loadStatisticsScreenService(pool, req.user, req.query);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({
                message: result.message,
                data: result.data
            });
        }
    } catch (error) {
        console.error('LoadStatisticsScreen error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user GetListSoldProducts requests
export const getListSoldProductsController = async (req, res) => {
    try {
        const result = await getListSoldProductsService(pool, req.user, req.query);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({
                message: result.message,
                data: result.data
            });
        }
    } catch (error) {
        console.error('GetListSoldProducts error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};