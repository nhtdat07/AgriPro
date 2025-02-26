-- name: getUserByEmail
SELECT * FROM users WHERE email = $1;

-- name: createUser
INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *;