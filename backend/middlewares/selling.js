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