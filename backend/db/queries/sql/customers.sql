-- name: addCustomer
INSERT INTO customer (agency_id, name, address, phone, email)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: getCustomerById
SELECT * FROM customer WHERE agency_id = $1 AND id = $2 AND is_deleted = false;