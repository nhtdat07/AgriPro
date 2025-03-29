import * as errors from '../../errors/error_handler.js';
import { createTableSupplier } from '../../db/schema/generated/supplier.up.js';
import { createTableInventoryProduct } from '../../db/schema/generated/inventory.up.js';
import { createTableProduct } from '../../db/schema/generated/product.up.js';
import { createTablePurchaseOrder } from '../../db/schema/generated/purchase_order.up.js';
import * as dbTest from '../test_util.js';
import { getPurchaseOrderDetailsService } from '../../services/purchasing/get_purchase_order_details.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableInventoryProduct(pool);
    await createTableProduct(pool);
    await createTablePurchaseOrder(pool);
    await createTableSupplier(pool);
    try {
        await pool.query(`
            INSERT INTO supplier (agency_id, name, address, phone) 
            VALUES ('UA0001', 'Nguyễn Văn A', 'Mỹ Tho, Tiền Giang', '0123456789');

            INSERT INTO product (agency_id, name, brand, category, out_price, production_place, usages, guidelines)
            VALUES
                ('UA0001', 'Thuốc trừ rệp sáp CONFIDOR 200SL', '', 'THUỐC BẢO VỆ THỰC VẬT', 0, '', '', ''),
                ('UA0001', 'Thuốc trừ sâu rầy nhện đỏ Pesieu 500SC', '', 'THUỐC BẢO VỆ THỰC VẬT', 0, '', '', '');

            INSERT INTO purchase_order (agency_id, recorded_at, supplier_id, total_payment)
            VALUES ('UA0001', '2025-03-29 11:35:00', 'SU0001', 610000);

            INSERT INTO order_product (agency_id, order_id, product_id, quantity, price)
            VALUES
                ('UA0001', 'PO0001', 'PR0001', 20, 20000),
                ('UA0001', 'PO0001', 'PR0002', 15, 14000);
            
            INSERT INTO inventory_product (agency_id, product_id, quantity, imported_timestamp, expired_date, in_price)
            VALUES 
                ('UA0001', 'PR0001', 20, '2025-03-29 11:35:00', '2027-03-28', 20000),
                ('UA0001', 'PR0002', 15, '2025-03-29 11:35:00', '2027-03-30', 14000);
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
        TRUNCATE TABLE product RESTART IDENTITY;
        TRUNCATE TABLE order_product;
        TRUNCATE TABLE inventory_product;
    `);
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should return purchase order details successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { orderId: 'PO0001' };

    const expectedResponse = {
        message: 'Get purchase order details successfully',
        data: {
            purchaseOrderId: 'PO0001',
            supplierName: 'Nguyễn Văn A',
            products: [
                {
                    productName: 'Thuốc trừ rệp sáp CONFIDOR 200SL',
                    expiredDate: '2027-03-28',
                    quantity: 20,
                    inPrice: 20000,
                    totalPrice: 400000
                },
                {
                    productName: 'Thuốc trừ sâu rầy nhện đỏ Pesieu 500SC',
                    expiredDate: '2027-03-30',
                    quantity: 15,
                    inPrice: 14000,
                    totalPrice: 210000
                }
            ],
            totalPrice: 610000
        }
    };

    const result = await getPurchaseOrderDetailsService(pool, user, params);
    expect(result).toEqual(expectedResponse);
});


test("Bad case: purchase order ID not found", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { orderId: 'PO0002' };

    const { error } = await getPurchaseOrderDetailsService(pool, user, params);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Purchase order not found');
});
