import express from 'express';
import { authenticateUser } from '../middlewares/header.js';
import * as purchasingMiddlewares from '../middlewares/purchasing.js';
import * as purchasingControllers from '../controllers/purchasing.js';

export const router = express.Router();

// POST /purchase-orders
router.post('/',
    authenticateUser, purchasingMiddlewares.validateAddPurchaseOrderData, purchasingControllers.addPurchaseOrderController
);

// GET /purchase-orders/{orderId}
router.get('/:orderId',
    authenticateUser,
    purchasingMiddlewares.validateGetPurchaseOrderDetailsData,
    purchasingControllers.getPurchaseOrderDetailsController
);