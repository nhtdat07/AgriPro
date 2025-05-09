import express from 'express';
import { authenticateUser } from '../middlewares/header.js';
import * as statisticsMiddlewares from '../middlewares/statistics.js';
import * as statisticsControllers from '../controllers/statistics.js';

export const router = express.Router();

// GET /statistics/load-screen
router.get('/load-screen',
    authenticateUser, statisticsMiddlewares.validateLoadStatisticsScreenData, statisticsControllers.loadStatisticsScreenController
);

// GET /statistics/best-sellers
router.get('/best-sellers',
    authenticateUser, statisticsMiddlewares.validateGetListSoldProductsData, statisticsControllers.getListSoldProductsController
);

// GET /statistics/active-customers
router.get('/active-customers',
    authenticateUser, statisticsMiddlewares.validateGetListActiveCustomersData, statisticsControllers.getListActiveCustomersController
);