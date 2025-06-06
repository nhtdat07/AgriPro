import bcrypt from 'bcryptjs';
import { signUpService } from '../../services/auth/sign_up.js';
import * as errors from '../../errors/error_handler.js';
import { createTableUserAgency } from '../../db/schema/generated/user_agency.up.js';
import { createTableConfiguration } from '../../db/schema/generated/config.up.js';
import * as dbTest from '../test_util.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableUserAgency(pool);
    await createTableConfiguration(pool);
});

beforeEach(async () => {
    try {
        await pool.query(`
            INSERT INTO user_agency (email, password_hash) VALUES ('test1@example.com', '123');
        `);
    } catch (error) {
        console.error('Error insert data:', error);
        throw error;
    }
});

afterEach(async () => {
    await pool.query(`
        TRUNCATE TABLE user_agency RESTART IDENTITY;
        TRUNCATE TABLE configuration;
    `);
});

afterAll(async () => {
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should store user in the database successfully", async () => {
    const userData = {
        email: "test@example.com",
        password: "@SecurePass123",
        agencyName: "Test Agency",
        ownerName: "John Doe",
        phone: "1234567890"
    };

    await signUpService(pool, userData);

    let { rows } = await pool.query("SELECT * FROM user_agency WHERE email=$1", [userData.email]);
    expect(rows.length).toBe(1);
    expect(rows[0].agency_name).toBe(userData.agencyName);
    expect(rows[0].owner_name).toBe(userData.ownerName);
    expect(rows[0].phone).toBe(userData.phone);
    expect(rows[0].email).toBe(userData.email);
    const isMatch = await bcrypt.compare(userData.password, rows[0].password_hash);
    expect(isMatch).toBe(true);

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
    const expectTest = expectedConfig.map(config => expect.objectContaining(config));
    ({ rows } = await pool.query("SELECT * FROM configuration WHERE agency_id=$1", [rows[0].id]))
    expect(rows.length).toBe(7);
    expect(rows).toEqual(expect.arrayContaining(expectTest));
});

test("Bad case: email not in correct format", async () => {
    const userData = {
        email: "testexample.com",
        password: "@SecurePass123",
        agencyName: "Test Agency",
        ownerName: "John Doe",
        phone: "1234567890"
    };

    const { error } = await signUpService(pool, userData);

    expect(error).toBeInstanceOf(errors.ValidationError);
    expect(error.message).toBe('Invalid email format');
});

test("Bad case: weak password", async () => {
    const userData = {
        email: "test@example.com",
        password: "SecurePass123",
        agencyName: "Test Agency",
        ownerName: "John Doe",
        phone: "1234567890"
    };

    const { error } = await signUpService(pool, userData);

    expect(error).toBeInstanceOf(errors.ValidationError);
    expect(error.message).toBe('Weak password: must be at least 8 characters, contain uppercase, lowercase, number, and special character');
});

test("Bad case: email has existed", async () => {
    const userData = {
        email: "test1@example.com",
        password: "@SecurePass123",
        agencyName: "Test Agency",
        ownerName: "John Doe",
        phone: "1234567890"
    };

    const { error } = await signUpService(pool, userData);
    expect(error).toBeInstanceOf(errors.ConflictError);
    expect(error.message).toBe('Email already exists');
});