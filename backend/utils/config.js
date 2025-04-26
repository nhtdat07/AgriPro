import * as errors from '../errors/error_handler.js';
import * as consts from '../consts/consts.js';
import { formatTimestamp } from './format.js';
import { getConfig } from '../db/queries/generated/config.js';

export const getLastExpiredDateWarning = async (pool, userAgencyId) => {
    const result = await getConfig(pool, {
        agency_id: userAgencyId,
        keys: [consts.CONFIG_KEYS.WARNING_EXPIRED]
    });
    if (!result) {
        throw new errors.InternalError('Database failed to get config warning expired');
    }

    let date = new Date();
    date.setDate(date.getDate() + Number(result[consts.FIRST_IDX_ARRAY].value));
    return formatTimestamp(date).split(consts.SPACE)[consts.FIRST_IDX_ARRAY];
};

export const getMaxQuantityWarning = async (pool, userAgencyId) => {
    const result = await getConfig(pool, {
        agency_id: userAgencyId,
        keys: [consts.CONFIG_KEYS.WARNING_OUT_OF_STOCK]
    });
    if (!result) {
        throw new errors.InternalError('Database failed to get config warning out of stock');
    }

    return result[consts.FIRST_IDX_ARRAY].value;
};