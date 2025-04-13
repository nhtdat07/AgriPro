import * as errors from '../../errors/error_handler.js';
import { createTableNotification } from '../../db/schema/generated/notification.up.js';
import * as dbTest from '../test_util.js';
import { readNotificationService } from '../../services/notifications/read_notification.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableNotification(pool);
    try {
        await pool.query(`
            INSERT INTO notification (agency_id, category, content, timestamp) 
            VALUES 
                ('UA0001', 'CẢNH BÁO HẾT HÀNG', 
                'Sản phẩm SP0001 đã sắp hết hàng, vui lòng cân nhắc nhập hàng!', '2025-03-14 22:10:45');
        `);
    } catch (error) {
        console.error('Error insert data:', error);
        throw error;
    }
});

afterAll(async () => {
    await pool.query(`
        TRUNCATE TABLE notification RESTART IDENTITY;
    `);
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should read notification successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { notificationId: 'NO0001' };

    const expectedResponse = {
        message: 'Read notification successfully',
        data: {
            notificationId: 'NO0001',
            category: 'CẢNH BÁO HẾT HÀNG',
            // timestamp: '2025-03-14 22:10:45',
            content: 'Sản phẩm SP0001 đã sắp hết hàng, vui lòng cân nhắc nhập hàng!'
        }
    };
    const result = await readNotificationService(pool, user, params);
    expect(result).toMatchObject(expectedResponse);

    const { rows } = await pool.query(
        "SELECT is_read FROM notification WHERE agency_id = $1 AND id = $2",
        [user.userAgencyId, params.notificationId]
    );
    expect(rows.length).toBe(1);
    expect(rows[0].is_read).toBe(true);
});


test("Bad case: notification ID not found", async () => {
    const user = { userAgencyId: 'UA0001' };
    const params = { customerId: 'NO0002' };

    const { error } = await readNotificationService(pool, user, params);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Notification not found');
});
