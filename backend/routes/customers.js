import express from 'express';
import { authenticateUser } from '../middlewares/header.js';
import * as customerMiddlewares from '../middlewares/customers.js';
import * as customerControllers from '../controllers/customers.js';

export const router = express.Router();

// GET /customers
router.get('/', authenticateUser, customerMiddlewares.validateGetListCustomersData, customerControllers.getListCustomersController);

// POST /customers
router.post('/', authenticateUser, customerMiddlewares.validateAddCustomerData, customerControllers.addCustomerController);

// GET /customers/{customerId}
router.get('/:customerId',
    authenticateUser, customerMiddlewares.validateGetCustomerDetailsData, customerControllers.getCustomerDetailsController
);

// PATCH /customers/{customerId}
router.patch('/:customerId',
    authenticateUser, customerMiddlewares.validateEditCustomerDetailsData, customerControllers.editCustomerDetailsController
);

// DELETE /customers/{customerId}
router.delete('/:customerId',
    authenticateUser, customerMiddlewares.validateDeleteCustomerData, customerControllers.deleteCustomerController
);