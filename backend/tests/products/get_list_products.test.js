import * as errors from '../../errors/error_handler.js';
import { createTableProduct } from '../../db/schema/generated/product.up.js';
import * as dbTest from '../test_util.js';
import { getListProductsService } from '../../services/products/get_list_products.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableProduct(pool);
    try {
        await pool.query(`
            INSERT INTO product 
                (agency_id, name, image_path, brand, category, out_price, production_place, is_deleted,
                usages, guidelines) 
            VALUES 
                ('UA0001', 'Thuốc trừ rệp sáp CONFIDOR 200SL', '/products/PR0001', '', 
                    'THUỐC BẢO VỆ THỰC VẬT', 17000, '', false,
                    'Phòng trừ nấm bệnh, rỉ sắt, đóm đen trên các loại cây trồng, cây kiểng. Đặc biệt là hoa hồng, cây mai, đào.', ''),
                ('UA0001', 'Thuốc trừ sâu và đặc trị bọ trĩ RADIANT 60 SC - Gói 15 ml', '/products/PR0002', '', 
                    'THUỐC BẢO VỆ THỰC VẬT', 39500, '', true,
                    'Thuốc có đặc tính tiếp xúc, vị độc, hấp thu sâu vào biểu bì của cây trồng và hiệu lực kéo dài, trừ được nhiều loại sâu.', ''),
                ('UA0001', 'Hạt giống cải mầm Phú Nông', '/products/PR0003', '', 
                    'HẠT GIỐNG - CÂY TRỒNG', 9000, '', false,
                    'Hạt giống cải mầm Phú Nông có hạt to, cây sinh trưởng khoẻ mạnh và tỉ lệ nảy mầm đồng đều. Cải mầm Phú Nông có vị cay nồng, ăn ngon. Chu kì sinh trưởng từ 5 - 7 ngày.', '');
        `);
    } catch (error) {
        console.error('Error insert data:', error);
        throw error;
    }
});

afterAll(async () => {
    await pool.query(`
        TRUNCATE TABLE product RESTART IDENTITY;
    `);
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should return products successfully with no constraints", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list products successfully',
        data: {
            products: [
                {
                    productId: 'PR0001',
                    productName: 'Thuốc trừ rệp sáp CONFIDOR 200SL',
                    imagePath: '/products/PR0001',
                    category: 'THUỐC BẢO VỆ THỰC VẬT',
                    outPrice: 17000
                },
                {
                    productId: 'PR0003',
                    productName: 'Hạt giống cải mầm Phú Nông',
                    imagePath: '/products/PR0003',
                    category: 'HẠT GIỐNG - CÂY TRỒNG',
                    outPrice: 9000
                }
            ],
            pagination: { offset: 2 }
        }
    }

    const result = await getListProductsService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return products successfully with offset + limit", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        limit: 1,
        offset: 1
    };

    const expectedResponse = {
        message: 'Get list products successfully',
        data: {
            products: [
                {
                    productId: 'PR0003',
                    productName: 'Hạt giống cải mầm Phú Nông',
                    imagePath: '/products/PR0003',
                    category: 'HẠT GIỐNG - CÂY TRỒNG',
                    outPrice: 9000
                }
            ],
            pagination: { offset: 2 }
        }
    }

    const result = await getListProductsService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return products successfully with query of productId", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        productId: 'PR0001',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list products successfully',
        data: {
            products: [
                {
                    productId: 'PR0001',
                    productName: 'Thuốc trừ rệp sáp CONFIDOR 200SL',
                    imagePath: '/products/PR0001',
                    category: 'THUỐC BẢO VỆ THỰC VẬT',
                    outPrice: 17000
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListProductsService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return products successfully with query of category", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        category: 'THUỐC BẢO VỆ THỰC VẬT',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list products successfully',
        data: {
            products: [
                {
                    productId: 'PR0001',
                    productName: 'Thuốc trừ rệp sáp CONFIDOR 200SL',
                    imagePath: '/products/PR0001',
                    category: 'THUỐC BẢO VỆ THỰC VẬT',
                    outPrice: 17000
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListProductsService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Happy case: should return products successfully with query of usage", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        usage: 'nảy mầm',
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list products successfully',
        data: {
            products: [
                {
                    productId: 'PR0003',
                    productName: 'Hạt giống cải mầm Phú Nông',
                    imagePath: '/products/PR0003',
                    category: 'HẠT GIỐNG - CÂY TRỒNG',
                    outPrice: 9000
                }
            ],
            pagination: { offset: 1 }
        }
    }

    const result = await getListProductsService(pool, user, query);
    expect(result).toEqual(expectedResponse);
});

test("Bad case: invalid product type", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        category: 'HẠT GIỐNG',
        limit: 20,
        offset: 0
    };

    const { error } = await getListProductsService(pool, user, query);
    expect(error).toBeInstanceOf(errors.ValidationError);
    expect(error.message).toBe('Invalid product category');
});