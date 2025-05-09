import { getUserByEmail } from '../../db/queries/generated/auth.js';
import * as errors from '../../errors/error_handler.js';
import * as consts from '../../consts/consts.js';
import { generateOtp } from '../../utils/otp.js';
import { sendOtp } from '../../utils/email.js';

/**
 * Handles user HandleForgottenPassword logic.
 * @param {Object} data - The data from the request body.
 * @returns {Object} - Success message or error.
 */
export const handleForgottenPasswordService = async (pool, data) => {
    const { email } = data;

    try {
        // Check if email exists
        const result = await getUserByEmail(pool, { email });
        if (!result || result.length == consts.ZERO_LENGTH) {
            throw new errors.UndefinedError('Email does not exist');
        }

        // Generate random OTP
        const otp = await generateOtp(email);

        // Send OTP by email
        await sendOtp(email, otp);

        return { message: 'Email of OTP sent successfully' };
    } catch (error) {
        if (error.statusCode) {
            return { error };
        }
        console.error(error);
        return { error: new errors.InternalError('Internal server error') };
    }
};
