import * as errors from '../../errors/error_handler.js';
import { createTableCustomer } from '../../db/schema/generated/customer.up.js';
import * as dbTest from '../test_util.js';
import { editCustomerDetailsService } from '../../services/customers/edit_customer_details.js';

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

test("Happy case: should update customer details successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { customerId: 'CU0001' };
    const data = { phoneNumber: '0124536798' };
    const expectedData = {
        agency_id: 'UA0001',
        id: 'CU0001',
        name: 'Nguyễn Văn A',
        address: 'Mỹ Tho, Tiền Giang',
        phone: '0124536798',
        email: 'abc@gmail.com'
    };

    await editCustomerDetailsService(pool, user, params, data);

    const { rows } = await pool.query(
        "SELECT * FROM customer WHERE agency_id = $1 AND id = $2",
        [user.userAgencyId, params.customerId]
    );
    expect(rows.length).toBe(1);
    expect(rows[0]).toMatchObject(expectedData);
});

test("Bad case: customer ID not found", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { customerId: 'CU0003' };
    const data = { phoneNumber: '0124536798' };

    const { error } = await editCustomerDetailsService(pool, user, params, data);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Customer not found');
});

test("Bad case: deleted customer", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { customerId: 'CU0002' };
    const data = { phoneNumber: '0124536798' };

    const { error } = await editCustomerDetailsService(pool, user, params, data);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Customer not found');
});
