import { addProductService } from '../../services/products/add_product.js';
import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { createTableProduct } from '../../db/schema/generated/product.up.js';
import { createTableNotification } from '../../db/schema/generated/notification.up.js';
import * as dbTest from '../test_util.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableProduct(pool);
    await createTableNotification(pool);
});

afterEach(async () => {
    await pool.query(`
        TRUNCATE TABLE product RESTART IDENTITY;
        TRUNCATE TABLE notification RESTART IDENTITY;
    `);
});

afterAll(async () => {
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should store product in the database successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const data = {
        productName: "Thuốc trừ rệp sáp CONFIDOR 200SL",
        brand: "CONFIDOR",
        category: "HẠT GIỐNG - CÂY TRỒNG",
        productionPlace: "Công ty TNHH Ngân Anh",
        outPrice: 17000,
        usage: "Phòng trừ nấm bệnh, rỉ sắt, đóm đen trên các loại cây trồng, cây kiểng. Đặc biệt là hoa hồng, cây mai, đào.",
        guideline: "Pha loãng khoảng 10 -20 gram cho bình 8 - 10 lít, phun khi cây mới chớm bệnh. Mỗi 14 ngày nên phun để phòng trừ bệnh. Thời gian cách ly là 7 ngày.",
        imagePath: "/products/PR0001"
    };

    await addProductService(pool, user, data);

    let { rows } = await pool.query(
        "SELECT * FROM product WHERE agency_id = $1 AND name = $2",
        [user.userAgencyId, data.productName]
    );
    expect(rows.length).toBe(1);
    expect(rows[0].brand).toBe(data.brand);
    expect(rows[0].category).toBe(data.category);
    expect(rows[0].production_place).toBe(data.productionPlace);
    expect(rows[0].out_price).toBe(data.outPrice);
    expect(rows[0].usages).toBe(data.usage);
    expect(rows[0].guidelines).toBe(data.guideline);
    expect(rows[0].image_path).toBe(data.imagePath);

    ({ rows } = await pool.query(
        "SELECT * FROM notification WHERE agency_id = $1 AND id = $2",
        [user.userAgencyId, 'NO0001']
    ));
    expect(rows.length).toBe(1);
    expect(rows[0].category).toBe(consts.NOTI_TYPES.SUCCESSFULLY_RECORDED);
});

test("Bad case: invalid product category", async () => {
    const user = { userAgencyId: 'UA0001' };
    const data = {
        productName: "Thuốc trừ rệp sáp CONFIDOR 200SL",
        brand: "CONFIDOR",
        category: "HẠT GIỐNG - CÂY",
        productionPlace: "Công ty TNHH Ngân Anh",
        outPrice: 17000,
        usage: "Phòng trừ nấm bệnh, rỉ sắt, đóm đen trên các loại cây trồng, cây kiểng. Đặc biệt là hoa hồng, cây mai, đào.",
        guideline: "Pha loãng khoảng 10 -20 gram cho bình 8 - 10 lít, phun khi cây mới chớm bệnh. Mỗi 14 ngày nên phun để phòng trừ bệnh. Thời gian cách ly là 7 ngày.",
        imagePath: "/products/PR0001"
    };

    const { error } = await addProductService(pool, user, data);

    expect(error).toBeInstanceOf(errors.ValidationError);
    expect(error.message).toBe('Invalid product category');
});

