/**
 * Executes the 'createTableCustomer' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function createTableCustomer(pool, params = {}) {
    try {
        const query = `CREATE TABLE IF NOT EXISTS customer (
  "auto_id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "id" char(6) UNIQUE NOT NULL,
  "agency_id" char(6) NOT NULL,
  "name" varchar(100) NOT NULL,
  "address" varchar(255) NOT NULL,
  "phone" varchar(12) NOT NULL,
  "email" varchar(50),
  "is_deleted" bool NOT NULL DEFAULT false
);

CREATE OR REPLACE FUNCTION set_custom_customer_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.id := 'CU' || LPAD(NEW.auto_id::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER set_customer_id
BEFORE INSERT ON customer
FOR EACH ROW
EXECUTE FUNCTION set_custom_customer_id();

CREATE UNIQUE INDEX IF NOT EXISTS customer_id_idx ON customer (agency_id, id);`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

