import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import jwt from 'jsonwebtoken';
import { signInService } from '../../services/auth/sign_in.js';
import * as errors from '../../errors/error_handler.js';
import { createTableUserAgency } from '../../db/schema/generated/user_agency.up.js';
import * as dbTest from '../test_util.js';

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

test("Happy case: should return JWT token when signing in successfully", async () => {
    const userData = {
        email: "test1@example.com",
        password: "@SecurePass123"
    };

    const result = await signInService(pool, userData);
    const payload = jwt.verify(result.data.token, process.env.JWT_SECRET);

    expect(result.message).toBe('User signed in successfully');
    expect(payload.userAgencyId).toBe('UA0001');
});

test("Bad case: incorrect email", async () => {
    const userData = {
        email: "test2@example.com",
        password: "@SecurePass123"
    };

    const { error } = await signInService(pool, userData);

    expect(error).toBeInstanceOf(errors.UnauthorizedError);
    expect(error.message).toBe('Email does not exist');
});

test("Bad case: incorrect password", async () => {
    const userData = {
        email: "test1@example.com",
        password: "@SecurePass124"
    };

    const { error } = await signInService(pool, userData);

    expect(error).toBeInstanceOf(errors.UnauthorizedError);
    expect(error.message).toBe('Incorrect password');
});