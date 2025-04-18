import bcrypt from 'bcryptjs';
import { addUser } from '../../db/queries/generated/auth.js';
import { addDefaultConfig } from '../../db/queries/generated/config.js';
import * as consts from '../../consts/consts.js';
import * as errors from '../../errors/error_handler.js';
import * as passwordUtils from '../../utils/password.js';

/**
 * Handles user sign-up logic.
 * @param {Object} userData - The user details from the request body.
 * @returns {Object} - Success message or error.
 */
export const signUpService = async (pool, userData) => {
    const { agencyName, ownerName, email, phone, password } = userData;

    try {
        // Check email format
        if (!passwordUtils.validateEmail(email)) {
            return { error: new errors.ValidationError('Invalid email format') };
        }

        // Check password strength
        if (!passwordUtils.validatePassword(password)) {
            return {
                error: new errors.ValidationError(
                    'Weak password: must be at least 8 characters, contain uppercase, lowercase, number, and special character'
                )
            };
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, consts.PASSWORD_SALT);

        // Store the new user in the database
        let result = await addUser(pool, {
            agencyName, ownerName, email,
            phone: phone || consts.EMPTY_STRING,
            password_hash: hashedPassword
        });
        if (!result) {
            return { error: new errors.InternalError('Database failed to create user') };
        }

        const agencyId = result[consts.FIRST_IDX_ARRAY].id;
        result = await addDefaultConfig(pool, { agency_id: agencyId });
        if (!result) {
            return { error: new errors.InternalError('Database failed to create default config') };
        }

        return { message: 'User registered successfully' };
    } catch (error) {
        if (error.code === consts.SQL_UNIQUE_ERROR_CODE) {
            return { error: new errors.ConflictError('Email already exists') };
        }
        console.log(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};
