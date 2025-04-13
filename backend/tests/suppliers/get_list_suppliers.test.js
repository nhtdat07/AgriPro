import { createTableSupplier } from '../../db/schema/generated/supplier.up.js';
import { getListSuppliersService } from '../../services/suppliers/get_list_suppliers.js';
import * as dbTest from '../test_util.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableSupplier(pool);
    try {
        await pool.query(`
            INSERT INTO supplier (agency_id, name, address, phone, email, is_deleted) 
            VALUES 
                ('UA0001', 'Công ty TNHH TM Tân Thành', 'Mỹ Tho, Tiền Giang', '0123456789', 'abc@gmail.com', false),
                ('UA0001', 'Công ty TNHH Lưới Bách Nông', 'Châu Thành, Tiền Giang', '0145698732', 'lbn@gmail.com', true),
                ('UA0001', 'Công ty TNHH Chậu Cây Sài Gòn', 'Quận 12, Thành phố Hồ Chí Minh', '0945621378', '', false);
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

test("Happy case: should return suppliers successfully with no constraints", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list suppliers successfully',
        data: {
            suppliers: [
                {
                    supplierId: "SU0003",
                    supplierName: "Công ty TNHH Chậu Cây Sài Gòn",
                    address: "Quận 12, Thành phố Hồ Chí Minh",
                    phoneNumber: "0945621378",
                    email: ""
                },
                {
                    supplierId: "SU0001",
                    supplierName: "Công ty TNHH TM Tân Thành",
                    address: "Mỹ Tho, Tiền Giang",
                    phoneNumber: "0123456789",
                    email: "abc@gmail.com"
                }
            ],
            pagination: { offset: 2 }
        }
    }

    const result = await getListSuppliersService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return suppliers successfully with offset + limit", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        limit: 1,
        offset: 1
    };

    const expectedResponse = {
        message: 'Get list suppliers successfully',
        data: {
            suppliers: [
                {
                    supplierId: "SU0001",
                    supplierName: "Công ty TNHH TM Tân Thành",
                    address: "Mỹ Tho, Tiền Giang",
                    phoneNumber: "0123456789",
                    email: "abc@gmail.com"
                }
            ],
            pagination: { offset: 2 }
        }
    }

    const result = await getListSuppliersService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return suppliers successfully with query of supplierName", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        supplierName: 'Tân Thành',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list suppliers successfully',
        data: {
            suppliers: [
                {
                    supplierId: "SU0001",
                    supplierName: "Công ty TNHH TM Tân Thành",
                    address: "Mỹ Tho, Tiền Giang",
                    phoneNumber: "0123456789",
                    email: "abc@gmail.com"
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListSuppliersService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return suppliers successfully with query of address", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        address: 'Tiền Giang',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list suppliers successfully',
        data: {
            suppliers: [
                {
                    supplierId: "SU0001",
                    supplierName: "Công ty TNHH TM Tân Thành",
                    address: "Mỹ Tho, Tiền Giang",
                    phoneNumber: "0123456789",
                    email: "abc@gmail.com"
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListSuppliersService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return suppliers successfully with query of phoneNumber", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        phoneNumber: '378',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list suppliers successfully',
        data: {
            suppliers: [
                {
                    supplierId: "SU0003",
                    supplierName: "Công ty TNHH Chậu Cây Sài Gòn",
                    address: "Quận 12, Thành phố Hồ Chí Minh",
                    phoneNumber: "0945621378",
                    email: ""
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListSuppliersService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});
