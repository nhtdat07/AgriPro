-- name: addPurchaseOrder
INSERT INTO purchase_order (agency_id, supplier_id, total_payment)
VALUES ($1, $2, $3)
RETURNING *;

-- name: addInventory
INSERT INTO inventory_product (agency_id, product_id, quantity, expired_date, in_price)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: addProductForPurchaseOrder
INSERT INTO order_product (agency_id, order_id, product_id, quantity, price)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;