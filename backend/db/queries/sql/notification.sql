-- name: addNotification
INSERT INTO notification (agency_id, category, content)
VALUES ($1, $2, $3);

-- name: getNotifications
SELECT *, 
  EXISTS (
    SELECT 1 
    FROM notification n2 
    WHERE n2.agency_id = $1 AND n2.is_read = false
  ) AS all_read
FROM notification
WHERE agency_id = $1
ORDER BY id DESC
LIMIT $2 OFFSET $3;

-- name: markNotificationAsRead
UPDATE notification
SET is_read = true
WHERE agency_id = $1 and id = $2
RETURNING *;