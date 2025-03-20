-- name: addProduct
INSERT INTO product (agency_id, name, brand, category, out_price, production_place, usages, guidelines, image_path)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;

-- name: getProductById
SELECT * FROM product WHERE agency_id = $1 AND id = $2;

-- name: getProductQuantityInInventory
SELECT SUM(quantity) AS total_quantity FROM inventory_product WHERE agency_id = $1 AND product_id = $2;