import * as errors from '../../errors/error_handler.js';
import { createTableSupplier } from '../../db/schema/generated/supplier.up.js';
import * as dbTest from '../test_util.js';
import { deleteSupplierService } from '../../services/suppliers/delete_supplier.js';

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

test("Happy case: should delete supplier successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { supplierId: 'SU0001' };
    await deleteSupplierService(pool, user, params);

    const { rows } = await pool.query(
        "SELECT * FROM supplier WHERE agency_id = $1 AND id = $2",
        [user.userAgencyId, params.supplierId]
    );
    expect(rows.length).toBe(1);
    expect(rows[0].is_deleted).toBe(true);
});

test("Bad case: supplier ID not found", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { supplierId: 'SU0003' };

    const { error } = await deleteSupplierService(pool, user, params);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Supplier not found');
});

test("Bad case: deleted supplier", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { supplierId: 'SU0002' };

    const { error } = await deleteSupplierService(pool, user, params);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Supplier not found');
});
