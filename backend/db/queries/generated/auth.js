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

/**
 * Executes the 'getAllUserAgencyId' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getAllUserAgencyId(pool, params = {}) {
    try {
        const query = `SELECT id FROM user_agency;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'setNewPasswordByEmail' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function setNewPasswordByEmail(pool, params = {}) {
    try {
        const query = `UPDATE user_agency
SET password_hash = $2
WHERE email = $1
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

