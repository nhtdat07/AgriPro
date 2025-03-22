import * as consts from '../consts/consts.js';
import { errorHandler } from '../errors/error_handler.js';
import { pool } from '../db.js';
import { addSupplierService } from '../services/suppliers/add_supplier.js';
import { deleteSupplierService } from '../services/suppliers/delete_supplier.js';

// Controller for handling user AddSupplier requests
export const addSupplierController = async (req, res) => {
    try {
        const result = await addSupplierService(pool, req.user, req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.CREATED).json({ message: result.message });
        }
    } catch (error) {
        console.error('AddSupplier error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user DeleteSupplier requests
export const deleteSupplierController = async (req, res) => {
    try {
        const result = await deleteSupplierService(pool, req.user, req.params);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({ message: result.message });
        }
    } catch (error) {
        console.error('DeleteSupplier error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};