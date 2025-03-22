import { createTableSupplier } from '../../db/schema/generated/supplier.up.js';
import * as dbTest from '../test_util.js';
import { addSupplierService } from '../../services/suppliers/add_supplier.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableSupplier(pool);
});

afterEach(async () => {
    await pool.query("TRUNCATE TABLE supplier RESTART IDENTITY;");
});

afterAll(async () => {
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should store product in the database successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const data = {
        supplierName: "Công ty TNHH TM Tân Thành",
        address: "Mỹ Tho, Tiền Giang",
        phoneNumber: "0123456789",
        email: "abc@gmail.com"
    };

    await addSupplierService(pool, user, data);

    const { rows } = await pool.query(
        "SELECT * FROM supplier WHERE agency_id = $1 AND name = $2",
        [user.userAgencyId, data.supplierName]
    );
    expect(rows.length).toBe(1);
    expect(rows[0].address).toBe(data.address);
    expect(rows[0].phone).toBe(data.phoneNumber);
    expect(rows[0].email).toBe(data.email);
});



