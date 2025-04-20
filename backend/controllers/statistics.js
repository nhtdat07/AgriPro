import * as consts from '../consts/consts.js';
import { errorHandler } from '../errors/error_handler.js';
import { pool } from '../db.js';
import { loadStatisticsScreenService } from '../services/statistics/load_statistics_screen.js';

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