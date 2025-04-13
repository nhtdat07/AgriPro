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

/**
 * Executes the 'markNotificationAsRead' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function markNotificationAsRead(pool, params = {}) {
    try {
        const query = `UPDATE notification
SET is_read = true
WHERE agency_id = $1 and id = $2
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

