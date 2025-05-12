import { createTableCustomer } from '../../db/schema/generated/customer.up.js';
import { createTableSalesInvoice } from '../../db/schema/generated/sales_invoice.up.js';
import { getListActiveCustomersService } from '../../services/statistics/get_list_active_customers.js';
import * as dbTest from '../test_util.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableCustomer(pool);
    await createTableSalesInvoice(pool);
    try {
        await pool.query(`
            INSERT INTO customer (agency_id, name, address, phone, email) 
            VALUES 
                ('UA0001', 'Nguyễn Văn A', 'Mỹ Tho, Tiền Giang', '0123456789', 'abc@gmail.com'),
                ('UA0001', 'Trần Thị B', 'Châu Thành, Tiền Giang', '0145698732', 'ttb@gmail.com'),
                ('UA0001', 'Lê Thị C', 'Quận 12, Thành phố Hồ Chí Minh', '0945621378', '');

            INSERT INTO sales_invoice (agency_id, customer_id, total_payment, recorded_at)
            VALUES 
                ('UA0001', 'CU0001', 805000, '2025-04-01 14:25:34'),
                ('UA0001', 'CU0002', 722000, '2025-04-07 15:00:01'),
                ('UA0001', 'CU0002', 604000, '2025-04-11 09:52:40'),
                ('UA0001', 'CU0003', 912000, '2025-04-20 17:58:51'),
                ('UA0001', 'CU0001', 248000, '2025-04-30 11:30:00'),
                ('UA0001', 'CU0003', 612000, '2025-05-10 19:05:14'),
                ('UA0001', 'CU0001', 1015000, '2025-05-12 08:55:21');
        `);
    } catch (error) {
        console.error('Error insert data:', error);
        throw error;
    }
});

afterAll(async () => {
    await pool.query(`
        TRUNCATE TABLE customer RESTART IDENTITY;
        TRUNCATE TABLE sales_invoice RESTART IDENTITY;
    `);
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should return active customers successfully with no constraints", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        startDate: '2025-04-01',
        endDate: '2025-04-30',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list active customers successfully',
        data: {
            customers: [
                {
                    customerId: 'CU0002',
                    customerName: 'Trần Thị B',
                    buyingAmount: 1326000
                },
                {
                    customerId: 'CU0001',
                    customerName: 'Nguyễn Văn A',
                    buyingAmount: 1053000
                },
                {
                    customerId: 'CU0003',
                    customerName: 'Lê Thị C',
                    buyingAmount: 912000
                }
            ],
            pagination: { offset: 3 }
        }
    }

    const result = await getListActiveCustomersService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return active customers successfully with offset + limit", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        startDate: '2025-04-01',
        endDate: '2025-04-30',
        limit: 1,
        offset: 1
    };

    const expectedResponse = {
        message: 'Get list active customers successfully',
        data: {
            customers: [
                {
                    customerId: 'CU0001',
                    customerName: 'Nguyễn Văn A',
                    buyingAmount: 1053000
                }
            ],
            pagination: { offset: 2 }
        }
    }

    const result = await getListActiveCustomersService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return active customers successfully with query of customerName", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        startDate: '2025-04-01',
        endDate: '2025-04-30',
        customerName: 'C',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list active customers successfully',
        data: {
            customers: [
                {
                    customerId: 'CU0003',
                    customerName: 'Lê Thị C',
                    buyingAmount: 912000
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListActiveCustomersService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});
