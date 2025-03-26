-- name: addCustomer
INSERT INTO customer (agency_id, name, address, phone, email)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;