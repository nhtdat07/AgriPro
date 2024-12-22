const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
    try {
        // Run a test query
        const res = await pool.query('SELECT NOW()');
        console.log('Database connection successful:', res.rows);
    } catch (err) {
        console.error('Error connecting to the database:', err);
    } finally {
        // End the connection pool after the test
        await pool.end();
    }
}

testConnection();
