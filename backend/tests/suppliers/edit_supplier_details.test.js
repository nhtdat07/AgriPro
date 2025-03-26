import * as errors from '../../errors/error_handler.js';
import { createTableSupplier } from '../../db/schema/generated/supplier.up.js';
import * as dbTest from '../test_util.js';
import { editSupplierDetailsService } from '../../services/suppliers/edit_supplier_details.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableSupplier(pool);
    try {
        await pool.query(`
            INSERT INTO supplier (agency_id, name, address, phone, email, is_deleted) 
            VALUES 
                ('UA0001', 'Công ty TNHH TM Tân Thành', 'Mỹ Tho, Tiền Giang', '0123456789', 'abc@gmail.com', false),
                ('UA0001', 'Công ty TNHH TM Tân Thành', 'Mỹ Tho, Tiền Giang', '0123456789', 'abc@gmail.com', true);
        `);
    } catch (error) {
        console.error('Error insert data:', error);
        throw error;
    }
});

afterAll(async () => {
    await pool.query(`
        TRUNCATE TABLE supplier RESTART IDENTITY;
    `);
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should update supplier details successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { supplierId: 'SU0001' };
    const data = { phoneNumber: '0124536798' };
    const expectedData = {
        agency_id: 'UA0001',
        id: 'SU0001',
        name: 'Công ty TNHH TM Tân Thành',
        address: 'Mỹ Tho, Tiền Giang',
        phone: '0124536798',
        email: 'abc@gmail.com'
    };

    await editSupplierDetailsService(pool, user, params, data);

    const { rows } = await pool.query(
        "SELECT * FROM supplier WHERE agency_id = $1 AND id = $2",
        [user.userAgencyId, params.supplierId]
    );
    expect(rows.length).toBe(1);
    expect(rows[0]).toMatchObject(expectedData);
});

test("Bad case: supplier ID not found", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { supplierId: 'SU0003' };
    const data = { phoneNumber: '0124536798' };

    const { error } = await editSupplierDetailsService(pool, user, params, data);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Supplier not found');
});

test("Bad case: deleted supplier", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { supplierId: 'SU0002' };
    const data = { phoneNumber: '0124536798' };

    const { error } = await editSupplierDetailsService(pool, user, params, data);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Supplier not found');
});
