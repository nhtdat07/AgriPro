-- name: getTotalBenefit
SELECT SUM((invoice_product.price - inventory_product.in_price) * invoice_product.quantity)::INTEGER AS total_benefit
FROM inventory_product 
    JOIN invoice_product ON inventory_product.product_id = invoice_product.product_id 
        AND inventory_product.imported_timestamp = invoice_product.imported_timestamp
    JOIN sales_invoice ON sales_invoice.id = invoice_product.invoice_id
WHERE inventory_product.agency_id = $1 AND invoice_product.agency_id = $1 AND sales_invoice.agency_id = $1
    AND sales_invoice.recorded_at >= $2::DATE AND sales_invoice.recorded_at < $3::DATE + INTERVAL '1 day';

-- name: getStatisticsPurchasing
SELECT COUNT(*)::INTEGER AS order_quantity, SUM(total_payment)::INTEGER AS total_purchasing
FROM purchase_order
WHERE agency_id = $1 AND recorded_at >= $2::DATE AND recorded_at < $3::DATE + INTERVAL '1 day';

-- name: getStatisticsSelling
SELECT COUNT(*)::INTEGER AS invoice_quantity, SUM(total_payment)::INTEGER AS total_selling
FROM sales_invoice
WHERE agency_id = $1 AND recorded_at >= $2::DATE AND recorded_at < $3::DATE + INTERVAL '1 day';

-- name: getSoldProducts
SELECT invoice_product.product_id AS product_id, product.name AS product_name, 
    SUM(invoice_product.quantity)::INTEGER AS sold_quantity
FROM invoice_product 
    JOIN product ON product.id = invoice_product.product_id
    JOIN sales_invoice ON sales_invoice.id = invoice_product.invoice_id
WHERE invoice_product.agency_id = $1 AND product.agency_id = $1 AND sales_invoice.agency_id = $1
    AND CASE WHEN $2::VARCHAR IS NOT NULL THEN product.name ILIKE $2::VARCHAR ELSE true END
    AND sales_invoice.recorded_at >= $3::DATE AND sales_invoice.recorded_at < $4::DATE + INTERVAL '1 day'
GROUP BY invoice_product.product_id, product.name
ORDER BY SUM(invoice_product.quantity) DESC
LIMIT $5 OFFSET $6;

-- name: getActiveCustomers
SELECT customer.id AS customer_id, customer.name AS customer_name, 
    SUM(sales_invoice.total_payment)::INTEGER AS buying_amount
FROM customer JOIN sales_invoice ON sales_invoice.customer_id = customer.id
WHERE customer.agency_id = $1 AND sales_invoice.agency_id = $1
    AND CASE WHEN $2::VARCHAR IS NOT NULL THEN customer.name ILIKE $2::VARCHAR ELSE true END
    AND sales_invoice.recorded_at >= $3::DATE AND sales_invoice.recorded_at < $4::DATE + INTERVAL '1 day'
GROUP BY customer.id, customer.name
ORDER BY SUM(sales_invoice.total_payment) DESC
LIMIT $5 OFFSET $6;