/**
 * Executes the 'createTablePurchaseOrder' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function createTablePurchaseOrder(pool, params = {}) {
    try {
        const query = `CREATE TABLE IF NOT EXISTS purchase_order (
  "auto_id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "id" char(6) UNIQUE NOT NULL,
  "agency_id" char(6) NOT NULL,
  "recorded_at" timestamp NOT NULL DEFAULT current_timestamp,
  "supplier_id" char(6) NOT NULL,
  "total_payment" int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS order_product (
  "agency_id" char(6) NOT NULL,
  "order_id" char(6) NOT NULL,
  "product_id" char(6),
  "quantity" int NOT NULL,
  "price" int NOT NULL,
  PRIMARY KEY ("agency_id", "order_id", "product_id")
);

CREATE OR REPLACE FUNCTION set_custom_purchase_order_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.id := 'PO' || LPAD(NEW.auto_id::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER set_purchase_order_id
BEFORE INSERT ON purchase_order
FOR EACH ROW
EXECUTE FUNCTION set_custom_purchase_order_id();`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        console.error('Error executing createTablePurchaseOrder:', error);
        throw error;
    }
}

