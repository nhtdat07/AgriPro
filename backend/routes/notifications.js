import express from 'express';
import { authenticateUser } from '../middlewares/header.js';
import * as notificationMiddlewares from '../middlewares/notifications.js';
import * as notificationControllers from '../controllers/notifications.js';

export const router = express.Router();

// PATCH /notifications/{notificationId}
router.patch('/:notificationId',
    authenticateUser, notificationMiddlewares.validateReadNotificationData, notificationControllers.readNotificationController
);