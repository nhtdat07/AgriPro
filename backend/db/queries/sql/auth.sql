-- name: getUserByEmail
SELECT * FROM user_agency WHERE email = $1;

-- name: addUser
INSERT INTO user_agency (agency_name, owner_name, email, phone, password_hash) 
VALUES ($1, $2, $3, $4, $5)
RETURNING *;