import express from 'express';
import * as authMiddlewares from '../middlewares/auth.js';
import * as authControllers from '../controllers/auth.js';

export const router = express.Router();

// POST /auth/sign-up
router.post('/sign-up', authMiddlewares.validateSignUpData, authControllers.signUpController);

// POST /auth/sign-in
router.post('/sign-in', authMiddlewares.validateSignInData, authControllers.signInController);

// POST /auth/forgot-password
router.post('/forgot-password',
    authMiddlewares.validateHandleForgottenPasswordData, authControllers.handleForgottenPasswordController
);

// POST /auth/verify-otp
router.post('/verify-otp', authMiddlewares.validateVerifyOtpData, authControllers.verifyOtpController);

// PATCH /auth/reset-password
router.patch('/reset-password', authMiddlewares.validateResetPasswordData, authControllers.resetPasswordController);