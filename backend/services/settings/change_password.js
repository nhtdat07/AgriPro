import bcrypt from 'bcryptjs';
import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { validatePassword } from '../../utils/password.js';
import { getUserById, updatePassword } from '../../db/queries/generated/config.js';

/**
 * Handles ChangePassword logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} data - The password data to be updated from the request body.
 * @returns {Object} - Success message or error.
 */
export const changePasswordService = async (pool, user, data) => {
    const { oldPassword, newPassword } = data;

    try {
        // Check strength of new password
        if (!validatePassword(newPassword)) {
            throw new errors.ValidationError(
                'Weak password: must be at least 8 characters, contain uppercase, lowercase, number, and special character'
            );
        }

        // Get user info from the database
        let result = await getUserById(pool, { id: user.userAgencyId });
        if (!result) {
            throw new errors.InternalError('Failed to get user info from the database');
        }

        // Validate old password
        const isMatch = await bcrypt.compare(oldPassword, result[consts.FIRST_IDX_ARRAY].password_hash)
        if (!isMatch) {
            throw new errors.UnauthorizedError('Incorrect password');
        }

        // Hash the new password before storing it
        const hashedPassword = await bcrypt.hash(newPassword, consts.PASSWORD_SALT);

        // Store new password hash
        result = updatePassword(pool, {
            id: user.userAgencyId,
            password_hash: hashedPassword
        });
        if (!result) {
            throw new errors.InternalError('Failed to store new password into the database');
        }

        return { message: 'Update password successfully' };
    } catch (error) {
        if (error.statusCode) {
            return { error };
        }
        console.error(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};