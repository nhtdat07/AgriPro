import { createTableCustomer } from '../../db/schema/generated/customer.up.js';
import { addCustomerService } from '../../services/customers/add_customer.js';
import * as dbTest from '../test_util.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableCustomer(pool);
});

afterEach(async () => {
    await pool.query("TRUNCATE TABLE customer RESTART IDENTITY;");
});

afterAll(async () => {
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should store customer in the database successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const data = {
        customerName: "Nguyễn Văn A",
        address: "Mỹ Tho, Tiền Giang",
        phoneNumber: "0123456789",
        email: "abc@gmail.com"
    };

    await addCustomerService(pool, user, data);

    const { rows } = await pool.query(
        "SELECT * FROM customer WHERE agency_id = $1 AND name = $2",
        [user.userAgencyId, data.customerName]
    );
    expect(rows.length).toBe(1);
    expect(rows[0].address).toBe(data.address);
    expect(rows[0].phone).toBe(data.phoneNumber);
    expect(rows[0].email).toBe(data.email);
});
