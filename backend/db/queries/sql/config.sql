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