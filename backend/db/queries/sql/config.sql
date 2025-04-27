-- name: addDefaultConfig
INSERT INTO configuration (agency_id, category, key, value)
VALUES
    ($1, 'INVENTORY_PARAMS', 'warning_expired', '5'),
    ($1, 'INVENTORY_PARAMS', 'warning_out_of_stock', '5'),
    ($1, 'PRINT_FORMAT', 'left_margin', '3'),
    ($1, 'PRINT_FORMAT', 'right_margin', '2'),
    ($1, 'PRINT_FORMAT', 'top_margin', '2'),
    ($1, 'PRINT_FORMAT', 'bottom_margin', '2'),
    ($1, 'PRINT_FORMAT', 'font_size', '13')
RETURNING *;

-- name: getConfig
SELECT * FROM configuration WHERE agency_id = $1 AND key = ANY($2);

-- name: getUserById
SELECT * FROM user_agency WHERE id = $1;

-- name: getSettings
SELECT * FROM configuration WHERE agency_id = $1;

-- name: updateProfile
UPDATE user_agency
SET
    agency_name = CASE WHEN $1::VARCHAR IS NOT NULL THEN $1::VARCHAR ELSE agency_name END,
    owner_name = CASE WHEN $2::VARCHAR IS NOT NULL THEN $2::VARCHAR ELSE owner_name END,
    address = CASE WHEN $3::VARCHAR IS NOT NULL THEN $3::VARCHAR ELSE address END,
    tax_code = CASE WHEN $4::VARCHAR IS NOT NULL THEN $4::VARCHAR ELSE tax_code END,
    phone = CASE WHEN $5::VARCHAR IS NOT NULL THEN $5::VARCHAR ELSE phone END,
    email = CASE WHEN $6::VARCHAR IS NOT NULL THEN $6 ELSE email END,
    profile_photo_path = CASE WHEN $7::VARCHAR IS NOT NULL THEN $7 ELSE profile_photo_path END
WHERE id = $8
RETURNING *;

-- name: updateConfig
UPDATE configuration
SET value = $4
WHERE agency_id = $1 AND category = $2 AND key = $3
RETURNING *;

-- name: updatePassword
UPDATE user_agency
SET password_hash = $2
WHERE id = $1
RETURNING *;