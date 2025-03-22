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

