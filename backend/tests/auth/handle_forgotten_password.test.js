import * as errors from '../../errors/error_handler.js';
import { createTableUserAgency } from '../../db/schema/generated/user_agency.up.js';
import * as dbTest from '../test_util.js';
import { handleForgottenPasswordService } from '../../services/auth/handle_forgotten_password.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableUserAgency(pool);
});

beforeEach(async () => {
    try {
        await pool.query(`
            INSERT INTO user_agency (email, password_hash) VALUES ('tiendatcs07@gmail.com', '123');
        `);
    } catch (error) {
        console.error('Error insert data:', error);
        throw error;
    }
});

afterEach(async () => {
    await pool.query(`
        TRUNCATE TABLE user_agency RESTART IDENTITY;
    `);
});

afterAll(async () => {
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should send an email for OTP successfully", async () => {
    const data = {
        email: "tiendatcs07@gmail.com"
    };

    // await handleForgottenPasswordService(pool, data);
});

test("Bad case: email not existed", async () => {
    const data = {
        email: "test1@example.com"
    };

    const { error } = await handleForgottenPasswordService(pool, data);
    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('Email does not exist');
});