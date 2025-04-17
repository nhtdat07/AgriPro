import * as errors from '../../errors/error_handler.js';
import { createTableUserAgency } from '../../db/schema/generated/user_agency.up.js';
import { createTableConfiguration } from '../../db/schema/generated/config.up.js';
import * as dbTest from '../test_util.js';
import { updateProfileAndSettingsService } from '../../services/settings/update_profile_and_settings.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableUserAgency(pool);
    await createTableConfiguration(pool);
    try {
        await pool.query(`
            INSERT INTO user_agency (agency_name, owner_name, phone, profile_photo_path, tax_code, address, email, password_hash) 
            VALUES 
                ('Đại lý A1', 'Nguyễn Văn A', '0123456789', '/profile/UA0001', '0123456789', 'Mỹ Tho, Tiền Giang', 'abc@gmail.com', ''),
                ('Đại lý A2', 'Nguyễn Văn B', '9465871023', '/profile/UA0002', '0913426578', 'Chợ Gạo, Tiền Giang', 'abd@gmail.com', '');
            
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

test("Happy case: should update profile & settings successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const data = {
        userProfile: {
            email: 'abc1@gmail.com'
        },
        settings: [
            {
                category: 'PRINT_FORMAT',
                key: 'font_size',
                value: '14'
            }
        ]
    };
    const expectedProfile = {
        agency_name: 'Đại lý A1',
        owner_name: 'Nguyễn Văn A',
        address: 'Mỹ Tho, Tiền Giang',
        tax_code: '0123456789',
        phone: '0123456789',
        email: 'abc1@gmail.com',
        profile_photo_path: '/profile/UA0001'
    };
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
            value: '14'
        }
    ];
    const expectTestConfig = expectedConfig.map(config => expect.objectContaining(config));

    await updateProfileAndSettingsService(pool, user, data);

    let { rows } = await pool.query(
        "SELECT * FROM user_agency WHERE id = $1",
        [user.userAgencyId]
    );
    expect(rows.length).toBe(1);
    expect(rows[0]).toMatchObject(expectedProfile);

    ({ rows } = await pool.query(
        "SELECT * FROM configuration WHERE agency_id = $1",
        [user.userAgencyId]
    ));
    expect(rows.length).toBe(7);
    expect(rows).toEqual(expect.arrayContaining(expectTestConfig));
});

test("Bad case: invalid config category", async () => {
    const user = { userAgencyId: 'UA0001' };
    const data = {
        userProfile: {
            email: 'abc1@gmail.com'
        },
        settings: [
            {
                category: 'PRINT_FORMATS',
                key: 'font_size',
                value: '14'
            }
        ]
    };

    const { error } = await updateProfileAndSettingsService(pool, user, data);

    expect(error).toBeInstanceOf(errors.ValidationError);
    expect(error.message).toBe('Invalid config category: PRINT_FORMATS');
});

test("Bad case: email to be updated has existed", async () => {
    const user = { userAgencyId: 'UA0001' };
    const data = {
        userProfile: {
            email: 'abd@gmail.com'
        },
        settings: [
            {
                category: 'PRINT_FORMAT',
                key: 'font_size',
                value: '14'
            }
        ]
    };

    const { error } = await updateProfileAndSettingsService(pool, user, data);

    expect(error).toBeInstanceOf(errors.ConflictError);
    expect(error.message).toBe('Email already exists');
});
