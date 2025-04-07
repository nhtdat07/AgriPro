import * as consts from "../consts/consts.js";

// Middleware to validate GetListInventory request data.
export const validateGetListInventoryData = (req, res, next) => {
    let { importDate, expiredDate, isAboutToExpire, isAboutToBeOutOfStock, limit, offset } = req.query;

    if (importDate && isNaN(Date.parse(importDate))) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid import date. Expected YYYY-MM-DD' });
    }

    if (expiredDate && isNaN(Date.parse(expiredDate))) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid expired date. Expected YYYY-MM-DD' });
    }

    if (!isAboutToExpire) {
        req.query.isAboutToExpire = false;
    }

    if (!isAboutToBeOutOfStock) {
        req.query.isAboutToBeOutOfStock = false;
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