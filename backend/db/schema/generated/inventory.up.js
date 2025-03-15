import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Executes the 'createTableInventoryProduct' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function createTableInventoryProduct(params = {}) {
    try {
        const query = `CREATE TABLE IF NOT EXISTS inventory_product (
  "agency_id" char(6) NOT NULL,
  "product_id" char(6) NOT NULL,
  "quantity" int NOT NULL DEFAULT 0,
  "imported_timestamp" timestamp NOT NULL DEFAULT current_timestamp,
  "expired_date" date NOT NULL,
  "in_price" integer NOT NULL,
  PRIMARY KEY ("agency_id", "product_id", "imported_timestamp")
);`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        console.error('Error executing createTableInventoryProduct:', error);
        throw error;
    }
}

