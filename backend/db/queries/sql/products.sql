-- name: addProduct
INSERT INTO product (agency_id, name, brand, category, out_price, production_place, usages, guidelines, image_path)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;