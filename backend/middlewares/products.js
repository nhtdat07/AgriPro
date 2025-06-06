import * as consts from "../consts/consts.js";

// Middleware to validate GetListProducts request data.
export const validateGetListProductsData = (req, res, next) => {
    let { limit, offset } = req.query;

    if (limit) {
        limit = parseInt(limit, consts.DECIMAL_BASE);
        if (!Number.isInteger(limit) || limit < consts.MIN_LIMIT) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid limit' });
        }
    }

    if (offset) {
        offset = parseInt(offset, consts.DECIMAL_BASE);
        if (!Number.isInteger(offset) || offset < consts.MIN_OFFSET) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid offset' });
        }
    }

    req.query.limit = limit || consts.DEFAULT_LIMIT;
    req.query.offset = offset || consts.DEFAULT_OFFSET;

    next();
};

// Middleware to validate AddProduct request data.
export const validateAddProductData = (req, res, next) => {
    let { productName, brand, category, productionPlace, outPrice, usage, guideline } = req.body;

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
    outPrice = parseInt(outPrice, consts.DECIMAL_BASE);
    if (!Number.isInteger(outPrice) || outPrice < consts.MIN_VALID_PRICE) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid out-price' });
    }
    req.body.outPrice = outPrice;

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
    let { outPrice } = req.body;

    if (!productId) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing product ID' });
    }

    if (!req.body || Object.keys(req.body).length === consts.ZERO_LENGTH) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: "At least one field must be provided for update" });
    }

    if (outPrice) {
        outPrice = parseInt(outPrice, consts.DECIMAL_BASE);
        if (!Number.isInteger(outPrice) || outPrice < consts.MIN_VALID_PRICE) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid out-price' });
        }
        req.body.outPrice = outPrice;
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