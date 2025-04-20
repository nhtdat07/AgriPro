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