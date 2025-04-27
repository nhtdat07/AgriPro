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

/**
 * Executes the 'updateProfile' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function updateProfile(pool, params = {}) {
    try {
        const query = `UPDATE user_agency
SET
    agency_name = CASE WHEN $1::VARCHAR IS NOT NULL THEN $1::VARCHAR ELSE agency_name END,
    owner_name = CASE WHEN $2::VARCHAR IS NOT NULL THEN $2::VARCHAR ELSE owner_name END,
    address = CASE WHEN $3::VARCHAR IS NOT NULL THEN $3::VARCHAR ELSE address END,
    tax_code = CASE WHEN $4::VARCHAR IS NOT NULL THEN $4::VARCHAR ELSE tax_code END,
    phone = CASE WHEN $5::VARCHAR IS NOT NULL THEN $5::VARCHAR ELSE phone END,
    email = CASE WHEN $6::VARCHAR IS NOT NULL THEN $6 ELSE email END,
    profile_photo_path = CASE WHEN $7::VARCHAR IS NOT NULL THEN $7 ELSE profile_photo_path END
WHERE id = $8
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'updateConfig' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function updateConfig(pool, params = {}) {
    try {
        const query = `UPDATE configuration
SET value = $4
WHERE agency_id = $1 AND category = $2 AND key = $3
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'updatePassword' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function updatePassword(pool, params = {}) {
    try {
        const query = `UPDATE user_agency
SET password_hash = $2
WHERE id = $1
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

