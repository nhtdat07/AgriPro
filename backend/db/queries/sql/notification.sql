-- name: addNotification
INSERT INTO notification (agency_id, category, content)
VALUES ($1, $2, $3);