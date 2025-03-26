/**
 * Executes the 'addCustomer' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function addCustomer(pool, params = {}) {
    try {
        const query = `INSERT INTO customer (agency_id, name, address, phone, email)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'getCustomerById' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getCustomerById(pool, params = {}) {
    try {
        const query = `SELECT * FROM customer WHERE agency_id = $1 AND id = $2 AND is_deleted = false;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

