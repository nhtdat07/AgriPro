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

/**
 * Executes the 'getSalesInvoiceById' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getSalesInvoiceById(pool, params = {}) {
    try {
        const query = `SELECT sales_invoice.id AS id, customer.name AS customer_name, sales_invoice.total_payment AS total_price
FROM sales_invoice JOIN customer ON customer.agency_id = $1 AND customer.id = sales_invoice.customer_id
WHERE sales_invoice.agency_id = $1 AND sales_invoice.id = $2;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'getProductsForSalesInvoice' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function getProductsForSalesInvoice(pool, params = {}) {
    try {
        const query = `SELECT product.name AS name, invoice_product.quantity AS quantity, invoice_product.price AS price
FROM invoice_product JOIN product ON product.agency_id = $1 AND invoice_product.product_id = product.id
WHERE invoice_product.agency_id = $1 AND invoice_product.invoice_id = $2;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'addSalesInvoice' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function addSalesInvoice(pool, params = {}) {
    try {
        const query = `INSERT INTO sales_invoice (agency_id, customer_id, recorded_at, total_payment)
VALUES ($1, $2, $3, $4)
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'addProductForSalesInvoice' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function addProductForSalesInvoice(pool, params = {}) {
    try {
        const query = `INSERT INTO invoice_product (agency_id, invoice_id, product_id, quantity, price)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

/**
 * Executes the 'updateInventory' query.
 * @param {Object} params - Parameters for the query.
 * @returns {Promise<Array>} - Query result rows.
 */
export async function updateInventory(pool, params = {}) {
    try {
        const query = `WITH ordered AS (
    -- Reorder the products by expired_date + imported_timestamp
    -- Add running total (cumulative sum of quantity of previous products)
    SELECT 
        agency_id,
        product_id,
        imported_timestamp,
        quantity,
        expired_date,
        SUM(quantity) OVER (
            PARTITION BY product_id 
            ORDER BY expired_date, imported_timestamp
        ) AS running_total
    FROM inventory_product
    WHERE agency_id = $1 AND product_id = $2 AND quantity > 0
),
to_update_raw AS (
    -- Add the previous running total
    SELECT 
        *,
        LAG(running_total, 1, 0) OVER (
            ORDER BY expired_date, imported_timestamp
        ) AS previous_total
    FROM ordered
),
to_update AS (
    -- Get the subtracted amount for each product
    SELECT 
        agency_id,
        product_id,
        imported_timestamp,
        quantity,
        GREATEST(
            LEAST(quantity, $3 - previous_total),
            0
        ) AS subtract_qty
    FROM to_update_raw
    WHERE $3 > previous_total
)
UPDATE inventory_product i
SET quantity = i.quantity - u.subtract_qty
FROM to_update u
WHERE i.agency_id = u.agency_id
    AND i.product_id = u.product_id
    AND i.imported_timestamp = u.imported_timestamp
RETURNING i.*;`;
        const { rows } = await pool.query(query, Object.values(params));
        return rows;
    } catch (error) {
        throw error;
    }
}

