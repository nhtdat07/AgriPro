const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

// Functions for creating tables
const { createTableUserAgency } = require('./db/schema/generated/user_agency.up');
const { createTableConfiguration } = require('./db/schema/generated/config.up');
const { createTableCustomer } = require('./db/schema/generated/customer.up');
const { createTableInventoryProduct } = require('./db/schema/generated/inventory.up');
const { createTableNotification } = require('./db/schema/generated/notification.up');
const { createTableProduct } = require('./db/schema/generated/product.up');
const { createTablePurchaseOrder } = require('./db/schema/generated/purchase_order.up');
const { createTableSalesInvoice } = require('./db/schema/generated/sales_invoice.up');
const { createTableSupplier } = require('./db/schema/generated/supplier.up');

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
        console.log('All tables initialized');
    } catch (err) {
        console.error('Error initializing schema:', err);
    }
};

// Connect to DB
pool.on('connect', async () => {
    console.log('Connected to the database');
    await initSchema();
});

module.exports = pool;