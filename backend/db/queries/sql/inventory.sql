-- name: getInventory
SELECT inventory_product.product_id AS product_id, product.name AS product_name, inventory_product.quantity AS quantity,
    inventory_product.imported_timestamp AS imported_timestamp, inventory_product.expired_date AS expired_date,
    inventory_product.in_price AS in_price
FROM inventory_product 
    JOIN product ON inventory_product.product_id = product.id AND product.agency_id = $1 AND product.is_deleted = false
    JOIN (
        SELECT product_id, SUM(quantity) AS total_quantity
        FROM inventory_product
        WHERE inventory_product.agency_id = $1
        GROUP BY product_id
    ) quantities ON inventory_product.product_id = quantities.product_id
WHERE inventory_product.agency_id = $1 AND inventory_product.quantity > 0
    AND CASE WHEN $2::VARCHAR IS NOT NULL THEN inventory_product.product_id = $2::VARCHAR ELSE true END
    AND CASE WHEN $3::DATE IS NOT NULL THEN DATE(inventory_product.imported_timestamp) = $3::DATE ELSE true END
    AND CASE WHEN $4::DATE IS NOT NULL THEN DATE(inventory_product.expired_date) = $4::DATE ELSE true END
    AND CASE WHEN $5::DATE IS NOT NULL THEN DATE(inventory_product.expired_date) <= $5::DATE ELSE true END
    AND CASE WHEN $6::INTEGER IS NOT NULL THEN quantities.total_quantity <= $6::INTEGER ELSE true END
ORDER BY inventory_product.imported_timestamp DESC
LIMIT $7 OFFSET $8;

-- name: getProductsAboutToExpire
SELECT inventory_product.product_id AS id, product.name AS name, 
    inventory_product.imported_timestamp AS imported_timestamp, inventory_product.expired_date AS expired_date
FROM inventory_product JOIN product ON inventory_product.product_id = product.id 
WHERE inventory_product.agency_id = $1 AND product.agency_id = $1 AND product.is_deleted = false
    AND DATE(inventory_product.expired_date) <= $2::DATE AND inventory_product.quantity > 0;

-- name: getProductsAboutToBeOutOfStock
SELECT inventory_product.product_id AS id, product.name AS name, 
    SUM(inventory_product.quantity)::INTEGER AS total_quantity
FROM inventory_product JOIN product ON inventory_product.product_id = product.id 
WHERE inventory_product.agency_id = $1 AND product.agency_id = $1 AND product.is_deleted = false
GROUP BY inventory_product.product_id, product.name
HAVING SUM(inventory_product.quantity) <= $2;