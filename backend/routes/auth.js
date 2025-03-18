import express from 'express';
import * as authMiddlewares from '../middlewares/auth.js';
import * as authControllers from '../controllers/auth.js';

export const router = express.Router();

// POST /auth/sign-up
router.post('/sign-up', authMiddlewares.validateSignUpData, authControllers.signUpController);

// POST /auth/sign-in
router.post('/sign-in', authMiddlewares.validateSignInData, authControllers.signInController)

