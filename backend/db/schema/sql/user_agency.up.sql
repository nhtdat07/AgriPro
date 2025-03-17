-- name: createTableUserAgency
CREATE TABLE IF NOT EXISTS user_agency (
  "auto_id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "id" char(6) UNIQUE NOT NULL,
  "agency_name" varchar(100) NOT NULL DEFAULT '',
  "owner_name" varchar(100) NOT NULL DEFAULT '',
  "phone" char(10) NOT NULL DEFAULT '',
  "profile_photo_path" varchar(100),
  "tax_code" varchar(20),
  "address" varchar(255),
  "email" varchar(50) UNIQUE NOT NULL,
  "password_hash" char(60) NOT NULL
);

CREATE OR REPLACE FUNCTION set_custom_user_agency_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.id := 'UA' || LPAD(NEW.auto_id::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE TRIGGER set_user_agency_id
BEFORE INSERT ON user_agency
FOR EACH ROW
EXECUTE FUNCTION set_custom_user_agency_id();

CREATE UNIQUE INDEX IF NOT EXISTS user_agency_email_idx ON user_agency ("email");

COMMENT ON COLUMN user_agency."password_hash" IS 'Eksblowfish hash string of password';
