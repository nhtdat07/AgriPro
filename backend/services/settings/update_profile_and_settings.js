import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import * as dbUtils from '../../utils/db.js';
import { updateConfig, updateProfile } from '../../db/queries/generated/config.js';

/**
 * Handles UpdateProfileAndSettings logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} data - The profile & settings data to be updated from the request body.
 * @returns {Object} - Success message or error.
 */
export const updateProfileAndSettingsService = async (pool, user, data) => {
    const { userProfile, settings } = data;

    try {
        // Start DB transaction
        await dbUtils.startTransaction(pool);

        let result;

        // Update user profile to database
        if (userProfile) {
            result = await updateProfile(pool, {
                agency_name: userProfile.agencyName,
                owner_name: userProfile.ownerName,
                address: userProfile.address,
                tax_code: userProfile.taxCode,
                phone: userProfile.phoneNumber,
                email: userProfile.email,
                profile_photo_path: userProfile.profilePicturePath,
                agency_id: user.userAgencyId
            })
            if (!result) {
                throw new errors.InternalError('Failed to update user profile to the database');
            }
        }

        if (settings) {
            for (let param of settings) {
                const { category, key, value } = param;

                if (!consts.CONFIG_TYPES.includes(category)) {
                    throw new errors.ValidationError(`Invalid config category: ${category}`);
                }

                result = await updateConfig(pool, {
                    agency_id: user.userAgencyId,
                    category,
                    key,
                    value
                });
                if (!result) {
                    throw new errors.InternalError('Failed to update settings to the database');
                }
            }
        }

        // Commit DB transaction
        await dbUtils.commitTransaction(pool);

        return { message: 'Update profile & settings successfully' };
    } catch (error) {
        // Rollback DB transaction
        await dbUtils.rollbackTransaction(pool);

        if (error.code === consts.SQL_UNIQUE_ERROR_CODE) {
            return { error: new errors.ConflictError('Email already exists') };
        }
        if (error.statusCode) {
            return { error };
        }
        console.error(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};