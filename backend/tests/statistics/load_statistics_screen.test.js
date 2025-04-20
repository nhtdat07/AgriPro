import * as errors from '../../errors/error_handler.js';
import { createTableInventoryProduct } from '../../db/schema/generated/inventory.up.js';
import { createTablePurchaseOrder } from '../../db/schema/generated/purchase_order.up.js';
import { createTableSalesInvoice } from '../../db/schema/generated/sales_invoice.up.js';
import * as dbTest from '../test_util.js';
import { loadStatisticsScreenService } from '../../services/statistics/load_statistics_screen.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableInventoryProduct(pool);
    await createTableSalesInvoice(pool);
    await createTablePurchaseOrder(pool);
    try {
        await pool.query(`
            INSERT INTO invoice_product (agency_id, invoice_id, product_id, quantity, price, imported_timestamp)
            VALUES
                ('UA0001', 'SI0001', 'PR0001', 20, 24000, '2025-03-29 11:35:00'),
                ('UA0001', 'SI0001', 'PR0001', 10, 24000, '2025-03-30 11:35:00'),
                ('UA0001', 'SI0001', 'PR0002', 5, 17000, '2025-03-29 11:35:00'),
                ('UA0001', 'SI0002', 'PR0001', 15, 22000, '2025-03-29 11:35:00'),
                ('UA0001', 'SI0002', 'PR0001', 8, 22000, '2025-03-30 11:35:00'),
                ('UA0001', 'SI0002', 'PR0002', 12, 18000, '2025-03-29 11:35:00');

            INSERT INTO inventory_product (agency_id, product_id, quantity, imported_timestamp, expired_date, in_price)
            VALUES 
                ('UA0001', 'PR0001', 20, '2025-03-29 11:35:00', '2027-03-28', 20000),
                ('UA0001', 'PR0001', 30, '2025-03-30 11:35:00', '2027-03-30', 19000),
                ('UA0001', 'PR0002', 15, '2025-03-29 11:35:00', '2027-03-30', 14000);

            INSERT INTO sales_invoice (agency_id, customer_id, total_payment, recorded_at)
            VALUES 
                ('UA0001', 'CU0001', 805000, '2025-04-19 14:25:34'),
                ('UA0001', 'CU0002', 722000, '2025-04-30 11:30:00'),
                ('UA0001', 'CU0001', 1015000, '2025-05-12 08:55:21');

            INSERT INTO purchase_order (agency_id, supplier_id, total_payment, recorded_at)
            VALUES 
                ('UA0001', 'SU0001', 1712000, '2025-04-01 09:22:44'),
                ('UA0001', 'SU0002', 2193500, '2025-04-28 16:59:04'),
                ('UA0001', 'SU0001', 906000, '2025-05-05 15:11:08');
        `);
    } catch (error) {
        console.error('Error insert data:', error);
        throw error;
    }
});

afterAll(async () => {
    await pool.query(`
        TRUNCATE TABLE purchase_order RESTART IDENTITY;
        TRUNCATE TABLE sales_invoice RESTART IDENTITY;
        TRUNCATE TABLE invoice_product;
        TRUNCATE TABLE inventory_product;
    `);
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should return data for statistics screen successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        startDate: '2025-04-01',
        endDate: '2025-04-30'
    };

    const expectedResponse = {
        message: 'Load statistics screen successfully',
        data: {
            totalBenefit: 247000,
            purchaseOrdersAmount: 2,
            totalPurchase: 3905500,
            salesInvoicesAmount: 2,
            totalSale: 1527000
        }
    };

    const result = await loadStatisticsScreenService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});
