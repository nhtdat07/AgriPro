import bcrypt from 'bcryptjs';
import * as errors from '../../errors/error_handler.js';
import * as dbTest from '../test_util.js';
import { createTableUserAgency } from '../../db/schema/generated/user_agency.up.js';
import { changePasswordService } from '../../services/settings/change_password.js';

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

test("Happy case: should change password successfully", async () => {
    const user = { userAgencyId: 'UA0001' };
    const data = {
        oldPassword: "@SecurePass123",
        newPassword: "@SecurePass124"
    };

    await changePasswordService(pool, user, data);

    let { rows } = await pool.query("SELECT * FROM user_agency WHERE id=$1", [user.userAgencyId]);
    const isMatch = await bcrypt.compare(data.newPassword, rows[0].password_hash);
    expect(isMatch).toBe(true);
});

test("Bad case: weak password", async () => {
    const user = { userAgencyId: 'UA0001' };
    const data = {
        oldPassword: "@SecurePass123",
        newPassword: "SecurePass124"
    };

    const { error } = await changePasswordService(pool, user, data);

    expect(error).toBeInstanceOf(errors.ValidationError);
    expect(error.message).toBe('Weak password: must be at least 8 characters, contain uppercase, lowercase, number, and special character');
});

test("Bad case: incorrect password", async () => {
    const user = { userAgencyId: 'UA0001' };
    const data = {
        oldPassword: "@SecurePass125",
        newPassword: "@SecurePass124"
    };

    const { error } = await changePasswordService(pool, user, data);

    expect(error).toBeInstanceOf(errors.UnauthorizedError);
    expect(error.message).toBe('Incorrect password');
});