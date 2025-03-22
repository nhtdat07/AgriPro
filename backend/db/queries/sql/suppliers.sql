-- name: addSupplier
INSERT INTO supplier (agency_id, name, address, phone, email)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: markSupplierAsDeleted
UPDATE supplier
SET is_deleted = true
WHERE agency_id = $1 AND id = $2 AND is_deleted = false
RETURNING *;