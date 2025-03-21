import express from 'express';
import { authenticateUser } from '../middlewares/header.js';
import * as productMiddlewares from '../middlewares/products.js';
import * as productControllers from '../controllers/products.js';

export const router = express.Router();

// POST /products
router.post('/', authenticateUser, productMiddlewares.validateAddProductData, productControllers.addProductController);

// GET /products/{productId}
router.get('/:productId',
    authenticateUser,
    productMiddlewares.validateGetProductDetailsData,
    productControllers.getProductDetailsController
);

// PATCH /products/{productId}
router.patch('/:productId',
    authenticateUser,
    productMiddlewares.validateEditProductDetailsData,
    productControllers.editProductDetailsController
);