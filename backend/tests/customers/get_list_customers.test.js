import { createTableCustomer } from '../../db/schema/generated/customer.up.js';
import { getListCustomersService } from '../../services/customers/get_list_customers.js';
import * as dbTest from '../test_util.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableCustomer(pool);
    try {
        await pool.query(`
            INSERT INTO customer (agency_id, name, address, phone, email, is_deleted) 
            VALUES 
                ('UA0001', 'Nguyễn Văn A', 'Mỹ Tho, Tiền Giang', '0123456789', 'abc@gmail.com', false),
                ('UA0001', 'Trần Thị B', 'Châu Thành, Tiền Giang', '0145698732', 'ttb@gmail.com', true),
                ('UA0001', 'Lê Thị C', 'Quận 12, Thành phố Hồ Chí Minh', '0945621378', '', false);
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

test("Happy case: should return customers successfully with no constraints", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list customers successfully',
        data: {
            customers: [
                {
                    customerId: "CU0003",
                    customerName: "Lê Thị C",
                    address: "Quận 12, Thành phố Hồ Chí Minh",
                    phoneNumber: "0945621378",
                    email: ""
                },
                {
                    customerId: "CU0001",
                    customerName: "Nguyễn Văn A",
                    address: "Mỹ Tho, Tiền Giang",
                    phoneNumber: "0123456789",
                    email: "abc@gmail.com"
                }
            ],
            pagination: { offset: 2 }
        }
    }

    const result = await getListCustomersService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return customers successfully with offset + limit", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        limit: 1,
        offset: 1
    };

    const expectedResponse = {
        message: 'Get list customers successfully',
        data: {
            customers: [
                {
                    customerId: "CU0001",
                    customerName: "Nguyễn Văn A",
                    address: "Mỹ Tho, Tiền Giang",
                    phoneNumber: "0123456789",
                    email: "abc@gmail.com"
                }
            ],
            pagination: { offset: 2 }
        }
    }

    const result = await getListCustomersService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return customers successfully with query of customerName", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        customerName: 'Văn A',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list customers successfully',
        data: {
            customers: [
                {
                    customerId: "CU0001",
                    customerName: "Nguyễn Văn A",
                    address: "Mỹ Tho, Tiền Giang",
                    phoneNumber: "0123456789",
                    email: "abc@gmail.com"
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListCustomersService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return customers successfully with query of address", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        address: 'Tiền Giang',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list customers successfully',
        data: {
            customers: [
                {
                    customerId: "CU0001",
                    customerName: "Nguyễn Văn A",
                    address: "Mỹ Tho, Tiền Giang",
                    phoneNumber: "0123456789",
                    email: "abc@gmail.com"
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListCustomersService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return customers successfully with query of phoneNumber", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        phoneNumber: '378',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list customers successfully',
        data: {
            customers: [
                {
                    customerId: "CU0003",
                    customerName: "Lê Thị C",
                    address: "Quận 12, Thành phố Hồ Chí Minh",
                    phoneNumber: "0945621378",
                    email: ""
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListCustomersService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});
