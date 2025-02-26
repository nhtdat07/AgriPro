require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Executes the 'createTableConfiguration' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
async function createTableConfiguration(params = {}) {
    try {
        const query = `DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'config_type') THEN
        CREATE TYPE "config_type" AS ENUM (
            'INVENTORY_PARAMS',
            'PRINT_FORMAT'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS configuration (
  "agency_id" char(6) NOT NULL,
  "category" config_type NOT NULL,
  "key" varchar(30) NOT NULL,
  "value" varchar(100) NOT NULL,
  PRIMARY KEY ("agency_id", "category", "key")
);`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        console.error('Error executing createTableConfiguration:', error);
        throw error;
    }
}


module.exports = { createTableConfiguration };
