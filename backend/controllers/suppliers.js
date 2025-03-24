import * as consts from '../consts/consts.js';
import { errorHandler } from '../errors/error_handler.js';
import { pool } from '../db.js';
import { addSupplierService } from '../services/suppliers/add_supplier.js';
import { deleteSupplierService } from '../services/suppliers/delete_supplier.js';
import { getSupplierDetailsService } from '../services/suppliers/get_supplier_details.js';
import { editSupplierDetailsService } from '../services/suppliers/edit_supplier_details.js';
import { getListSuppliersService } from '../services/suppliers/get_list_suppliers.js';

// Controller for handling user GetListSuppliers requests
export const getListSuppliersController = async (req, res) => {
    try {
        const result = await getListSuppliersService(pool, req.user, req.query);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({
                message: result.message,
                data: result.data
            });
        }
    } catch (error) {
        console.error('GetListSuppliers error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

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

// Controller for handling user GetSupplierDetails requests
export const getSupplierDetailsController = async (req, res) => {
    try {
        const result = await getSupplierDetailsService(pool, req.user, req.params);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({
                message: result.message,
                data: result.data
            });
        }
    } catch (error) {
        console.error('GetSupplierDetails error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user EditSupplierDetails requests
export const editSupplierDetailsController = async (req, res) => {
    try {
        const result = await editSupplierDetailsService(pool, req.user, req.params, req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({ message: result.message });
        }
    } catch (error) {
        console.error('EditSupplierDetails error:', error);
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