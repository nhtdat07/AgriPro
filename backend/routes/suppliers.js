import express from 'express';
import { authenticateUser } from '../middlewares/header.js';
import * as supplierMiddlewares from '../middlewares/suppliers.js';
import * as supplierControllers from '../controllers/suppliers.js';

export const router = express.Router();

// POST /suppliers
router.post('/', authenticateUser, supplierMiddlewares.validateAddSupplierData, supplierControllers.addSupplierController);

// DELETE /suppliers/{supplierId}
router.delete('/:supplierId',
    authenticateUser, supplierMiddlewares.validateDeleteSupplierData, supplierControllers.deleteSupplierController
);