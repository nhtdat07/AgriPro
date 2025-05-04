-- name: addForeignKeyConstraints
DO $$
BEGIN
    -- FK: product.agency_id -> user_agency.id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'product'
          AND constraint_name = 'fk_product_agency'
    ) THEN
        ALTER TABLE product
        ADD CONSTRAINT fk_product_agency
        FOREIGN KEY (agency_id) REFERENCES user_agency(id);
    END IF;

    -- FK: configuration.agency_id -> user_agency.id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'configuration'
          AND constraint_name = 'fk_configuration_agency'
    ) THEN
        ALTER TABLE configuration
        ADD CONSTRAINT fk_configuration_agency
        FOREIGN KEY (agency_id) REFERENCES user_agency(id);
    END IF;

    -- FK: notification.agency_id -> user_agency.id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'notification'
          AND constraint_name = 'fk_notification_agency'
    ) THEN
        ALTER TABLE notification
        ADD CONSTRAINT fk_notification_agency
        FOREIGN KEY (agency_id) REFERENCES user_agency(id);
    END IF;

    -- FK: supplier.agency_id -> user_agency.id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'supplier'
          AND constraint_name = 'fk_supplier_agency'
    ) THEN
        ALTER TABLE supplier
        ADD CONSTRAINT fk_supplier_agency
        FOREIGN KEY (agency_id) REFERENCES user_agency(id);
    END IF;

    -- FK: customer.agency_id -> user_agency.id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'customer'
          AND constraint_name = 'fk_customer_agency'
    ) THEN
        ALTER TABLE customer
        ADD CONSTRAINT fk_customer_agency
        FOREIGN KEY (agency_id) REFERENCES user_agency(id);
    END IF;

    -- FK: purchase_order.agency_id -> user_agency.id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'purchase_order'
          AND constraint_name = 'fk_purchase_order_agency'
    ) THEN
        ALTER TABLE purchase_order
        ADD CONSTRAINT fk_purchase_order_agency
        FOREIGN KEY (agency_id) REFERENCES user_agency(id);
    END IF;

    -- FK: purchase_order.(agency_id, supplier_id) -> supplier.(agency_id, id)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'purchase_order'
          AND constraint_name = 'fk_purchase_order_supplier'
    ) THEN
        ALTER TABLE purchase_order
        ADD CONSTRAINT fk_purchase_order_supplier
        FOREIGN KEY (agency_id, supplier_id) REFERENCES supplier(agency_id, id);
    END IF;

    -- FK: sales_invoice.agency_id -> user_agency.id
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'sales_invoice'
          AND constraint_name = 'fk_sales_invoice_agency'
    ) THEN
        ALTER TABLE sales_invoice
        ADD CONSTRAINT fk_sales_invoice_agency
        FOREIGN KEY (agency_id) REFERENCES user_agency(id);
    END IF;

    -- FK: sales_invoice.(agency_id, customer_id) -> customer.(agency_id, id)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'sales_invoice'
          AND constraint_name = 'fk_sales_invoice_customer'
    ) THEN
        ALTER TABLE sales_invoice
        ADD CONSTRAINT fk_sales_invoice_customer
        FOREIGN KEY (agency_id, customer_id) REFERENCES customer(agency_id, id);
    END IF;

    -- FK: inventory_product.(agency_id, product_id) -> product.(agency_id, id)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'inventory_product'
          AND constraint_name = 'fk_inventory_product'
    ) THEN
        ALTER TABLE inventory_product
        ADD CONSTRAINT fk_inventory_product
        FOREIGN KEY (agency_id, product_id) REFERENCES product(agency_id, id);
    END IF;

    -- FK: order_product.(agency_id, product_id) -> product.(agency_id, id)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'order_product'
          AND constraint_name = 'fk_order_product_product'
    ) THEN
        ALTER TABLE order_product
        ADD CONSTRAINT fk_order_product_product
        FOREIGN KEY (agency_id, product_id) REFERENCES product(agency_id, id);
    END IF;

    -- FK: order_product.(agency_id, order_id) -> purchase_order.(agency_id, id)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'order_product'
          AND constraint_name = 'fk_order_product_order'
    ) THEN
        ALTER TABLE order_product
        ADD CONSTRAINT fk_order_product_order
        FOREIGN KEY (agency_id, order_id) REFERENCES purchase_order(agency_id, id);
    END IF;

    -- FK: invoice_product.(agency_id, product_id, imported_timestamp) -> inventory_product.(agency_id, product_id, imported_timestamp)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'invoice_product'
          AND constraint_name = 'fk_invoice_product_product'
    ) THEN
        ALTER TABLE invoice_product
        ADD CONSTRAINT fk_invoice_product_product
        FOREIGN KEY (agency_id, product_id, imported_timestamp) REFERENCES inventory_product(agency_id, product_id, imported_timestamp);
    END IF;

    -- FK: invoice_product.(agency_id, invoice_id) -> sales_invoice.(agency_id, id)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY' AND table_name = 'invoice_product'
          AND constraint_name = 'fk_invoice_product_invoice'
    ) THEN
        ALTER TABLE invoice_product
        ADD CONSTRAINT fk_invoice_product_invoice
        FOREIGN KEY (agency_id, invoice_id) REFERENCES sales_invoice(agency_id, id);
    END IF;
END
$$;