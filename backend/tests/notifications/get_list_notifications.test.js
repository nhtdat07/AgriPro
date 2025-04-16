import { createTableNotification } from "../../db/schema/generated/notification.up";
import { getListNotificationsService } from "../../services/notifications/get_list_notifications.js";
import * as dbTest from '../test_util.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableNotification(pool);
    try {
        await pool.query(`
            INSERT INTO notification (agency_id, category, content, timestamp, is_read) 
            VALUES 
                ('UA0001', 'CẢNH BÁO HẾT HÀNG', '', '2025-03-14 22:10:45', true),
                ('UA0001', 'GHI NHẬN THÀNH CÔNG', '', '2025-03-29 15:41:06', false);
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

test("Happy case: should return notifications successfully with no constraints", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        limit: 20,
        offset: 0
    };

    const expectedResponse = {
        message: 'Get list notifications successfully',
        data: {
            notifications: [
                {
                    notificationId: 'NO0002',
                    category: 'GHI NHẬN THÀNH CÔNG',
                    // timestamp: '2025-03-29 15:41:06',
                    isRead: false
                },
                {
                    notificationId: 'NO0001',
                    category: 'CẢNH BÁO HẾT HÀNG',
                    // timestamp: '2025-03-14 22:10:45',
                    isRead: true
                }
            ],
            hasUnreadNotification: true,
            pagination: { offset: 2 }
        }
    }

    const result = await getListNotificationsService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});

test("Happy case: should return notifications successfully with offset + limit", async () => {
    const user = { userAgencyId: 'UA0001' };
    const query = {
        limit: 1,
        offset: 1
    };

    const expectedResponse = {
        message: 'Get list notifications successfully',
        data: {
            notifications: [
                {
                    notificationId: 'NO0001',
                    category: 'CẢNH BÁO HẾT HÀNG',
                    // timestamp: '2025-03-14 22:10:45',
                    isRead: true
                }
            ],
            hasUnreadNotification: true,
            pagination: { offset: 2 }
        }
    }

    const result = await getListNotificationsService(pool, user, query);
    expect(result).toMatchObject(expectedResponse);
});
