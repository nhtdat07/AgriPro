-- name: addSupplier
INSERT INTO supplier (agency_id, name, address, phone, email)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;