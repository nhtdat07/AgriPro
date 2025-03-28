/**
 * Executes the 'addPurchaseOrder' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function addPurchaseOrder(pool, params = {}) {
    try {
        const query = `INSERT INTO purchase_order (agency_id, supplier_id, total_payment)
VALUES ($1, $2, $3)
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'addInventory' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function addInventory(pool, params = {}) {
    try {
        const query = `INSERT INTO inventory_product (agency_id, product_id, quantity, expired_date, in_price)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'addProductForPurchaseOrder' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function addProductForPurchaseOrder(pool, params = {}) {
    try {
        const query = `INSERT INTO order_product (agency_id, order_id, product_id, quantity, price)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

