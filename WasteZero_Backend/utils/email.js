import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendResetEmail(to, resetUrl) {
  const from = process.env.EMAIL_FROM || `WasteZero <noreply@yourdomain.com>`;
  const html = `
    <p>Hello,</p>
    <p>You requested a password reset. Click the link below to set a new password. This link expires in 1 hour.</p>
    <p><a href="${resetUrl}">Reset password</a></p>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `;
  await transporter.sendMail({
    from,
    to,
    subject: "Password reset — WasteZero",
    html,
  });
}
