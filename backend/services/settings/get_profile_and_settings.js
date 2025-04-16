import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { getSettings, getUserById } from '../../db/queries/generated/config.js';

/**
 * Handles GetProfileAndSettings logic.
 * @param {Object} user - The user info extracted from JWT token.
 * @param {Object} params - The request params.
 * @returns {Object} - Success message + profile & settings or error.
 */
export const getProfileAndSettingsService = async (pool, user) => {
    try {
        // Get user profile from database
        let result = await getUserById(pool, { id: user.userAgencyId });
        if (!result) {
            return { error: new errors.InternalError('Failed to get user profile from the database') };
        }
        const userProfile = result[consts.FIRST_IDX_ARRAY];

        // Get settings parameters from database
        result = await getSettings(pool, { agency_id: user.userAgencyId });
        if (!result) {
            return { error: new errors.InternalError('Failed to get settings parameters from the database') };
        }

        // Transform to return
        let settingsList = [];
        result.forEach(param => {
            settingsList.push({
                category: param.category,
                key: param.key,
                value: param.value
            });
        });

        return {
            message: 'Get profile and settings successfully',
            data: {
                userProfile: {
                    agencyName: userProfile.agency_name,
                    ownerName: userProfile.owner_name,
                    address: userProfile.address || consts.EMPTY_STRING,
                    taxCode: userProfile.tax_code || consts.EMPTY_STRING,
                    phoneNumber: userProfile.phone,
                    email: userProfile.email,
                    profilePicturePath: userProfile.profile_photo_path || consts.EMPTY_STRING
                },
                settings: settingsList
            }
        };
    } catch (error) {
        console.log(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};