import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, './.env') });

import pkg from 'pg';
const { Pool } = pkg;
if (!globalThis.dbPool) {
    globalThis.dbPool = new Pool({ connectionString: process.env.DATABASE_URL });

    globalThis.dbPool
        .connect()
        .then(async (client) => {
            try {
                console.log("Connected to the database");
                await initSchema(client);
            } finally {
                client.release();
            }
        })
        .catch((err) => console.error("Error during DB initialization:", err));
}

export const pool = globalThis.dbPool;

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
import { addForeignKeyConstraints } from './db/schema/generated/foreign_keys.js';

// Init schema
const initSchema = async (pool) => {
    try {
        await createTableUserAgency(pool);
        await createTableConfiguration(pool);
        await createTableCustomer(pool);
        await createTableInventoryProduct(pool);
        await createTableNotification(pool);
        await createTableProduct(pool);
        await createTablePurchaseOrder(pool);
        await createTableSalesInvoice(pool);
        await createTableSupplier(pool);
        await addForeignKeyConstraints(pool);
        console.log('All tables initialized');
    } catch (err) {
        console.error('Error initializing schema:', err);
    }
};