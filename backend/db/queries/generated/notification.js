/**
 * Executes the 'addNotification' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function addNotification(pool, params = {}) {
    try {
        const query = `INSERT INTO notification (agency_id, category, content)
VALUES ($1, $2, $3);`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

