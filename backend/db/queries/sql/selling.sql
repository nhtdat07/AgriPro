-- name: getSalesInvoices
SELECT sales_invoice.id AS id, sales_invoice.recorded_at AS recorded_at, customer.name AS customer_name
FROM sales_invoice JOIN customer ON sales_invoice.customer_id = customer.id
WHERE sales_invoice.agency_id = $1
    AND CASE WHEN $2::VARCHAR IS NOT NULL THEN sales_invoice.id = $2::VARCHAR ELSE true END
    AND CASE WHEN $3::DATE IS NOT NULL THEN DATE(sales_invoice.recorded_at) = $3::DATE ELSE true END
    AND CASE WHEN $4::VARCHAR IS NOT NULL THEN sales_invoice.customer_id = $4::VARCHAR ELSE true END
ORDER BY sales_invoice.id DESC
LIMIT $5 OFFSET $6;

-- name: getSalesInvoiceById
SELECT sales_invoice.id AS id, customer.name AS customer_name, sales_invoice.total_payment AS total_price
FROM sales_invoice JOIN customer ON customer.agency_id = $1 AND customer.id = sales_invoice.customer_id
WHERE sales_invoice.agency_id = $1 AND sales_invoice.id = $2;

-- name: getProductsForSalesInvoice
SELECT product.name AS name, SUM(invoice_product.quantity)::INTEGER AS quantity, invoice_product.price AS price
FROM invoice_product JOIN product ON invoice_product.product_id = product.id
WHERE product.agency_id = $1 AND invoice_product.agency_id = $1 AND invoice_product.invoice_id = $2
GROUP BY invoice_product.product_id, product.name, invoice_product.price;

-- name: addSalesInvoice
INSERT INTO sales_invoice (agency_id, customer_id, recorded_at, total_payment)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: addProductForSalesInvoice
INSERT INTO invoice_product (agency_id, invoice_id, product_id, quantity, price, imported_timestamp)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: updateInventory
WITH ordered AS (
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
RETURNING i.*, u.subtract_qty;