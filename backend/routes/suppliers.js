import express from 'express';
import { authenticateUser } from '../middlewares/header.js';
import * as supplierMiddlewares from '../middlewares/suppliers.js';
import * as supplierControllers from '../controllers/suppliers.js';

export const router = express.Router();

// GET /suppliers
router.get('/', authenticateUser, supplierMiddlewares.validateGetListSuppliersData, supplierControllers.getListSuppliersController);

// POST /suppliers
router.post('/', authenticateUser, supplierMiddlewares.validateAddSupplierData, supplierControllers.addSupplierController);

// GET /suppliers/{supplierId}
router.get('/:supplierId',
    authenticateUser, supplierMiddlewares.validateGetSupplierDetailsData, supplierControllers.getSupplierDetailsController
);

// PATCH /suppliers/{supplierId}
router.patch('/:supplierId',
    authenticateUser, supplierMiddlewares.validateEditSupplierDetailsData, supplierControllers.editSupplierDetailsController
);

// DELETE /suppliers/{supplierId}
router.delete('/:supplierId',
    authenticateUser, supplierMiddlewares.validateDeleteSupplierData, supplierControllers.deleteSupplierController
);