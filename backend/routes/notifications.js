import express from 'express';
import { authenticateUser } from '../middlewares/header.js';
import * as notificationMiddlewares from '../middlewares/notifications.js';
import * as notificationControllers from '../controllers/notifications.js';

export const router = express.Router();

// GET /notifications
router.get('/',
    authenticateUser, notificationMiddlewares.validateGetListNotificationsData, notificationControllers.getListNotificationsController
);

// PATCH /notifications/{notificationId}
router.patch('/:notificationId',
    authenticateUser, notificationMiddlewares.validateReadNotificationData, notificationControllers.readNotificationController
);