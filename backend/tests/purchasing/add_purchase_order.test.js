import { createTablePurchaseOrder } from '../../db/schema/generated/purchase_order.up.js';
import { createTableInventoryProduct } from '../../db/schema/generated/inventory.up.js';
import * as dbTest from '../test_util.js';
import { addPurchaseOrderService } from '../../services/purchasing/add_purchase_order.js';
import { formatDate } from '../../utils/format.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableInventoryProduct(pool);
    await createTablePurchaseOrder(pool);
});

afterEach(async () => {
    await pool.query(`
        TRUNCATE TABLE purchase_order RESTART IDENTITY;
        TRUNCATE TABLE order_product;
        TRUNCATE TABLE inventory_product;
    `);
});

afterAll(async () => {
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should store purchase order in the database successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const data = {
        supplierId: 'SU0001',
        products: [
            {
                productId: 'PR0001',
                expiredDate: '2027-03-28',
                quantity: 20,
                inPrice: 20000
            },
            {
                productId: 'PR0002',
                expiredDate: '2027-03-30',
                quantity: 15,
                inPrice: 14000
            }
        ]
    };

    await addPurchaseOrderService(pool, user, data);

    let { rows } = await pool.query(
        "SELECT * FROM purchase_order WHERE agency_id = $1 AND id = $2",
        [user.userAgencyId, 'PO0001']
    );
    expect(rows.length).toBe(1);
    expect(rows[0].supplier_id).toBe(data.supplierId);
    expect(rows[0].total_payment).toBe(610000);

    ({ rows } = await pool.query(
        "SELECT * FROM inventory_product WHERE agency_id = $1",
        [user.userAgencyId]
    ));
    let expectedData = [
        {
            product_id: 'PR0001',
            // expired_date: '2027-03-28 00:00:00',
            quantity: 20,
            in_price: 20000
        },
        {
            product_id: 'PR0002',
            // expired_date: '2027-03-30 00:00:00',
            quantity: 15,
            in_price: 14000
        }
    ]
    expect(rows.length).toBe(2);
    for (let i = 0; i < rows.length; i++) {
        rows[i].expired_date = formatDate(rows[i].expired_date);
        expect(rows[i]).toMatchObject(expectedData[i]);
    }

    ({ rows } = await pool.query(
        "SELECT * FROM order_product WHERE agency_id = $1 AND order_id = $2",
        [user.userAgencyId, 'PO0001']
    ));
    expectedData = [
        {
            product_id: 'PR0001',
            quantity: 20,
            price: 20000
        },
        {
            product_id: 'PR0002',
            quantity: 15,
            price: 14000
        }
    ]
    expect(rows.length).toBe(2);
    for (let i = 0; i < rows.length; i++) {
        expect(rows[i]).toMatchObject(expectedData[i]);
    }
});
