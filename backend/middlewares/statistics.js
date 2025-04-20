import * as consts from "../consts/consts.js";

// Middleware to validate LoadStatisticsScreen request data.
export const validateLoadStatisticsScreenData = (req, res, next) => {
    let { startDate, endDate } = req.query;

    if (!startDate) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing start date' });
    }
    if (isNaN(Date.parse(startDate))) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid start date. Expected YYYY-MM-DD' });
    }

    if (!endDate) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing end date' });
    }
    if (isNaN(Date.parse(endDate))) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid end date. Expected YYYY-MM-DD' });
    }

    if (Date.parse(startDate) > Date.parse(endDate)) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Start date must not exceed end date' });
    }

    next();
};

// Middleware to validate GetListSoldProducts request data.
export const validateGetListSoldProductsData = (req, res, next) => {
    let { startDate, endDate, limit, offset } = req.query;

    if (!startDate) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing start date' });
    }
    if (isNaN(Date.parse(startDate))) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid start date. Expected YYYY-MM-DD' });
    }

    if (!endDate) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing end date' });
    }
    if (isNaN(Date.parse(endDate))) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid end date. Expected YYYY-MM-DD' });
    }

    if (Date.parse(startDate) > Date.parse(endDate)) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Start date must not exceed end date' });
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

// Middleware to validate GetListActiveCustomers request data.
export const validateGetListActiveCustomersData = (req, res, next) => {
    let { startDate, endDate, limit, offset } = req.query;

    if (!startDate) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing start date' });
    }
    if (isNaN(Date.parse(startDate))) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid start date. Expected YYYY-MM-DD' });
    }

    if (!endDate) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Missing end date' });
    }
    if (isNaN(Date.parse(endDate))) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Invalid end date. Expected YYYY-MM-DD' });
    }

    if (Date.parse(startDate) > Date.parse(endDate)) {
        return res.status(consts.HTTP_STATUS.BAD_REQUEST).json({ error: 'Start date must not exceed end date' });
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