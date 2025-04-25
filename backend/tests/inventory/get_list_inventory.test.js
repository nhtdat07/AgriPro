import { createTableInventoryProduct } from '../../db/schema/generated/inventory.up.js';
import { createTableConfiguration } from '../../db/schema/generated/config.up.js';
import { createTableProduct } from '../../db/schema/generated/product.up.js';
import * as dbTest from '../test_util.js';
import { getListInventoryService } from '../../services/inventory/get_list_inventory.js';

let pool;
const realDate = Date;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableInventoryProduct(pool);
    await createTableConfiguration(pool);
    await createTableProduct(pool);
    try {
        await pool.query(`
            INSERT INTO product (agency_id, name, brand, category, out_price, production_place, usages, guidelines, is_deleted)
            VALUES
                ('UA0001', 'Thuốc trừ rệp sáp CONFIDOR 200SL', '', 'THUỐC BẢO VỆ THỰC VẬT', 0, '', '', '', false),
                ('UA0001', 'Thuốc trừ sâu rầy nhện đỏ Pesieu 500SC', '', 'THUỐC BẢO VỆ THỰC VẬT', 0, '', '', '', false),
                ('UA0001', 'Thuốc trừ sâu rầy nhện đỏ Pesieu 250SC', '', 'THUỐC BẢO VỆ THỰC VẬT', 0, '', '', '', true);

            INSERT INTO inventory_product (agency_id, product_id, quantity, imported_timestamp, expired_date, in_price) 
            VALUES 
                ('UA0001', 'PR0001', 2, '2024-04-08 16:50:45', '2025-04-08', 12000),
                ('UA0001', 'PR0001', 2, '2024-12-08 10:24:19', '2025-12-08', 13000),
                ('UA0001', 'PR0002', 12, '2025-02-15 09:11:50', '2027-02-15', 8500),
                ('UA0001', 'PR0003', 0, '2025-02-15 09:11:50', '2027-02-15', 8500);

            INSERT INTO configuration (agency_id, category, key, value)
            VALUES
                ('UA0001', 'INVENTORY_PARAMS', 'warning_expired', '5'),
                ('UA0001', 'INVENTORY_PARAMS', 'warning_out_of_stock', '5');
        `);
    } catch (error) {
        console.error('Error insert data:', error);
        throw error;
    }
    global.Date = class extends Date {
        constructor(...args) {
            if (args.length === 0) {
                return new realDate('2025-04-07 12:00:00');
            }
            return new realDate(...args);
        }
    };
});

afterAll(async () => {
    await pool.query(`
        TRUNCATE TABLE product RESTART IDENTITY;
        TRUNCATE TABLE inventory_product;
        TRUNCATE TABLE configuration;
    `);
    await dbTest.teardownTestDb(pool);
    global.Date = realDate;
});

test("Happy case: should return inventory successfully with no constraints", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list inventory successfully',
        data: {
            inventory: [
                {
                    productId: 'PR0002',
                    productName: 'Thuốc trừ sâu rầy nhện đỏ Pesieu 500SC',
                    quantity: 12,
                    importDate: '2025-02-15',
                    expiredDate: '2027-02-15',
                    inPrice: 8500
                },
                {
                    productId: 'PR0001',
                    productName: 'Thuốc trừ rệp sáp CONFIDOR 200SL',
                    quantity: 2,
                    importDate: '2024-12-08',
                    expiredDate: '2025-12-08',
                    inPrice: 13000
                },
                {
                    productId: 'PR0001',
                    productName: 'Thuốc trừ rệp sáp CONFIDOR 200SL',
                    quantity: 2,
                    importDate: '2024-04-08',
                    expiredDate: '2025-04-08',
                    inPrice: 12000
                }
            ],
            pagination: { offset: 3 }
        }
    }

    const result = await getListInventoryService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});

test("Happy case: should return inventory successfully with offset + limit", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        limit: 1,
        offset: 1
    };

    const expectedResponse = {
        message: 'Get list inventory successfully',
        data: {
            inventory: [
                {
                    productId: 'PR0001',
                    productName: 'Thuốc trừ rệp sáp CONFIDOR 200SL',
                    quantity: 2,
                    importDate: '2024-12-08',
                    expiredDate: '2025-12-08',
                    inPrice: 13000
                }
            ],
            pagination: { offset: 2 }
        }
    }

    const result = await getListInventoryService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});

test("Happy case: should return inventory successfully with query of productId", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        productId: 'PR0002',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list inventory successfully',
        data: {
            inventory: [
                {
                    productId: 'PR0002',
                    productName: 'Thuốc trừ sâu rầy nhện đỏ Pesieu 500SC',
                    quantity: 12,
                    importDate: '2025-02-15',
                    expiredDate: '2027-02-15',
                    inPrice: 8500
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListInventoryService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});

test("Happy case: should return inventory successfully with query of importDate", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        importDate: '2024-04-08',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list inventory successfully',
        data: {
            inventory: [
                {
                    productId: 'PR0001',
                    productName: 'Thuốc trừ rệp sáp CONFIDOR 200SL',
                    quantity: 2,
                    importDate: '2024-04-08',
                    expiredDate: '2025-04-08',
                    inPrice: 12000
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListInventoryService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});

test("Happy case: should return inventory successfully with query of expiredDate", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        expiredDate: '2027-02-15',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list inventory successfully',
        data: {
            inventory: [
                {
                    productId: 'PR0002',
                    productName: 'Thuốc trừ sâu rầy nhện đỏ Pesieu 500SC',
                    quantity: 12,
                    importDate: '2025-02-15',
                    expiredDate: '2027-02-15',
                    inPrice: 8500
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListInventoryService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});

test("Happy case: should return inventory successfully with query of isAboutToExpire", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        isAboutToExpire: true,
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list inventory successfully',
        data: {
            inventory: [
                {
                    productId: 'PR0001',
                    productName: 'Thuốc trừ rệp sáp CONFIDOR 200SL',
                    quantity: 2,
                    importDate: '2024-04-08',
                    expiredDate: '2025-04-08',
                    inPrice: 12000
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListInventoryService(pool, user, query);
    console.log(result)
    expect(result).toMatchObject(expectedResponse);
});

test("Happy case: should return inventory successfully with query of isAboutToBeOutOfStock", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        isAboutToBeOutOfStock: true,
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list inventory successfully',
        data: {
            inventory: [
                {
                    productId: 'PR0001',
                    productName: 'Thuốc trừ rệp sáp CONFIDOR 200SL',
                    quantity: 2,
                    importDate: '2024-12-08',
                    expiredDate: '2025-12-08',
                    inPrice: 13000
                },
                {
                    productId: 'PR0001',
                    productName: 'Thuốc trừ rệp sáp CONFIDOR 200SL',
                    quantity: 2,
                    importDate: '2024-04-08',
                    expiredDate: '2025-04-08',
                    inPrice: 12000
                }
            ],
            pagination: { offset: 2 }
        }
    }

    const result = await getListInventoryService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});
