import { createTableProduct } from '../../db/schema/generated/product.up.js';
import { createTableSalesInvoice } from '../../db/schema/generated/sales_invoice.up.js';
import * as dbTest from '../test_util.js';
import { getListSoldProductsService } from '../../services/statistics/get_list_sold_products.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableProduct(pool);
    await createTableSalesInvoice(pool);
    try {
        await pool.query(`
            INSERT INTO product 
                (agency_id, name, brand, category, out_price, production_place, usages, guidelines) 
            VALUES 
                ('UA0001', 'Thuốc trừ rệp sáp CONFIDOR 200SL', '', 'THUỐC BẢO VỆ THỰC VẬT', 0, '', '', ''),
                ('UA0001', 'Thuốc trừ sâu và đặc trị bọ trĩ RADIANT 60 SC - Gói 15 ml', '', 'THUỐC BẢO VỆ THỰC VẬT', 0, '', '', ''),
                ('UA0001', 'Hạt giống cải mầm Phú Nông', '', 'HẠT GIỐNG - CÂY TRỒNG', 0, '', '', '');
            
            INSERT INTO invoice_product (agency_id, invoice_id, product_id, quantity, price, imported_timestamp)
            VALUES
                ('UA0001', 'SI0001', 'PR0001', 20, 24000, '2025-03-29 11:35:00'),
                ('UA0001', 'SI0001', 'PR0003', 10, 24000, '2025-03-30 11:35:00'),
                ('UA0001', 'SI0001', 'PR0002', 5, 17000, '2025-03-29 11:35:00'),
                ('UA0001', 'SI0002', 'PR0001', 15, 22000, '2025-03-29 11:35:00'),
                ('UA0001', 'SI0002', 'PR0003', 8, 22000, '2025-03-30 11:35:00'),
                ('UA0001', 'SI0002', 'PR0002', 12, 18000, '2025-03-29 11:35:00'),
                ('UA0001', 'SI0003', 'PR0002', 22, 18000, '2025-03-29 11:35:00');

            INSERT INTO sales_invoice (agency_id, customer_id, total_payment, recorded_at)
            VALUES 
                ('UA0001', 'CU0001', 805000, '2025-04-19 14:25:34'),
                ('UA0001', 'CU0002', 722000, '2025-04-30 11:30:00'),
                ('UA0001', 'CU0001', 1015000, '2025-05-12 08:55:21');
        `);
    } catch (error) {
        console.error('Error insert data:', error);
        throw error;
    }
});

afterAll(async () => {
    await pool.query(`
        TRUNCATE TABLE product RESTART IDENTITY;
        TRUNCATE TABLE sales_invoice RESTART IDENTITY;
        TRUNCATE TABLE invoice_product;
    `);
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should return sold products successfully with no constraints", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        startDate: '2025-04-01',
        endDate: '2025-04-30',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list sold products successfully',
        data: {
            products: [
                {
                    productId: 'PR0001',
                    productName: 'Thuốc trừ rệp sáp CONFIDOR 200SL',
                    soldQuantity: 35
                },
                {
                    productId: 'PR0003',
                    productName: 'Hạt giống cải mầm Phú Nông',
                    soldQuantity: 18
                },
                {
                    productId: 'PR0002',
                    productName: 'Thuốc trừ sâu và đặc trị bọ trĩ RADIANT 60 SC - Gói 15 ml',
                    soldQuantity: 17
                }
            ],
            pagination: { offset: 3 }
        }
    }

    const result = await getListSoldProductsService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return sold products successfully with offset + limit", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        startDate: '2025-04-01',
        endDate: '2025-04-30',
        limit: 1,
        offset: 1
    };

    const expectedResponse = {
        message: 'Get list sold products successfully',
        data: {
            products: [
                {
                    productId: 'PR0003',
                    productName: 'Hạt giống cải mầm Phú Nông',
                    soldQuantity: 18
                }
            ],
            pagination: { offset: 2 }
        }
    }

    const result = await getListSoldProductsService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return sold products successfully with query of productId", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        startDate: '2025-04-01',
        endDate: '2025-04-30',
        productId: 'PR0002',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list sold products successfully',
        data: {
            products: [
                {
                    productId: 'PR0002',
                    productName: 'Thuốc trừ sâu và đặc trị bọ trĩ RADIANT 60 SC - Gói 15 ml',
                    soldQuantity: 17
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListSoldProductsService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});
