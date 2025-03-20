/**
 * Executes the 'addProduct' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function addProduct(pool, params = {}) {
    try {
        const query = `INSERT INTO product (agency_id, name, brand, category, out_price, production_place, usages, guidelines, image_path)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        console.error('Error executing addProduct:', error);
        throw error;
    }
}

/**
 * Executes the 'getProductById' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getProductById(pool, params = {}) {
    try {
        const query = `SELECT * FROM product WHERE agency_id = $1 AND id = $2;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        console.error('Error executing getProductById:', error);
        throw error;
    }
}

/**
 * Executes the 'getProductQuantityInInventory' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getProductQuantityInInventory(pool, params = {}) {
    try {
        const query = `SELECT SUM(quantity) AS total_quantity FROM inventory_product WHERE agency_id = $1 AND product_id = $2;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        console.error('Error executing getProductQuantityInInventory:', error);
        throw error;
    }
}

