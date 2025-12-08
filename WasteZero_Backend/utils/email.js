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

/** Send password reset email */
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

/** Send OTP email for signup */
export async function sendOtpEmail(to, otp) {
  const from = process.env.EMAIL_FROM || `WasteZero <noreply@yourdomain.com>`;
  const html = `
    <p>Hello,</p>
    <p>Your One-Time Password (OTP) for WasteZero signup is:</p>
    <h2 style="color: #28a745;">${otp}</h2>
    <p>This OTP is valid for 5 minutes.</p>
    <p>If you didn't request this, you can safely ignore this email.</p>
  `;
  await transporter.sendMail({
    from,
    to,
    subject: "Your OTP for WasteZero Signup",
    html,
  });
}


/** Send Contact Support Email */
export async function sendSupportEmail(fromEmail, userMessage) {
  const to =
    process.env.SUPPORT_EMAIL || 
    process.env.SMTP_USER;       

  if (!to) {
    throw new Error("Support email (SUPPORT_EMAIL or SMTP_USER) not configured");
  }

  const html = `
    <h3>New Support Request</h3>
    <p><strong>From:</strong> ${fromEmail}</p>
    <p><strong>Message:</strong></p>
    <p>${userMessage}</p>
  `;

  await transporter.sendMail({
    from: fromEmail, // USER EMAIL
    to,              // SUPPORT EMAIL
    subject: "New Support Request — WasteZero",
    html,
  });
}

