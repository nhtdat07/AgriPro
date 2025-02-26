require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Executes the 'getUserByEmail' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
async function getUserByEmail(params = {}) {
    try {
        const query = `SELECT * FROM users WHERE email = $1;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        console.error('Error executing getUserByEmail:', error);
        throw error;
    }
}

/**
 * Executes the 'createUser' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
async function createUser(params = {}) {
    try {
        const query = `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        console.error('Error executing createUser:', error);
        throw error;
    }
}


module.exports = { getUserByEmail, createUser };
