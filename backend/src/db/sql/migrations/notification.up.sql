CREATE TYPE "noti_type" AS ENUM (
  'CẢNH BÁO HẾT HÀNG',
  'CẢNH BÁO HẾT HẠN SỬ DỤNG',
  'GHI NHẬN THÀNH CÔNG',
  'CẢNH BÁO THIẾU THÔNG TIN'
);

CREATE TABLE notification (
  "auto_id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "id" char(6) UNIQUE NOT NULL,
  "agency_id" char(6) NOT NULL,
  "category" noti_type NOT NULL,
  "content" text NOT NULL,
  "timestamp" timestamp NOT NULL DEFAULT current_timestamp,
  "is_read" bool NOT NULL DEFAULT false
);

CREATE OR REPLACE FUNCTION set_custom_notification_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.id := 'SI' || LPAD(NEW.auto_id::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER set_notification_id
BEFORE INSERT ON notification
FOR EACH ROW
EXECUTE FUNCTION set_custom_notification_id();