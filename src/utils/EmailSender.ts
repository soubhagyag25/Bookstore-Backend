import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function sendEmail(mail: string, token: string, FnameOfUser: string) {
    let transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS,  
        },
    });

    let mailOptions = {
        from: `"Bookstore Application" <${process.env.EMAIL_USER}>`,
        to: mail,
        subject: 'Password Reset Request',
        text: '', 
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h2>Hello ${FnameOfUser},</h2>
            <p>We received a request to reset your password. Click the link below to reset it:</p>
            <p>
                <a href="http://localhost:${process.env.APP_PORT}/reset-password?token=${token}" 
                   style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Reset Password
                </a>
            </p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Best regards,<br>Gautam IT Solutions Pvt. Ltd.</p>
        </div>
        `
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
