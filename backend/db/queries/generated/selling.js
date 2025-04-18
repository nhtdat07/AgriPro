/**
 * Executes the 'getSalesInvoices' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getSalesInvoices(pool, params = {}) {
    try {
        const query = `SELECT sales_invoice.id AS id, sales_invoice.recorded_at AS recorded_at, customer.name AS customer_name
FROM sales_invoice JOIN customer ON sales_invoice.customer_id = customer.id
WHERE sales_invoice.agency_id = $1
    AND CASE WHEN $2::VARCHAR IS NOT NULL THEN sales_invoice.id = $2::VARCHAR ELSE true END
    AND CASE WHEN $3::DATE IS NOT NULL THEN DATE(sales_invoice.recorded_at) = $3::DATE ELSE true END
    AND CASE WHEN $4::VARCHAR IS NOT NULL THEN sales_invoice.customer_id = $4::VARCHAR ELSE true END
ORDER BY sales_invoice.id DESC
LIMIT $5 OFFSET $6;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

