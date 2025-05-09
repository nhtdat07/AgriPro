import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import * as passwordUtils from '../../utils/password.js';
import { setNewPasswordByEmail } from '../../db/queries/generated/auth.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Handles user ResetPassword logic.
 * @param {Object} data - The data from the request body.
 * @returns {Object} - Success message or error.
 */
export const resetPasswordService = async (pool, data) => {
    const { email, resetToken, newPassword } = data;

    try {
        // Check password strength
        if (!passwordUtils.validatePassword(newPassword)) {
            throw new errors.ValidationError(
                'Weak password: must be at least 8 characters, contain uppercase, lowercase, number, and special character'
            );
        }

        // Validate reset token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        if (decoded.email != email) {
            throw new errors.ValidationError('Incorrect reset token');
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, consts.PASSWORD_SALT);

        // Store new password
        const result = await setNewPasswordByEmail(pool, {
            email,
            password_hash: hashedPassword
        });
        if (!result) {
            throw new errors.InternalError('Failed to store new password into the database');
        }
        if (result.length == consts.ZERO_LENGTH) {
            throw new errors.ValidationError('Email does not exist');
        }

        return { message: 'Reset password successfully' };
    } catch (error) {
        if (error.name === consts.EXPIRED_RESET_TOKEN_ERROR_NAME) {
            return { error: new errors.ValidationError('Reset token has expired') };
        }
        if (error.statusCode) {
            return { error };
        }
        console.error(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};
