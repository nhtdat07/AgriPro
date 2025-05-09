import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { checkOtp, removeOtp } from '../../utils/otp.js';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Handles user VerifyOtp logic.
 * @param {Object} data - The data from the request body.
 * @returns {Object} - Success message or error.
 */
export const verifyOtpService = async (data) => {
    const { email, inputOtp } = data;

    try {
        // Verify OTP
        await checkOtp(email, inputOtp);

        // Create reset token for password reset
        const payload = { email };
        const option = { expiresIn: consts.RESET_TOKEN_EXPIRED_TIME };
        const resetToken = jwt.sign(payload, process.env.JWT_SECRET, option);

        // Remove stored OTP
        removeOtp(email);

        return {
            message: 'Verify OTP successfully',
            data: { resetToken }
        };
    } catch (error) {
        if (error.statusCode) {
            return { error };
        }
        console.error(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};
