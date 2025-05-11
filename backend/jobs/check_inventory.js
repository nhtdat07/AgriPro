import * as consts from '../consts/consts.js';
import * as errors from '../errors/error_handler.js';
import { getAllUserAgencyId } from '../db/queries/generated/auth.js';
import { getProductsAboutToBeOutOfStock, getProductsAboutToExpire } from '../db/queries/generated/inventory.js';
import { addNotification } from '../db/queries/generated/notification.js';
import { getLastExpiredDateWarning, getMaxQuantityWarning } from '../utils/config.js';
import { formatTimestampUTC } from '../utils/format.js';

export const checkInventory = async (pool) => {
    try {
        // Get all user agency IDs
        const users = await getAllUserAgencyId(pool);

        for (const user of users) {
            // Retrieve config params
            const lastExpiredDateWarning = await getLastExpiredDateWarning(pool, user.id);
            const maxQuantityWarning = await getMaxQuantityWarning(pool, user.id);

            // Check for expiration warning
            await checkExpire(pool, user.id, lastExpiredDateWarning);

            // Check for out-of-stock warning
            await checkOutOfStock(pool, user.id, maxQuantityWarning);
        }
    } catch (error) {
        console.error('Error job checkInventory:', error);
    }
};

const checkExpire = async (pool, userAgencyId, lastExpiredDateWarning) => {
    const products = await getProductsAboutToExpire(pool, {
        agency_id: userAgencyId,
        warning_expired: lastExpiredDateWarning
    });
    if (products.length == consts.ZERO_LENGTH) {
        return;
    }

    let notiContent = `Bạn có sản phẩm sắp hết hạn sử dụng!\n`;
    let count = consts.DEFAULT_START_COUNT;
    for (const product of products) {
        notiContent += `
[${count}] ${product.id} - ${product.name}
Thời gian nhập hàng: ${formatTimestampUTC(product.imported_timestamp)}
Hạn sử dụng: ${formatTimestampUTC(product.expired_date).split(consts.SPACE)[consts.FIRST_IDX_ARRAY]}
`
    }

    const result = await addNotification(pool, {
        agency_id: userAgencyId,
        category: consts.NOTI_TYPES.WARNING_EXPIRED,
        content: notiContent
    });
    if (!result) {
        throw new errors.InternalError(`Failed to add expiration warning for user ${userAgencyId}`);
    }
};

const checkOutOfStock = async (pool, userAgencyId, maxQuantityWarning) => {
    const products = await getProductsAboutToBeOutOfStock(pool, {
        agency_id: userAgencyId,
        warning_out_of_stock: maxQuantityWarning
    });
    if (products.length == consts.ZERO_LENGTH) {
        return;
    }

    let notiContent = `Bạn có sản phẩm sắp hết hàng trong kho!\n`;
    let count = consts.DEFAULT_START_COUNT;
    for (const product of products) {
        notiContent += `
[${count}] ${product.id} - ${product.name}
Số lượng còn lại: ${product.total_quantity}
`
    }

    const result = await addNotification(pool, {
        agency_id: userAgencyId,
        category: consts.NOTI_TYPES.WARNING_OUT_OF_STOCK,
        content: notiContent
    });
    if (!result) {
        throw new errors.InternalError(`Failed to add out-of-stock warning for user ${userAgencyId}`);
    }
};