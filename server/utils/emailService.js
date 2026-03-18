import nodemailer from 'nodemailer';
import { google } from 'googleapis';

// ─────────────────────────────────────────────────────────────────────────────
// Gmail OAuth2 transport (uses HTTPS port 443 — never blocked by Render)
// Requires env vars: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN
// Fallback: plain SMTP via SMTP_USER / SMTP_PASS (works only outside Render)
// ─────────────────────────────────────────────────────────────────────────────

const oauthConfigured =
  process.env.GMAIL_CLIENT_ID &&
  process.env.GMAIL_CLIENT_SECRET &&
  process.env.GMAIL_REFRESH_TOKEN;

const smtpConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;

const createTransporter = async () => {
  if (oauthConfigured) {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });

    const { token: accessToken } = await oAuth2Client.getAccessToken();

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.SMTP_USER || process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken,
      },
    });
  }

  if (smtpConfigured) {
    console.warn('⚠️  Using basic SMTP — this may fail on Render free tier (SMTP ports blocked).');
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  console.warn('⚠️  No email credentials configured — using Mock Email Service.');
  return null;
};

// Accepts either sendEmail(to, subject, html) or sendEmail({ email, subject, html, attachments })
export const sendEmail = async (toOrOptions, subject, html, attachments) => {
  let to, emailSubject, emailHtml, emailAttachments;

  if (toOrOptions && typeof toOrOptions === 'object' && !Array.isArray(toOrOptions)) {
    to = toOrOptions.email;
    emailSubject = toOrOptions.subject;
    emailHtml = toOrOptions.html;
    emailAttachments = toOrOptions.attachments;
  } else {
    to = toOrOptions;
    emailSubject = subject;
    emailHtml = html;
    emailAttachments = attachments;
  }

  let transporter;
  try {
    transporter = await createTransporter();
  } catch (err) {
    console.error('❌ Failed to create email transporter:', err.message);
    transporter = null;
  }

  if (!transporter) {
    console.log(`
    ====================================================
    [MOCK EMAIL SERVICE]
    To: ${to}
    Subject: ${emailSubject}
    
    ${emailHtml.replace(/<[^>]*>?/gm, '')} 
    ====================================================
    `);
    return { success: true, messageId: 'MOCK_EMAIL_ID' };
  }

  try {
    const senderName = process.env.FROM_NAME || 'AWIK SPECTRUM';
    const senderEmail = process.env.SMTP_USER || process.env.GMAIL_USER;

    const info = await transporter.sendMail({
      from: `"${senderName}" <${senderEmail}>`,
      to,
      subject: emailSubject,
      html: emailHtml,
      ...(emailAttachments ? { attachments: emailAttachments } : {})
    });

    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed.');
    console.error('   Code   :', error.code);
    console.error('   Message:', error.message);

    if (error.code === 'EAUTH') {
      console.error('');
      console.error('   ⚠️  AUTH FAILURE — most likely causes:');
      console.error('   1. Using Gmail OAuth2: GMAIL_REFRESH_TOKEN may be expired. Generate a new one.');
      console.error('   2. Using basic SMTP: SMTP_PASS must be a Gmail App Password (not your login password).');
      console.error('');
    }

    return { success: false, error: error.message, code: error.code };
  }
};

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcfcfc; color: #1a1a1a; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px; background-color: #ffffff; border: 1px solid #f0f0f0; }
    .header { text-align: center; margin-bottom: 40px; }
    .logo { font-size: 24px; letter-spacing: 0.2em; font-weight: bold; color: #1a1a1a; text-decoration: none; }
    .content { line-height: 1.6; font-size: 16px; color: #333; }
    .button { display: inline-block; padding: 15px 30px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 14px; letter-spacing: 0.1em; margin-top: 30px; }
    .footer { margin-top: 60px; border-top: 1px solid #f0f0f0; padding-top: 20px; font-size: 12px; color: #999; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">AWIK SPECTRUM</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} AWIK SPECTRUM. All rights reserved.</p>
      <p>Private Client Services</p>
    </div>
  </div>
</body>
</html>
`;

export const passwordResetEmail = (user, resetUrl) => {
  const content = `
    <p>Dear ${user.name},</p>
    <p>We received a request to reset access to your private account.</p>
    <p>Please click the button below to secure your new credentials:</p>
    <div style="text-align: center;">
      <a href="${resetUrl}" class="button">RESET ACCESS</a>
    </div>
    <p>If you did not request this change, please contact our concierge immediately.</p>
    <p>This link will expire in 10 minutes.</p>
  `;
  return baseTemplate(content);
};

export const emailVerificationEmail = (user, verificationUrl) => {
  const content = `
    <p>Dear ${user.name},</p>
    <p>Welcome to AWIK SPECTRUM.</p>
    <p>To complete your entrance, please verify your email address:</p>
    <div style="text-align: center;">
      <a href="${verificationUrl}" class="button">VERIFY EMAIL</a>
    </div>
  `;
  return baseTemplate(content);
};

export const welcomeEmail = (user) => {
  const content = `
    <p>Dear ${user.name},</p>
    <p>It is a pleasure to welcome you to the Maison.</p>
    <p>Your private account has been established. You may now access our curated collections and exclusive services.</p>
    <div style="text-align: center;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" class="button">ENTER THE MAISON</a>
    </div>
  `;
  return baseTemplate(content);
};

export const otpEmail = (user, otp) => {
  const content = `
    <p>Dear ${user.name},</p>
    <p>Your authentication code is:</p>
    <h1 style="font-size: 32px; letter-spacing: 0.2em; text-align: center; margin: 30px 0;">${otp}</h1>
    <p>This code will expire in 10 minutes.</p>
  `;
  return baseTemplate(content);
};

