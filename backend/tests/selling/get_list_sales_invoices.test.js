import { createTableSalesInvoice } from '../../db/schema/generated/sales_invoice.up.js';
import { createTableCustomer } from '../../db/schema/generated/customer.up.js';
import * as dbTest from '../test_util.js';
import { getListSalesInvoicesService } from '../../services/selling/get_list_sales_invoices.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableSalesInvoice(pool);
    await createTableCustomer(pool);
    try {
        await pool.query(`
            INSERT INTO customer (agency_id, name, address, phone) 
            VALUES 
                ('UA0001', 'Nguyễn Văn A', '', ''),
                ('UA0001', 'Lê Thị B', '', '');

            INSERT INTO sales_invoice (agency_id, recorded_at, customer_id)
            VALUES 
                ('UA0001', '2025-03-29 11:35:00', 'CU0001'),
                ('UA0001', '2025-03-31 22:29:43', 'CU0002');
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

test("Happy case: should return sales invoices successfully with no constraints", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list sales invoices successfully',
        data: {
            salesInvoices: [
                {
                    salesInvoiceId: "SI0002",
                    // recordedTimestamp: "2025-03-31 22:29:43",
                    customerName: "Lê Thị B",
                },
                {
                    salesInvoiceId: "SI0001",
                    // recordedTimestamp: "2025-03-29 11:35:00",
                    customerName: "Nguyễn Văn A",
                }
            ],
            pagination: { offset: 2 }
        }
    }

    const result = await getListSalesInvoicesService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});

test("Happy case: should return sales invoices successfully with offset + limit", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        limit: 1,
        offset: 1
    };

    const expectedResponse = {
        message: 'Get list sales invoices successfully',
        data: {
            salesInvoices: [
                {
                    salesInvoiceId: "SI0001",
                    // recordedTimestamp: "2025-03-29 11:35:00",
                    customerName: "Nguyễn Văn A",
                }
            ],
            pagination: { offset: 2 }
        }
    }

    const result = await getListSalesInvoicesService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});

test("Happy case: should return sales invoices successfully with query of salesInvoiceId", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        salesInvoiceId: 'SI0001',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list sales invoices successfully',
        data: {
            salesInvoices: [
                {
                    salesInvoiceId: "SI0001",
                    // recordedTimestamp: "2025-03-29 11:35:00",
                    customerName: "Nguyễn Văn A",
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListSalesInvoicesService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});

test("Happy case: should return sales invoices successfully with query of recordedDate", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        recordedDate: '2025-03-31',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list sales invoices successfully',
        data: {
            salesInvoices: [
                {
                    salesInvoiceId: "SI0002",
                    // recordedTimestamp: "2025-03-31 22:29:43",
                    customerName: "Lê Thị B",
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListSalesInvoicesService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});

test("Happy case: should return sales invoices successfully with query of customerName", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        customerName: 'Thị B',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list sales invoices successfully',
        data: {
            salesInvoices: [
                {
                    salesInvoiceId: "SI0002",
                    // recordedTimestamp: "2025-03-31 22:29:43",
                    customerName: "Lê Thị B",
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListSalesInvoicesService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});
