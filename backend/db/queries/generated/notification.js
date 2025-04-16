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
 * Executes the 'getNotifications' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getNotifications(pool, params = {}) {
    try {
        const query = `SELECT *, 
  EXISTS (
    SELECT 1 
    FROM notification n2 
    WHERE n2.agency_id = $1 AND n2.is_read = false
  ) AS all_read
FROM notification
WHERE agency_id = $1
ORDER BY id DESC
LIMIT $2 OFFSET $3;`;
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

