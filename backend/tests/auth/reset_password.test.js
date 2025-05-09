import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as errors from '../../errors/error_handler.js';
import * as dbTest from '../test_util.js';
import * as consts from '../../consts/consts.js';
import { createTableUserAgency } from '../../db/schema/generated/user_agency.up.js';
import { resetPasswordService } from '../../services/auth/reset_password.js';

let pool;

beforeAll(async () => {
    pool = await dbTest.setupTestDb();
    await createTableUserAgency(pool);
    try {
        await pool.query(`
            INSERT INTO user_agency (email, password_hash) 
            VALUES ('test1@example.com', '$2b$10$HDtrc5bz.n/FHZWLKr8wWOgVfSvaahxQnvklPx7RUfcyO0edLASQm');
        `);
    } catch (error) {
        console.error('Error insert data:', error);
        throw error;
    }
});

afterAll(async () => {
    await pool.query("TRUNCATE TABLE user_agency RESTART IDENTITY;");
    await dbTest.teardownTestDb(pool);
});

test("Happy case: should reset password successfully", async () => {
    const data = {
        email: 'test1@example.com',
        newPassword: "@SecurePass124"
    };

    const payload = { email: data.email };
    const option = { expiresIn: consts.RESET_TOKEN_EXPIRED_TIME };
    data.resetToken = jwt.sign(payload, process.env.JWT_SECRET, option);

    await resetPasswordService(pool, data);

    let { rows } = await pool.query("SELECT * FROM user_agency WHERE id=$1", ['UA0001']);
    const isMatch = await bcrypt.compare(data.newPassword, rows[0].password_hash);
    expect(isMatch).toBe(true);
});

test("Bad case: weak password", async () => {
    const data = {
        email: 'test1@example.com',
        newPassword: "SecurePass124"
    };

    const { error } = await resetPasswordService(pool, data);

    expect(error).toBeInstanceOf(errors.ValidationError);
    expect(error.message).toBe('Weak password: must be at least 8 characters, contain uppercase, lowercase, number, and special character');
});

test("Bad case: incorrect reset token", async () => {
    const data = {
        email: 'test1@example.com',
        newPassword: "@SecurePass124"
    };

    const payload = { email: 'test2@example.com' };
    const option = { expiresIn: consts.RESET_TOKEN_EXPIRED_TIME };
    data.resetToken = jwt.sign(payload, process.env.JWT_SECRET, option);

    const { error } = await resetPasswordService(pool, data);

    expect(error).toBeInstanceOf(errors.ValidationError);
    expect(error.message).toBe('Incorrect reset token');
});

test("Bad case: incorrect email", async () => {
    const data = {
        email: 'test2@example.com',
        newPassword: "@SecurePass124"
    };

    const payload = { email: data.email };
    const option = { expiresIn: consts.RESET_TOKEN_EXPIRED_TIME };
    data.resetToken = jwt.sign(payload, process.env.JWT_SECRET, option);

    const { error } = await resetPasswordService(pool, data);

    expect(error).toBeInstanceOf(errors.ValidationError);
    expect(error.message).toBe('Email does not exist');
});