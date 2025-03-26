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

/**
 * Executes the 'updateCustomer' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function updateCustomer(pool, params = {}) {
    try {
        const query = `UPDATE customer
SET
    name = CASE WHEN $1::VARCHAR IS NOT NULL THEN $1::VARCHAR ELSE name END,
    address = CASE WHEN $2::VARCHAR IS NOT NULL THEN $2::VARCHAR ELSE address END,
    phone = CASE WHEN $3::VARCHAR IS NOT NULL THEN $3::VARCHAR ELSE phone END,
    email = CASE WHEN $4::VARCHAR IS NOT NULL THEN $4 ELSE email::VARCHAR END
WHERE agency_id = $5 AND id = $6 AND is_deleted = false
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'markCustomerAsDeleted' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function markCustomerAsDeleted(pool, params = {}) {
    try {
        const query = `UPDATE customer
SET is_deleted = true
WHERE agency_id = $1 AND id = $2 AND is_deleted = false
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

