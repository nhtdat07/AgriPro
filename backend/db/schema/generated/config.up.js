/**
 * Executes the 'createTableConfiguration' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function createTableConfiguration(pool, params = {}) {
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
        throw error;
    }
}

