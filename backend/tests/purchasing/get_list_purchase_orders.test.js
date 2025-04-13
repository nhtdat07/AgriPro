import { createTablePurchaseOrder } from '../../db/schema/generated/purchase_order.up.js';
import { createTableSupplier } from '../../db/schema/generated/supplier.up.js';
import { getListPurchaseOrdersService } from '../../services/purchasing/get_list_purchase_orders.js';
import * as dbTest from '../test_util.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTablePurchaseOrder(pool);
    await createTableSupplier(pool);
    try {
        await pool.query(`
            INSERT INTO supplier (agency_id, name, address, phone) 
            VALUES 
                ('UA0001', 'Nguyễn Văn A', '', ''),
                ('UA0001', 'Lê Thị B', '', '');

            INSERT INTO purchase_order (agency_id, recorded_at, supplier_id)
            VALUES 
                ('UA0001', '2025-03-29 11:35:00', 'SU0001'),
                ('UA0001', '2025-03-31 22:29:43', 'SU0002');
        `);
    } catch (error) {
        console.error('Error insert data:', error);
        throw error;
    }
});

afterAll(async () => {
    await pool.query(`
        TRUNCATE TABLE supplier RESTART IDENTITY;
        TRUNCATE TABLE purchase_order RESTART IDENTITY;
    `);
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should return purchase orders successfully with no constraints", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list purchase orders successfully',
        data: {
            purchaseOrders: [
                {
                    purchaseOrderId: "PO0002",
                    // recordedTimestamp: "2025-03-31 22:29:43",
                    supplierName: "Lê Thị B",
                },
                {
                    purchaseOrderId: "PO0001",
                    // recordedTimestamp: "2025-03-29 11:35:00",
                    supplierName: "Nguyễn Văn A",
                }
            ],
            pagination: { offset: 2 }
        }
    }

    const result = await getListPurchaseOrdersService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});

test("Happy case: should return purchase orders successfully with offset + limit", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        limit: 1,
        offset: 1
    };

    const expectedResponse = {
        message: 'Get list purchase orders successfully',
        data: {
            purchaseOrders: [
                {
                    purchaseOrderId: "PO0001",
                    // recordedTimestamp: "2025-03-29 11:35:00",
                    supplierName: "Nguyễn Văn A",
                }
            ],
            pagination: { offset: 2 }
        }
    }

    const result = await getListPurchaseOrdersService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});

test("Happy case: should return purchase orders successfully with query of purchaseOrderId", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        purchaseOrderId: 'PO0001',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list purchase orders successfully',
        data: {
            purchaseOrders: [
                {
                    purchaseOrderId: "PO0001",
                    // recordedTimestamp: "2025-03-29 11:35:00",
                    supplierName: "Nguyễn Văn A",
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListPurchaseOrdersService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});

test("Happy case: should return purchase orders successfully with query of recordedDate", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        recordedDate: '2025-03-29',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list purchase orders successfully',
        data: {
            purchaseOrders: [
                {
                    purchaseOrderId: "PO0001",
                    // recordedTimestamp: "2025-03-29 11:35:00",
                    supplierName: "Nguyễn Văn A",
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListPurchaseOrdersService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});

test("Happy case: should return purchase orders successfully with query of supplierId", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        supplierId: 'SU0002',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list purchase orders successfully',
        data: {
            purchaseOrders: [
                {
                    purchaseOrderId: "PO0002",
                    // recordedTimestamp: "2025-03-31 22:29:43",
                    supplierName: "Lê Thị B",
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListPurchaseOrdersService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});
