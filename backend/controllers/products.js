import * as consts from '../consts/consts.js';
import { errorHandler } from '../errors/error_handler.js';
import { pool } from '../db.js';
import { addProductService } from '../services/products/add_product.js';
import { getProductDetailsService } from '../services/products/get_product_details.js';
import { editProductDetailsService } from '../services/products/edit_product_details.js';
import { deleteProductService } from '../services/products/delete_product.js';
import { getListProductsService } from '../services/products/get_list_products.js';

// Controller for handling user GetListProducts requests
export const getListProductsController = async (req, res) => {
    try {
        const result = await getListProductsService(pool, req.user, req.query);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({
                message: result.message,
                data: result.data
            });
        }
    } catch (error) {
        console.error('GetListProducts error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user AddProduct requests
export const addProductController = async (req, res) => {
    try {
        const result = await addProductService(pool, req.user, req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.CREATED).json({ message: result.message });
        }
    } catch (error) {
        console.error('AddProduct error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user GetProductDetails requests
export const getProductDetailsController = async (req, res) => {
    try {
        const result = await getProductDetailsService(pool, req.user, req.params);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({
                message: result.message,
                data: result.data
            });
        }
    } catch (error) {
        console.error('GetProductDetails error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user EditProductDetails requests
export const editProductDetailsController = async (req, res) => {
    try {
        const result = await editProductDetailsService(pool, req.user, req.params, req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({ message: result.message });
        }
    } catch (error) {
        console.error('EditProductDetails error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user DeleteProduct requests
export const deleteProductController = async (req, res) => {
    try {
        const result = await deleteProductService(pool, req.user, req.params);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({ message: result.message });
        }
    } catch (error) {
        console.error('DeleteProduct error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};