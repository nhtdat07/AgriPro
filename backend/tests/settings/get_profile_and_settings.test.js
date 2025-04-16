import { createTableUserAgency } from '../../db/schema/generated/user_agency.up.js';
import { createTableConfiguration } from '../../db/schema/generated/config.up.js';
import * as dbTest from '../test_util.js';
import { getProfileAndSettingsService } from '../../services/settings/get_profile_and_settings.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableUserAgency(pool);
    await createTableConfiguration(pool);
    try {
        await pool.query(`
            INSERT INTO user_agency (agency_name, owner_name, phone, profile_photo_path, tax_code, address, email, password_hash) 
            VALUES 
                ('Đại lý A1', 'Nguyễn Văn A', '0123456789', '/profile/UA0001', '0123456789', 'Mỹ Tho, Tiền Giang', 'abc@gmail.com', '');
            
            INSERT INTO configuration (agency_id, category, key, value)
            VALUES
                ('UA0001', 'INVENTORY_PARAMS', 'warning_expired', '5'),
                ('UA0001', 'INVENTORY_PARAMS', 'warning_out_of_stock', '5'),
                ('UA0001', 'PRINT_FORMAT', 'left_margin', '3'),
                ('UA0001', 'PRINT_FORMAT', 'right_margin', '2'),
                ('UA0001', 'PRINT_FORMAT', 'top_margin', '2'),
                ('UA0001', 'PRINT_FORMAT', 'bottom_margin', '2'),
                ('UA0001', 'PRINT_FORMAT', 'font_size', '13');
        `);
    } catch (error) {
        console.error('Error insert data:', error);
        throw error;
    }
});

afterAll(async () => {
    await pool.query(`
        TRUNCATE TABLE user_agency RESTART IDENTITY;
        TRUNCATE TABLE configuration;
    `);
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should return profile & settings successfully", async () => {
    const user = { userAgencyId: 'UA0001' };

    const expectedConfig = [
        {
            category: 'INVENTORY_PARAMS',
            key: 'warning_expired',
            value: '5'
        },
        {
            category: 'INVENTORY_PARAMS',
            key: 'warning_out_of_stock',
            value: '5'
        },
        {
            category: 'PRINT_FORMAT',
            key: 'left_margin',
            value: '3'
        },
        {
            category: 'PRINT_FORMAT',
            key: 'right_margin',
            value: '2'
        },
        {
            category: 'PRINT_FORMAT',
            key: 'top_margin',
            value: '2'
        },
        {
            category: 'PRINT_FORMAT',
            key: 'bottom_margin',
            value: '2'
        },
        {
            category: 'PRINT_FORMAT',
            key: 'font_size',
            value: '13'
        }
    ];
    const expectTestConfig = expectedConfig.map(config => expect.objectContaining(config));

    const result = await getProfileAndSettingsService(pool, user);
    expect(result).toEqual(expect.objectContaining({
        message: 'Get profile and settings successfully',
        data: {
            userProfile: {
                agencyName: 'Đại lý A1',
                ownerName: 'Nguyễn Văn A',
                address: 'Mỹ Tho, Tiền Giang',
                taxCode: '0123456789',
                phoneNumber: '0123456789',
                email: 'abc@gmail.com',
                profilePicturePath: '/profile/UA0001'
            },
            settings: expect.arrayContaining(expectTestConfig)
        },
    }));
});
