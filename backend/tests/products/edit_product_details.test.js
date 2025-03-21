import * as errors from '../../errors/error_handler.js';
import { createTableProduct } from '../../db/schema/generated/product.up.js';
import * as dbTest from '../test_util.js';
import { editProductDetailsService } from '../../services/products/edit_product_details.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableProduct(pool);
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

test("Happy case: should update product details successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { productId: 'PR0001' };
    const data = { outPrice: 20000 };
    const expectedData = {
        agency_id: 'UA0001',
        id: 'PR0001',
        name: 'Thuốc trừ rệp sáp CONFIDOR 200SL',
        brand: 'CONFIDOR',
        category: 'HẠT GIỐNG - CÂY TRỒNG',
        production_place: 'Công ty TNHH Ngân Anh',
        out_price: 20000,
        usages: 'Phòng trừ nấm bệnh, rỉ sắt, đóm đen trên các loại cây trồng, cây kiểng. Đặc biệt là hoa hồng, cây mai, đào.',
        guidelines: 'Pha loãng khoảng 10 -20 gram cho bình 8 - 10 lít, phun khi cây mới chớm bệnh. Mỗi 14 ngày nên phun để phòng trừ bệnh. Thời gian cách ly là 7 ngày.',
        image_path: '/products/PR0001',
    };

    await editProductDetailsService(pool, user, params, data);

    const { rows } = await pool.query(
        "SELECT * FROM product WHERE agency_id = $1 AND id = $2",
        [user.userAgencyId, params.productId]
    );
    expect(rows.length).toBe(1);
    expect(rows[0]).toMatchObject(expectedData);
});

test("Bad case: product ID not found", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { productId: 'PR0003' };
    const data = { outPrice: 20000 };

    const { error } = await editProductDetailsService(pool, user, params, data);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Product not found');
});

test("Bad case: deleted product", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { productId: 'PR0002' };
    const data = { outPrice: 20000 };

    const { error } = await editProductDetailsService(pool, user, params, data);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Product not found');
});

test("Bad case: invalid product category", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { productId: 'PR0001' };
    const data = { category: 'HẠT GIỐNG' };

    const { error } = await editProductDetailsService(pool, user, params, data);

    expect(error).toBeInstanceOf(errors.ValidationError);
    expect(error.message).toBe('Invalid product category');
});