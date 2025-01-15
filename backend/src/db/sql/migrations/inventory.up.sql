CREATE TABLE inventory_product (
  "agency_id" char(6) NOT NULL,
  "product_id" char(6) NOT NULL,
  "quantity" int NOT NULL DEFAULT 0,
  "imported_timestamp" timestamp NOT NULL DEFAULT current_timestamp,
  "expired_date" date NOT NULL,
  "in_price" integer NOT NULL,
  PRIMARY KEY ("agency_id", "product_id", "imported_timestamp")
);