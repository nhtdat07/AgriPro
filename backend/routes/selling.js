import express from 'express';
import { authenticateUser } from '../middlewares/header.js';
import * as sellingMiddlewares from '../middlewares/selling.js';
import * as sellingControllers from '../controllers/selling.js';

export const router = express.Router();

// GET /sales-invoices
router.get('/',
    authenticateUser, sellingMiddlewares.validateGetListSalesInvoicesData, sellingControllers.getListSalesInvoicesController
);