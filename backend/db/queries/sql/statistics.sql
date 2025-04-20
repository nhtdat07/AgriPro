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