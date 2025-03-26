import * as errors from '../../errors/error_handler.js';
import { createTableCustomer } from '../../db/schema/generated/customer.up.js';
import * as dbTest from '../test_util.js';
import { getCustomerDetailsService } from '../../services/customers/get_customer_details.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableCustomer(pool);
    try {
        await pool.query(`
            INSERT INTO customer (agency_id, name, address, phone, email, is_deleted) 
            VALUES 
                ('UA0001', 'Nguyễn Văn A', 'Mỹ Tho, Tiền Giang', '0123456789', 'abc@gmail.com', false),
                ('UA0001', 'Nguyễn Văn A', 'Mỹ Tho, Tiền Giang', '0123456789', 'abc@gmail.com', true);
        `);
    } catch (error) {
        console.error('Error insert data:', error);
        throw error;
    }
});

afterAll(async () => {
    await pool.query(`
        TRUNCATE TABLE customer RESTART IDENTITY;
    `);
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should return customer details successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { customerId: 'CU0001' };

    const expectedResponse = {
        message: 'Get customer details successfully',
        data: {
            customerId: "CU0001",
            customerName: "Nguyễn Văn A",
            address: "Mỹ Tho, Tiền Giang",
            phoneNumber: "0123456789",
            email: "abc@gmail.com"
        }
    };

    const result = await getCustomerDetailsService(pool, user, params);
    expect(result).toEqual(expectedResponse);
});


test("Bad case: supplier ID not found", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { customerId: 'CU0003' };

    const { error } = await getCustomerDetailsService(pool, user, params);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Customer not found');
});

test("Bad case: deleted customer", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { customerId: 'CU0002' };

    const { error } = await getCustomerDetailsService(pool, user, params);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Customer not found');
});