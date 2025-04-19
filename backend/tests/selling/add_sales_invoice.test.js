import { createTableSalesInvoice } from '../../db/schema/generated/sales_invoice.up.js';
import { createTableInventoryProduct } from '../../db/schema/generated/inventory.up.js';
import { createTableNotification } from '../../db/schema/generated/notification.up.js';
import * as dbTest from '../test_util.js';
import * as consts from '../../consts/consts.js';
import { formatTimestamp } from '../../utils/format.js';
import { addSalesInvoiceService } from '../../services/selling/add_sales_invoice.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableInventoryProduct(pool);
    await createTableSalesInvoice(pool);
    await createTableNotification(pool);
    await pool.query(`
        INSERT INTO inventory_product (agency_id, product_id, quantity, imported_timestamp, expired_date, in_price)
        VALUES 
            ('UA0001', 'PR0001', 20, '2025-03-29 11:35:00', '2027-03-28', 20000),
            ('UA0001', 'PR0001', 30, '2025-03-30 11:35:00', '2027-03-30', 20000),
            ('UA0001', 'PR0002', 15, '2025-03-29 11:35:00', '2027-03-30', 14000);
    `);
});

afterEach(async () => {
    await pool.query(`
        TRUNCATE TABLE sales_invoice RESTART IDENTITY;
        TRUNCATE TABLE invoice_product;
        TRUNCATE TABLE inventory_product;
        TRUNCATE TABLE notification RESTART IDENTITY;
    `);
});

afterAll(async () => {
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should store sales invoice in the database successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const data = {
        customerId: 'CU0001',
        products: [
            {
                productId: 'PR0001',
                quantity: 24,
                outPrice: 20000
            },
            {
                productId: 'PR0002',
                quantity: 12,
                outPrice: 14000
            }
        ]
    };

    await addSalesInvoiceService(pool, user, data);

    let { rows } = await pool.query(
        "SELECT * FROM sales_invoice WHERE agency_id = $1 AND id = $2",
        [user.userAgencyId, 'SI0001']
    );
    expect(rows.length).toBe(1);
    expect(rows[0].customer_id).toBe(data.customerId);
    expect(rows[0].total_payment).toBe(648000);

    ({ rows } = await pool.query(
        "SELECT * FROM inventory_product WHERE agency_id = $1 ORDER BY product_id, expired_date",
        [user.userAgencyId]
    ));
    let expectedData = [
        {
            product_id: 'PR0001',
            quantity: 0,
            expired_date: '2027-03-28'
        },
        {
            product_id: 'PR0001',
            quantity: 26,
            expired_date: '2027-03-30'
        },
        {
            product_id: 'PR0002',
            quantity: 3,
            expired_date: '2027-03-30'
        }
    ]
    expect(rows.length).toBe(3);
    for (let i = 0; i < rows.length; i++) {
        rows[i].expired_date = formatTimestamp(rows[i].expired_date).split(' ')[0];
        expect(rows[i]).toMatchObject(expectedData[i]);
    }

    ({ rows } = await pool.query(
        "SELECT * FROM invoice_product WHERE agency_id = $1 AND invoice_id = $2",
        [user.userAgencyId, 'SI0001']
    ));
    expectedData = [
        {
            product_id: 'PR0001',
            quantity: 24,
            price: 20000
        },
        {
            product_id: 'PR0002',
            quantity: 12,
            price: 14000
        }
    ]
    expect(rows.length).toBe(2);
    for (let i = 0; i < rows.length; i++) {
        expect(rows[i]).toMatchObject(expectedData[i]);
    }

    ({ rows } = await pool.query(
        "SELECT * FROM notification WHERE agency_id = $1 AND id = $2",
        [user.userAgencyId, 'NO0001']
    ));
    expect(rows.length).toBe(1);
    expect(rows[0].category).toBe(consts.NOTI_TYPES.SUCCESSFULLY_RECORDED);
});
