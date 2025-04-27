import * as consts from '../consts/consts.js';
import { errorHandler } from '../errors/error_handler.js';
import { pool } from '../db.js';
import { getProfileAndSettingsService } from '../services/settings/get_profile_and_settings.js';
import { updateProfileAndSettingsService } from '../services/settings/update_profile_and_settings.js';
import { changePasswordService } from '../services/settings/change_password.js';

// Controller for handling user GetProfileAndSettings requests
export const getProfileAndSettingsController = async (req, res) => {
    try {
        const result = await getProfileAndSettingsService(pool, req.user);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({
                message: result.message,
                data: result.data
            });
        }
    } catch (error) {
        console.error('GetProfileAndSettings error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user UpdateProfileAndSettings requests
export const updateProfileAndSettingsController = async (req, res) => {
    try {
        const result = await updateProfileAndSettingsService(pool, req.user, req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({ message: result.message });
        }
    } catch (error) {
        console.error('UpdateProfileAndSettings error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};

// Controller for handling user ChangePassword requests
export const changePasswordController = async (req, res) => {
    try {
        const result = await changePasswordService(pool, req.user, req.body);

        if (result.error) {
            errorHandler(result.error, res)
        } else {
            res.status(consts.HTTP_STATUS.OK).json({ message: result.message });
        }
    } catch (error) {
        console.error('ChangePassword error:', error);
        res.status(consts.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
};