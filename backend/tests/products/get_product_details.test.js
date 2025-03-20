import { getProductDetailsService } from '../../services/products/get_product_details.js';
import * as errors from '../../errors/error_handler.js';
import { createTableProduct } from '../../db/schema/generated/product.up.js';
import { createTableInventoryProduct } from '../../db/schema/generated/inventory.up.js';
import * as dbTest from '../test_util.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableProduct(pool);
    await createTableInventoryProduct(pool);
    try {
        await pool.query(`
            INSERT INTO product 
                (agency_id, name, image_path, brand, category, 
                out_price, production_place, usages, guidelines, is_deleted) 
            VALUES 
                ('UA0001', 'Thuốc trừ rệp sáp CONFIDOR 200SL', '/products/PR0001', 'CONFIDOR', 'HẠT GIỐNG - CÂY TRỒNG',
                    17000, 'Công ty TNHH Ngân Anh', 
                    'Phòng trừ nấm bệnh, rỉ sắt, đóm đen trên các loại cây trồng, cây kiểng. Đặc biệt là hoa hồng, cây mai, đào.',
                    'Pha loãng khoảng 10 -20 gram cho bình 8 - 10 lít, phun khi cây mới chớm bệnh. Mỗi 14 ngày nên phun để phòng trừ bệnh. Thời gian cách ly là 7 ngày.',
                    false),
                ('UA0001', 'Thuốc trừ rệp sáp CONFIDOR 200SL', '/products/PR0002', 'CONFIDOR', 'HẠT GIỐNG - CÂY TRỒNG',
                    17000, 'Công ty TNHH Ngân Anh', 
                    'Phòng trừ nấm bệnh, rỉ sắt, đóm đen trên các loại cây trồng, cây kiểng. Đặc biệt là hoa hồng, cây mai, đào.',
                    'Pha loãng khoảng 10 -20 gram cho bình 8 - 10 lít, phun khi cây mới chớm bệnh. Mỗi 14 ngày nên phun để phòng trừ bệnh. Thời gian cách ly là 7 ngày.',
                    true);
        `);
        await pool.query(`
            INSERT INTO inventory_product (agency_id, product_id, quantity, imported_timestamp, in_price) 
            VALUES ('UA0001', 'PR0001', 20, NOW(), 15000);
        `);
    } catch (error) {
        console.error('Error insert data:', error);
        throw error;
    }
});

afterAll(async () => {
    await pool.query(`
        TRUNCATE TABLE product RESTART IDENTITY;
        TRUNCATE TABLE inventory_product;
    `);
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should return product details successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { productId: 'PR0001' };

    const expectedResponse = {
        message: 'Get product details successfully',
        data: {
            productId: 'PR0001',
            productName: 'Thuốc trừ rệp sáp CONFIDOR 200SL',
            brand: 'CONFIDOR',
            category: 'HẠT GIỐNG - CÂY TRỒNG',
            productionPlace: 'Công ty TNHH Ngân Anh',
            outPrice: 17000,
            usage: 'Phòng trừ nấm bệnh, rỉ sắt, đóm đen trên các loại cây trồng, cây kiểng. Đặc biệt là hoa hồng, cây mai, đào.',
            guideline: 'Pha loãng khoảng 10 -20 gram cho bình 8 - 10 lít, phun khi cây mới chớm bệnh. Mỗi 14 ngày nên phun để phòng trừ bệnh. Thời gian cách ly là 7 ngày.',
            imagePath: '/products/PR0001',
            availableQuantity: 20
        }
    };

    const result = await getProductDetailsService(pool, user, params);
    expect(result).toEqual(expectedResponse);
});

test("Bad case: product ID not found", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { productId: 'PR0003' };

    const { error } = await getProductDetailsService(pool, user, params);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Product not found');
});

test("Bad case: deleted product", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { productId: 'PR0002' };

    const { error } = await getProductDetailsService(pool, user, params);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Product not found');
});