import express from 'express';
import { authenticateUser } from '../middlewares/header.js';
import * as settingsMiddlewares from '../middlewares/settings.js';
import * as settingsControllers from '../controllers/settings.js';

export const router = express.Router();

// GET /settings
router.get('/', authenticateUser, settingsControllers.getProfileAndSettingsController);

// PATCH /settings
router.patch('/',
    authenticateUser, settingsMiddlewares.validateUpdateProfileAndSettingsData, settingsControllers.updateProfileAndSettingsController
);

// PATCH /settings/password
router.patch('/password',
    authenticateUser, settingsMiddlewares.validateChangePasswordData, settingsControllers.changePasswordController
);
