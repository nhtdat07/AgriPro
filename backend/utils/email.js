import nodemailer from 'nodemailer';
import * as consts from '../consts/consts.js';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const sendOtp = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: consts.MAIL_SERVICE,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GOOGLE_APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: consts.SEND_OTP_SUBJECT,
        text: `AgriPro xin chào bạn!
        
Đây là mã OTP của bạn dùng để đặt lại mật khẩu cho tài khoản: ${otp}

(Mã OTP này có hiệu lực trong 5 phút kể từ lúc được gửi đi)

AgriPro xin chân thành cảm ơn bạn đã sử dụng hệ thống! Chúc bạn luôn vui khoẻ, may mắn và thành công!

Trân trọng,
AgriPro`,
        html: `<div style="font-family: Arial, sans-serif; color: #333; font-size: 15px; line-height: 1.6; padding: 20px; max-width: 1000px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; background-color: #efffef;">
    <p><strong>AgriPro</strong> xin chào bạn!</p>

    <p>Đây là mã OTP của bạn dùng để đặt lại mật khẩu cho tài khoản: <span style="display: inline-block; background-color: #e0f7fa; color: #00796b; font-weight: bold; padding: 4px 8px; border-radius: 4px;">${otp}</span><br/><span style="font-size: 13px; color: #666;"><em>(Mã OTP này có hiệu lực trong 5 phút kể từ lúc được gửi đi)</em></span></p>

    <p><strong>AgriPro</strong> xin chân thành cảm ơn bạn đã sử dụng hệ thống! Chúc bạn luôn vui khoẻ, may mắn và thành công!</p>

    <p style="margin-top: 50px">Trân trọng,</p>
    <img src="https://drive.google.com/uc?export=view&id=1k2AprOrnJii7icJ0gcOhrB3NUlr2v0L8" alt="AgriPro Logo" style="height: 100px;"/>

    <hr style="margin-top: 24px; border: none; border-top: 1px solid #ddd;" />
    <p style="font-size: 11px; color: #999;">Đây là email tự động. Vui lòng không trả lời.</p>
    </div>
</div>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email of OTP sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}