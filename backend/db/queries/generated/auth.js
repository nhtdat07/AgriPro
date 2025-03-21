/**
 * Executes the 'getUserByEmail' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getUserByEmail(pool, params = {}) {
    try {
        const query = `SELECT * FROM user_agency WHERE email = $1;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'addUser' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function addUser(pool, params = {}) {
    try {
        const query = `INSERT INTO user_agency (agency_name, owner_name, email, phone, password_hash) 
VALUES ($1, $2, $3, $4, $5)
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

