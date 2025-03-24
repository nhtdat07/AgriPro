import * as errors from '../../errors/error_handler.js';
import { createTableSupplier } from '../../db/schema/generated/supplier.up.js';
import * as dbTest from '../test_util.js';
import { getSupplierDetailsService } from '../../services/suppliers/get_supplier_details.js';

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

test("Happy case: should return supplier details successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { supplierId: 'SU0001' };

    const expectedResponse = {
        message: 'Get supplier details successfully',
        data: {
            supplierId: "SU0001",
            supplierName: "Công ty TNHH TM Tân Thành",
            address: "Mỹ Tho, Tiền Giang",
            phoneNumber: "0123456789",
            email: "abc@gmail.com"
        }
    };

    const result = await getSupplierDetailsService(pool, user, params);
    expect(result).toEqual(expectedResponse);
});


test("Bad case: supplier ID not found", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { supplierId: 'SU0003' };

    const { error } = await getSupplierDetailsService(pool, user, params);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Supplier not found');
});

test("Bad case: deleted supplier", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { supplierId: 'SU0002' };

    const { error } = await getSupplierDetailsService(pool, user, params);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Supplier not found');
});