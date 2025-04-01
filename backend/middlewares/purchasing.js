import * as consts from "../consts/consts.js";

// Middleware to validate GetListPurchaseOrders request data.
export const validateGetListPurchaseOrdersData = (req, res, next) => {
    let { recordedDate, limit, offset } = req.query;

    if (recordedDate && isNaN(Date.parse(recordedDate))) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid recorded date. Expected YYYY-MM-DD' });
    }

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

// Middleware to validate AddPurchaseOrder request data.
export const validateAddPurchaseOrderData = (req, res, next) => {
    const { supplierId, products } = req.body;

    if (!supplierId) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing supplier ID' });
    }

    if (!products) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing products' });
    }
    if (!Array.isArray(products)) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid products' });
    }

    for (const product of products) {
        let { productId, expiredDate, quantity, inPrice } = product;

        if (!productId) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing product ID' });
        }

        if (!expiredDate) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing expired date' });
        }
        if (isNaN(Date.parse(expiredDate))) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid expired date. Expected YYYY-MM-DD' });
        }

        if (!quantity) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing quantity' });
        }
        quantity = parseInt(quantity, consts.DECIMAL_BASE);
        if (!Number.isInteger(quantity)) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid quantity' });
        }
        product.quantity = quantity;

        if (!inPrice) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing in-price' });
        }
        inPrice = parseInt(inPrice, consts.DECIMAL_BASE);
        if (!Number.isInteger(inPrice)) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid in-price' });
        }
        product.inPrice = inPrice;
    }

    next();
};

// Middleware to validate GetPurchaseOrderDetails request data.
export const validateGetPurchaseOrderDetailsData = (req, res, next) => {
    const { orderId } = req.params;

    if (!orderId) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing purchase order ID' });
    }

    next();
};