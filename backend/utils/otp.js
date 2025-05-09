import * as consts from '../consts/consts.js';
import * as errors from '../errors/error_handler.js';
import bcrypt from 'bcryptjs';

const otpStore = {};

export const generateOtp = async (email) => {
    const otp = Math.floor(consts.MIN_OTP + Math.random() * consts.OTP_STEP);
    const otpHash = await bcrypt.hash(String(otp), consts.OTP_SALT);
    const expiredTime = Date.now() + consts.OTP_EXPIRED_TIME;

    otpStore[email] = { otpHash, expiredTime };
    return otp;
};

export const checkOtp = async (email, inputOtp) => {
    const otpInfo = otpStore[email];
    if (!otpInfo) {
        throw new errors.UndefinedError('This email is not sent any OTP');
    }

    const isMatch = await bcrypt.compare(inputOtp, otpInfo.otpHash);
    if (!isMatch) {
        throw new errors.ValidationError('Incorrect OTP');
    }

    if (Date.now() > otpInfo.expiredTime) {
        throw new errors.ValidationError('OTP has expired');
    }
};

export const removeOtp = (email) => {
    delete otpStore[email];
}