-- name: addProduct
INSERT INTO product (agency_id, name, brand, category, out_price, production_place, usages, guidelines, image_path)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;

-- name: getProductById
SELECT * FROM product WHERE agency_id = $1 AND id = $2;

-- name: getProductQuantityInInventory
SELECT SUM(quantity) AS total_quantity FROM inventory_product WHERE agency_id = $1 AND product_id = $2;

-- name: updateProduct
UPDATE product
SET
    name = CASE WHEN $1::VARCHAR IS NOT NULL THEN $1::VARCHAR ELSE name END,
    brand = CASE WHEN $2::VARCHAR IS NOT NULL THEN $2::VARCHAR ELSE brand END,
    category = CASE WHEN $3::product_type IS NOT NULL THEN $3::product_type ELSE category END,
    production_place = CASE WHEN $4::VARCHAR IS NOT NULL THEN $4::VARCHAR ELSE production_place END,
    out_price = CASE WHEN $5::INTEGER IS NOT NULL THEN $5::INTEGER ELSE out_price END,
    usages = CASE WHEN $6::VARCHAR IS NOT NULL THEN $6 ELSE usages::VARCHAR END,
    guidelines = CASE WHEN $7::VARCHAR IS NOT NULL THEN $7 ELSE guidelines::VARCHAR END,
    image_path = CASE WHEN $8::VARCHAR IS NOT NULL THEN $8 ELSE image_path::VARCHAR END
WHERE agency_id = $9 AND id = $10 AND is_deleted = false
RETURNING *;

-- name: markProductAsDeleted
UPDATE product
SET is_deleted = true
WHERE agency_id = $1 AND id = $2 AND is_deleted = false
RETURNING *;