import express from 'express';
import { validateSignUpData } from '../middlewares/auth.js';
import { signUpController } from '../controllers/auth.js';

export const router = express.Router();

// POST /auth/sign-up
router.post('/sign-up', validateSignUpData, signUpController);

