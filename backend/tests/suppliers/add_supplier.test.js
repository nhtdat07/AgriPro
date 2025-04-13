import { createTableSupplier } from '../../db/schema/generated/supplier.up.js';
import { createTableNotification } from '../../db/schema/generated/notification.up.js';
import * as dbTest from '../test_util.js';
import * as consts from '../../consts/consts.js';
import { addSupplierService } from '../../services/suppliers/add_supplier.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableSupplier(pool);
    await createTableNotification(pool);
});

afterEach(async () => {
    await pool.query(`
        TRUNCATE TABLE supplier RESTART IDENTITY;
        TRUNCATE TABLE notification RESTART IDENTITY;
    `);
});

afterAll(async () => {
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should store supplier in the database successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const data = {
        supplierName: "Công ty TNHH TM Tân Thành",
        address: "Mỹ Tho, Tiền Giang",
        phoneNumber: "0123456789",
        email: "abc@gmail.com"
    };

    await addSupplierService(pool, user, data);

    let { rows } = await pool.query(
        "SELECT * FROM supplier WHERE agency_id = $1 AND name = $2",
        [user.userAgencyId, data.supplierName]
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



