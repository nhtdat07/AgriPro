/**
 * Executes the 'addSupplier' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function addSupplier(pool, params = {}) {
    try {
        const query = `INSERT INTO supplier (agency_id, name, address, phone, email)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'getSupplierById' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getSupplierById(pool, params = {}) {
    try {
        const query = `SELECT * FROM supplier WHERE agency_id = $1 AND id = $2 AND is_deleted = false;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'updateSupplier' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function updateSupplier(pool, params = {}) {
    try {
        const query = `UPDATE supplier
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
 * Executes the 'markSupplierAsDeleted' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function markSupplierAsDeleted(pool, params = {}) {
    try {
        const query = `UPDATE supplier
SET is_deleted = true
WHERE agency_id = $1 AND id = $2 AND is_deleted = false
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

