import * as errors from '../../errors/error_handler.js';
import { createTableCustomer } from '../../db/schema/generated/customer.up.js';
import { createTableProduct } from '../../db/schema/generated/product.up.js';
import { createTableSalesInvoice } from '../../db/schema/generated/sales_invoice.up.js';
import * as dbTest from '../test_util.js';
import { getSalesInvoiceDetailsService } from '../../services/selling/get_sales_invoice_details.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableProduct(pool);
    await createTableSalesInvoice(pool);
    await createTableCustomer(pool);
    try {
        await pool.query(`
            INSERT INTO customer (agency_id, name, address, phone) 
            VALUES ('UA0001', 'Nguyễn Văn A', 'Mỹ Tho, Tiền Giang', '0123456789');

            INSERT INTO product (agency_id, name, brand, category, out_price, production_place, usages, guidelines)
            VALUES
                ('UA0001', 'Thuốc trừ rệp sáp CONFIDOR 200SL', '', 'THUỐC BẢO VỆ THỰC VẬT', 0, '', '', ''),
                ('UA0001', 'Thuốc trừ sâu rầy nhện đỏ Pesieu 500SC', '', 'THUỐC BẢO VỆ THỰC VẬT', 0, '', '', '');

            INSERT INTO sales_invoice (agency_id, customer_id, total_payment)
            VALUES ('UA0001', 'CU0001', 810000);

            INSERT INTO invoice_product (agency_id, invoice_id, product_id, quantity, price, imported_timestamp)
            VALUES
                ('UA0001', 'SI0001', 'PR0001', 20, 20000, '2025-03-28'),
                ('UA0001', 'SI0001', 'PR0001', 10, 20000, '2025-03-29'),
                ('UA0001', 'SI0001', 'PR0002', 15, 14000, '2025-03-28');
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
        TRUNCATE TABLE product RESTART IDENTITY;
        TRUNCATE TABLE invoice_product;
    `);
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should return sales invoice details successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { invoiceId: 'SI0001' };

    const expectedResponse = {
        message: 'Get sales invoice details successfully',
        data: {
            salesInvoiceId: 'SI0001',
            customerName: 'Nguyễn Văn A',
            products: [
                {
                    productName: 'Thuốc trừ rệp sáp CONFIDOR 200SL',
                    quantity: 30,
                    outPrice: 20000,
                    totalPrice: 600000
                },
                {
                    productName: 'Thuốc trừ sâu rầy nhện đỏ Pesieu 500SC',
                    quantity: 15,
                    outPrice: 14000,
                    totalPrice: 210000
                }
            ],
            totalPrice: 810000
        }
    };

    const result = await getSalesInvoiceDetailsService(pool, user, params);
    expect(result).toEqual(expectedResponse);
});


test("Bad case: sales invoice ID not found", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { invoiceId: 'SI0002' };

    const { error } = await getSalesInvoiceDetailsService(pool, user, params);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Sales invoice not found');
});
