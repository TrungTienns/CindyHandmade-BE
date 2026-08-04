const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const sendOtpEmail = async (email, otp, name = '') => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"Cindy Handmade 🧶" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Mã xác nhận đặt lại mật khẩu',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
                <tr><td align="center">
                    <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
                        <!-- Header -->
                        <tr>
                            <td style="background:linear-gradient(135deg,#D4956A,#C17C5A);padding:36px 40px;text-align:center;">
                                <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:1px;">Cindy Handmade 🧶</h1>
                                <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Đặt lại mật khẩu của bạn</p>
                            </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                            <td style="padding:40px;">
                                <p style="margin:0 0 16px;color:#333;font-size:16px;">Xin chào <strong>${name || email}</strong>,</p>
                                <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                                    Chúng tôi nhận được yêu cầu đặt lại mật khẩu của bạn. Hãy sử dụng mã OTP dưới đây để tiếp tục:
                                </p>
                                <!-- OTP Box -->
                                <div style="background:#FDF6F0;border:2px dashed #D4956A;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
                                    <p style="margin:0 0 8px;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:2px;">Mã xác nhận</p>
                                    <span style="font-size:42px;font-weight:800;letter-spacing:10px;color:#D4956A;">${otp}</span>
                                </div>
                                <p style="margin:0 0 24px;color:#888;font-size:13px;text-align:center;">
                                    ⏱ Mã này sẽ hết hạn sau <strong>15 phút</strong>
                                </p>
                                <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
                                <p style="margin:0;color:#aaa;font-size:12px;">
                                    Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Tài khoản của bạn vẫn an toàn.
                                </p>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eee;">
                                <p style="margin:0;color:#ccc;font-size:12px;">© 2024 Cindy Handmade. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td></tr>
            </table>
        </body>
        </html>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
