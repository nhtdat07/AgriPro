import { createTableCustomer } from '../../db/schema/generated/customer.up.js';
import { addCustomerService } from '../../services/customers/add_customer.js';
import { createTableNotification } from '../../db/schema/generated/notification.up.js';
import * as dbTest from '../test_util.js';
import * as consts from '../../consts/consts.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableCustomer(pool);
    await createTableNotification(pool);
});

afterEach(async () => {
    await pool.query(`
        TRUNCATE TABLE customer RESTART IDENTITY;
        TRUNCATE TABLE notification RESTART IDENTITY;
    `);
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

    let { rows } = await pool.query(
        "SELECT * FROM customer WHERE agency_id = $1 AND name = $2",
        [user.userAgencyId, data.customerName]
    );
    expect(rows.length).toBe(1);
    expect(rows[0].address).toBe(data.address);
    expect(rows[0].phone).toBe(data.phoneNumber);
    expect(rows[0].email).toBe(data.email);

    ({ rows } = await pool.query(
        "SELECT * FROM notification WHERE agency_id = $1 AND id = $2",
        [user.userAgencyId, 'NO0001']
    ));
    expect(rows.length).toBe(1);
    expect(rows[0].category).toBe(consts.NOTI_TYPES.SUCCESSFULLY_RECORDED);
});
