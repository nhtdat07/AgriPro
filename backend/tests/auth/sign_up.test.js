import bcrypt from 'bcryptjs';
import { pool } from '../../db.js';
import { signUpService } from '../../services/auth/sign_up.js';
import * as errors from '../../errors/error_handler.js';

afterEach(async () => {
    await pool.query("DELETE FROM user_agency;");
});

afterAll(async () => {
    await pool.end();
});

test("Happy case: should store user in the database successfully", async () => {
    const userData = {
        email: "test@example.com",
        password: "@SecurePass123",
        agencyName: "Test Agency",
        ownerName: "John Doe",
        phone: "1234567890"
    };

    const _ = await signUpService(userData);

    const { rows } = await pool.query("SELECT * FROM user_agency WHERE email=$1", [userData.email]);
    expect(rows.length).toBe(1);
    expect(rows[0].agency_name).toBe(userData.agencyName);
    expect(rows[0].owner_name).toBe(userData.ownerName);
    expect(rows[0].phone).toBe(userData.phone);
    expect(rows[0].email).toBe(userData.email);
    const isMatch = await bcrypt.compare(userData.password, rows[0].password_hash);
    expect(isMatch).toBe(true);
});

test("Bad case: email not in correct format", async () => {
    const userData = {
        email: "testexample.com",
        password: "@SecurePass123",
        agencyName: "Test Agency",
        ownerName: "John Doe",
        phone: "1234567890"
    };

    const { error } = await signUpService(userData);

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

    const { error } = await signUpService(userData);

    expect(error).toBeInstanceOf(errors.ValidationError);
    expect(error.message).toBe('Weak password: must be at least 8 characters, contain uppercase, lowercase, number, and special character');
});

test("Bad case: email has existed", async () => {
    try {
        const _ = await pool.query(
            `INSERT INTO user_agency (email, password_hash) VALUES ('test@example.com', '123');`
        );
    } catch (error) {
        console.error('Error insert data:', error);
        throw error;
    }

    const userData = {
        email: "test@example.com",
        password: "@SecurePass123",
        agencyName: "Test Agency",
        ownerName: "John Doe",
        phone: "1234567890"
    };

    const { error } = await signUpService(userData);
    expect(error).toBeInstanceOf(errors.ConflictError);
    expect(error.message).toBe('Email already exists');
});