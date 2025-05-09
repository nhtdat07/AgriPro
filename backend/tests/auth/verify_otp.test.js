import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import jwt from 'jsonwebtoken';
import * as errors from '../../errors/error_handler.js';
import { generateOtp } from '../../utils/otp.js';
import { verifyOtpService } from '../../services/auth/verify_otp.js';

test("Happy case: should return reset token when verifying OTP successfully", async () => {
    const data = {
        email: "test1@example.com"
    };

    data.inputOtp = String(await generateOtp(data.email));

    const result = await verifyOtpService(data);
    const payload = jwt.verify(result.data.resetToken, process.env.JWT_SECRET);

    expect(result.message).toBe('Verify OTP successfully');
    expect(payload.email).toBe(data.email);
});

test("Bad case: incorrect email", async () => {
    const data = {
        email: "test2@example.com",
        inputOtp: "123456"
    };

    const { error } = await verifyOtpService(data);

    expect(error).toBeInstanceOf(errors.UndefinedError);
    expect(error.message).toBe('This email is not sent any OTP');
});

test("Bad case: incorrect OTP", async () => {
    const data = {
        email: "test1@example.com"
    };

    data.inputOtp = String(await generateOtp(data.email) - 1);

    const { error } = await verifyOtpService(data);

    expect(error).toBeInstanceOf(errors.ValidationError);
    expect(error.message).toBe('Incorrect OTP');
});

test("Bad case: expired OTP", async () => {
    const originalDateNow = Date.now;

    const data = {
        email: "test1@example.com"
    };

    Date.now = () => 0;
    data.inputOtp = String(await generateOtp(data.email));

    Date.now = () => 5 * 60 * 1000 + 1;
    const { error } = await verifyOtpService(data);

    Date.now = originalDateNow;

    expect(error).toBeInstanceOf(errors.ValidationError);
    expect(error.message).toBe('OTP has expired');
});