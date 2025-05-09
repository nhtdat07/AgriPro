import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByEmail } from '../../db/queries/generated/auth.js';
import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';

/**
 * Handles user sign-in logic.
 * @param {Object} userData - The user details from the request body.
 * @returns {Object} - Success message and JWT token or error.
 */
export const signInService = async (pool, userData) => {
    const { email, password } = userData;

    try {
        // Get user information by email
        const result = await getUserByEmail(pool, { email });

        if (!result || result.length == consts.ZERO_LENGTH) {
            throw new errors.UnauthorizedError('Email does not exist');
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, result[consts.FIRST_IDX_ARRAY].password_hash);
        if (!isMatch) {
            throw new errors.UnauthorizedError('Incorrect password');
        }

        // Generate JWT token
        const payload = { userAgencyId: result[consts.FIRST_IDX_ARRAY].id };
        const option = { expiresIn: consts.DEFAULT_TOKEN_EXPIRED_TIME };
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, option);

        return {
            message: 'User signed in successfully',
            data: { token: jwtToken }
        };
    } catch (error) {
        if (error.statusCode) {
            return { error };
        }
        console.error(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};
