-- name: getCustomers
SELECT * FROM customer
WHERE agency_id = $1 AND is_deleted = false
    AND CASE WHEN $2::VARCHAR IS NOT NULL THEN name ILIKE $2::VARCHAR ELSE true END
    AND CASE WHEN $3::VARCHAR IS NOT NULL THEN address ILIKE $3::VARCHAR ELSE true END
    AND CASE WHEN $4::VARCHAR IS NOT NULL THEN phone ILIKE $4::VARCHAR ELSE true END
ORDER BY id DESC
LIMIT $5 OFFSET $6;

-- name: addCustomer
INSERT INTO customer (agency_id, name, address, phone, email)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: getCustomerById
SELECT * FROM customer WHERE agency_id = $1 AND id = $2 AND is_deleted = false;

-- name: updateCustomer
UPDATE customer
SET
    name = CASE WHEN $1::VARCHAR IS NOT NULL THEN $1::VARCHAR ELSE name END,
    address = CASE WHEN $2::VARCHAR IS NOT NULL THEN $2::VARCHAR ELSE address END,
    phone = CASE WHEN $3::VARCHAR IS NOT NULL THEN $3::VARCHAR ELSE phone END,
    email = CASE WHEN $4::VARCHAR IS NOT NULL THEN $4 ELSE email::VARCHAR END
WHERE agency_id = $5 AND id = $6 AND is_deleted = false
RETURNING *;

-- name: markCustomerAsDeleted
UPDATE customer
SET is_deleted = true
WHERE agency_id = $1 AND id = $2 AND is_deleted = false
RETURNING *;