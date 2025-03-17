import pkg from 'pg';
const { Pool } = pkg;

// Functions for creating tables
import { createTableUserAgency } from './db/schema/generated/user_agency.up.js';
import { createTableConfiguration } from './db/schema/generated/config.up.js';
import { createTableCustomer } from './db/schema/generated/customer.up.js';
import { createTableInventoryProduct } from './db/schema/generated/inventory.up.js';
import { createTableNotification } from './db/schema/generated/notification.up.js';
import { createTableProduct } from './db/schema/generated/product.up.js';
import { createTablePurchaseOrder } from './db/schema/generated/purchase_order.up.js';
import { createTableSalesInvoice } from './db/schema/generated/sales_invoice.up.js';
import { createTableSupplier } from './db/schema/generated/supplier.up.js';

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

// Init schema
const initSchema = async () => {
    try {
        await createTableUserAgency();
        await createTableConfiguration();
        await createTableCustomer();
        await createTableInventoryProduct();
        await createTableNotification();
        await createTableProduct();
        await createTablePurchaseOrder();
        await createTableSalesInvoice();
        await createTableSupplier();
        // console.log('All tables initialized');
    } catch (err) {
        // console.error('Error initializing schema:', err);
    }
};

// Connect to DB
pool.on('connect', async () => {
    console.log('Connected to the database');
    await initSchema();
});