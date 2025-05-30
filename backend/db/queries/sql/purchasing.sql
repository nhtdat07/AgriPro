-- name: getPurchaseOrders
SELECT purchase_order.id AS id, purchase_order.recorded_at AS recorded_at, supplier.name AS supplier_name
FROM purchase_order JOIN supplier ON purchase_order.supplier_id = supplier.id
WHERE purchase_order.agency_id = $1
    AND CASE WHEN $2::VARCHAR IS NOT NULL THEN purchase_order.id = $2::VARCHAR ELSE true END
    AND CASE WHEN $3::DATE IS NOT NULL THEN DATE(purchase_order.recorded_at) = $3::DATE ELSE true END
    AND CASE WHEN $4::VARCHAR IS NOT NULL THEN supplier.name ILIKE $4::VARCHAR ELSE true END
ORDER BY purchase_order.id DESC
LIMIT $5 OFFSET $6;

-- name: addPurchaseOrder
INSERT INTO purchase_order (agency_id, supplier_id, recorded_at, total_payment)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: addInventory
INSERT INTO inventory_product (agency_id, product_id, quantity, imported_timestamp, expired_date, in_price)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: addProductForPurchaseOrder
INSERT INTO order_product (agency_id, order_id, product_id, quantity, price)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: getPurchaseOrderById
SELECT purchase_order.id AS id, supplier.name AS supplier_name, purchase_order.total_payment AS total_payment
FROM purchase_order JOIN supplier ON supplier.agency_id = $1 AND supplier.id = purchase_order.supplier_id
WHERE purchase_order.agency_id = $1 AND purchase_order.id = $2;

-- name: getProductsForPurchaseOrder
SELECT product.name AS name, inventory_product.expired_date AS expired_date, 
    order_product.quantity AS quantity, order_product.price AS price
FROM order_product 
    JOIN product ON product.agency_id = $1 AND order_product.product_id = product.id
    JOIN purchase_order ON purchase_order.agency_id = $1 AND purchase_order.id = order_product.order_id
    JOIN inventory_product 
        ON inventory_product.agency_id = $1 
            AND inventory_product.product_id = order_product.product_id 
            AND inventory_product.imported_timestamp = purchase_order.recorded_at
WHERE order_product.agency_id = $1 AND order_product.order_id = $2;