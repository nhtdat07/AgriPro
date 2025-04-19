import * as consts from "../consts/consts.js";

// Middleware to validate GetListSalesInvoices request data.
export const validateGetListSalesInvoicesData = (req, res, next) => {
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

// Middleware to validate AddSalesInvoice request data.
export const validateAddSalesInvoiceData = (req, res, next) => {
    const { customerId, products } = req.body;

    if (!customerId) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing customer ID' });
    }

    if (!products) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing products' });
    }
    if (!Array.isArray(products)) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid products' });
    }

    for (const product of products) {
        let { productId, quantity, outPrice } = product;

        if (!productId) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing product ID' });
        }

        if (!quantity) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing quantity' });
        }
        quantity = parseInt(quantity, consts.DECIMAL_BASE);
        if (!Number.isInteger(quantity)) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid quantity' });
        }
        product.quantity = quantity;

        if (!outPrice) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing out-price' });
        }
        outPrice = parseInt(outPrice, consts.DECIMAL_BASE);
        if (!Number.isInteger(outPrice)) {
            return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid out-price' });
        }
        product.outPrice = outPrice;
    }

    next();
};

// Middleware to validate GetSalesInvoiceDetails request data.
export const validateGetSalesInvoiceDetailsData = (req, res, next) => {
    const { invoiceId } = req.params;

    if (!invoiceId) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing sales invoice ID' });
    }

    next();
};