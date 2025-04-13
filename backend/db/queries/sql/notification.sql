-- name: addNotification
INSERT INTO notification (agency_id, category, content)
VALUES ($1, $2, $3);

-- name: markNotificationAsRead
UPDATE notification
SET is_read = true
WHERE agency_id = $1 and id = $2
RETURNING *;