import * as consts from "../consts/consts.js";

// Middleware to validate AddProduct request data.
export const validateAddProductData = (req, res, next) => {
    const { productName, brand, category, productionPlace, outPrice, usage, guideline } = req.body;

    if (!productName) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing product name' });
    }

    if (!brand) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing brand' });
    }

    if (!category) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing category' });
    }

    if (!productionPlace) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing production place' });
    }

    if (!outPrice) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing out-price' });
    }

    if (!usage) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing usage' });
    }

    if (!guideline) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing guideline' });
    }

    next();
};

// Middleware to validate GetProductDetails request data.
export const validateGetProductDetailsData = (req, res, next) => {
    const { productId } = req.params;

    if (!productId) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing product ID' });
    }

    next();
};

// Middleware to validate EditProductDetails request data.
export const validateEditProductDetailsData = (req, res, next) => {
    const { productId } = req.params;

    if (!productId) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing product ID' });
    }

    if (!req.body || Object.keys(req.body).length === consts.ZERO_LENGTH) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: "At least one field must be provided for update" });
    }

    next();
};

// Middleware to validate DeleteProduct request data.
export const validateDeleteProductData = (req, res, next) => {
    const { productId } = req.params;

    if (!productId) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing product ID' });
    }

    next();
};