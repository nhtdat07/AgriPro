/**
 * Executes the 'addDefaultConfig' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function addDefaultConfig(pool, params = {}) {
    try {
        const query = `INSERT INTO configuration (agency_id, category, key, value)
VALUES
    ($1, 'INVENTORY_PARAMS', 'warning_expired', '5'),
    ($1, 'INVENTORY_PARAMS', 'warning_out_of_stock', '5'),
    ($1, 'PRINT_FORMAT', 'left_margin', '3'),
    ($1, 'PRINT_FORMAT', 'right_margin', '2'),
    ($1, 'PRINT_FORMAT', 'top_margin', '2'),
    ($1, 'PRINT_FORMAT', 'bottom_margin', '2'),
    ($1, 'PRINT_FORMAT', 'font_size', '13')
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'getConfig' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getConfig(pool, params = {}) {
    try {
        const query = `SELECT * FROM configuration WHERE agency_id = $1 AND key = ANY($2);`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'getUserById' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getUserById(pool, params = {}) {
    try {
        const query = `SELECT * FROM user_agency WHERE id = $1;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'getSettings' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getSettings(pool, params = {}) {
    try {
        const query = `SELECT * FROM configuration WHERE agency_id = $1;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

