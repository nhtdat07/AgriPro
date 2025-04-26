import { createTableInventoryProduct } from '../db/schema/generated/inventory.up.js';
import { createTableConfiguration } from '../db/schema/generated/config.up.js';
import { createTableProduct } from '../db/schema/generated/product.up.js';
import { createTableUserAgency } from '../db/schema/generated/user_agency.up.js';
import { createTableNotification } from '../db/schema/generated/notification.up.js';
import * as dbTest from '../tests/test_util.js';
import { checkInventory } from './check_inventory.js';

let pool;
const realDate = Date;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableInventoryProduct(pool);
    await createTableConfiguration(pool);
    await createTableProduct(pool);
    await createTableUserAgency(pool);
    await createTableNotification(pool);
    try {
        await pool.query(`
            INSERT INTO user_agency (email, password_hash) VALUES ('test1@example.com', '123');

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
        TRUNCATE TABLE user_agency RESTART IDENTITY;
        TRUNCATE TABLE notification RESTART IDENTITY;
        TRUNCATE TABLE inventory_product;
        TRUNCATE TABLE configuration;
    `);
    await dbTest.teardownTestDb(pool);
    global.Date = realDate;
});

test("Happy case: should add notifications successfully", async () => {
    const expectedNotifications = [
        {
            agency_id: 'UA0001',
            category: 'CẢNH BÁO HẾT HẠN SỬ DỤNG'
        },
        {
            agency_id: 'UA0001',
            category: 'CẢNH BÁO HẾT HÀNG'
        }
    ];

    await checkInventory(pool);
    const { rows } = await pool.query(`SELECT * FROM notification ORDER BY timestamp;`);
    expect(rows).toMatchObject(expectedNotifications);
    for (const noti of rows) {
        console.log(noti.content, '\n')
    }
});
