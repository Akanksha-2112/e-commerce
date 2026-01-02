import nodemailer from 'nodemailer';

// Create reusable transporter
// NOTE: For production, replace with SendGrid or Mailgun configuration
const createTransporter = () => {
  // For development: using Gmail SMTP (you'll need to set up app password)
  // For production: use SendGrid, Mailgun, or AWS SES
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // Your email
      pass: process.env.SMTP_PASS  // Your app password
    }
  });
};

// Send email utility
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.FROM_NAME || 'AWIK SPECTRUM'} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

// Password Reset Email Template
export const passwordResetEmail = (user, resetUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background-color: #F8FAFC;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #FF7D40 0%, #FF9D70 100%);
          padding: 40px 30px;
          text-align: center;
          color: #FFFFFF;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #1e293b;
          font-size: 22px;
          margin-top: 0;
        }
        .content p {
          color: #64748b;
          line-height: 1.6;
          font-size: 16px;
        }
        .button {
          display: inline-block;
          padding: 16px 40px;
          background: #FF7D40;
          color: #FFFFFF;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 700;
          margin: 20px 0;
          box-shadow: 0 4px 12px rgba(255, 125, 64, 0.3);
        }
        .footer {
          padding: 30px;
          text-align: center;
          background: #F8FAFC;
          color: #94a3b8;
          font-size: 14px;
        }
        .warning {
          background: #FEF2F2;
          border-left: 4px solid #EF4444;
          padding: 15px;
          margin: 20px 0;
          border-radius: 8px;
        }
        .warning p {
          margin: 0;
          color: #991B1B;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 AWIK SPECTRUM</h1>
        </div>
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your password for your AWIK SPECTRUM account. Click the button below to create a new password:</p>
          <center>
            <a href="${resetUrl}" class="button">Reset Password</a>
          </center>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #FF7D40;">${resetUrl}</p>
          <div class="warning">
            <p><strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email and your password will remain unchanged.</p>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AWIK SPECTRUM. All rights reserved.</p>
          <p>Elevate Your Style</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email Verification Template
export const emailVerificationEmail = (user, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background-color: #F8FAFC;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #FF7D40 0%, #FF9D70 100%);
          padding: 40px 30px;
          text-align: center;
          color: #FFFFFF;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #1e293b;
          font-size: 22px;
          margin-top: 0;
        }
        .content p {
          color: #64748b;
          line-height: 1.6;
          font-size: 16px;
        }
        .button {
          display: inline-block;
          padding: 16px 40px;
          background: #FF7D40;
          color: #FFFFFF;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 700;
          margin: 20px 0;
          box-shadow: 0 4px 12px rgba(255, 125, 64, 0.3);
        }
        .footer {
          padding: 30px;
          text-align: center;
          background: #F8FAFC;
          color: #94a3b8;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✉️ AWIK SPECTRUM</h1>
        </div>
        <div class="content">
          <h2>Verify Your Email Address</h2>
          <p>Hi ${user.name},</p>
          <p>Thank you for joining AWIK SPECTRUM! To complete your registration and unlock all features, please verify your email address by clicking the button below:</p>
          <center>
            <a href="${verificationUrl}" class="button">Verify Email</a>
          </center>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #FF7D40;">${verificationUrl}</p>
          <p>Once verified, you'll be able to:</p>
          <ul style="color: #64748b;">
            <li>Shop exclusive collections</li>
            <li>Track your orders</li>
            <li>Save items to your wishlist</li>
            <li>Receive personalized recommendations</li>
          </ul>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AWIK SPECTRUM. All rights reserved.</p>
          <p>Elevate Your Style</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Welcome Email Template
export const welcomeEmail = (user) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background-color: #F8FAFC;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #FFFFFF;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, #FF7D40 0%, #FF9D70 100%);
          padding: 40px 30px;
          text-align: center;
          color: #FFFFFF;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 800;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #1e293b;
          font-size: 22px;
          margin-top: 0;
        }
        .content p {
          color: #64748b;
          line-height: 1.6;
          font-size: 16px;
        }
        .footer {
          padding: 30px;
          text-align: center;
          background: #F8FAFC;
          color: #94a3b8;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to AWIK SPECTRUM!</h1>
        </div>
        <div class="content">
          <h2>Hi ${user.name},</h2>
          <p>Welcome to the AWIK SPECTRUM family! We're thrilled to have you join us on your style journey.</p>
          <p>At AWIK SPECTRUM, we believe fashion is more than just clothing—it's a way to express yourself and elevate your confidence.</p>
          <p><strong>What's next?</strong></p>
          <ul style="color: #64748b;">
            <li>Explore our latest collections</li>
            <li>Personalize your profile</li>
            <li>Add items to your wishlist</li>
            <li>Enjoy exclusive member benefits</li>
          </ul>
          <p>If you have any questions, our support team is always here to help!</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} AWIK SPECTRUM. All rights reserved.</p>
          <p>Elevate Your Style</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// OTP Verification Email Template
export const otpEmail = (user, otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400&display=swap');
        body { margin: 0; padding: 0; background-color: #050505; color: #e2e8f0; }
        .external-link { color: #D4AF37 !important; text-decoration: none; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Inter', Helvetica, Arial, sans-serif;">
      
      <!-- MAIN WRAPPER - Deep Black Background -->
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#050505">
        <tr>
          <td align="center" valign="middle" style="padding: 40px 10px;">
            
            <!-- CENTRAL CARD - Royal Obsidian & Gold -->
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="width: 100%; max-width: 600px; background-color: #0a0a0a; border: 1px solid #1a1a1a; border-top: 4px solid #D4AF37; border-radius: 2px; box-shadow: 0 40px 100px rgba(0,0,0,0.9);">
              
              <!-- HEADER SECTION -->
              <tr>
                <td align="center" style="padding: 50px 0 30px 0;">
                   <!-- REAL LOGO -->
                   <img src="cid:logo" alt="AWIK SPECTRUM" width="120" style="display: block; margin-bottom: 20px; border-radius: 4px;" />
                   
                   <!-- PROTOCOL HEADER -->
                   <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-weight: 400; font-size: 24px; letter-spacing: 2px; color: #D4AF37; text-transform: uppercase;">
                     AUTHENTICATION
                   </h1>
                   <div style="height: 1px; width: 60px; background-color: #333; margin-top: 15px;"></div>
                </td>
              </tr>

              <!-- GREETING -->
              <tr>
                <td align="center" style="padding: 0 40px;">
                  <p style="margin: 0; color: #94a3b8; font-size: 14px; font-family: 'Playfair Display', serif; font-style: italic;">
                    Welcome back, ${user.name}
                  </p>
                </td>
              </tr>

              <!-- CONTENT -->
              <tr>
                <td align="center" style="padding: 40px;">
                  
                  <!-- OTP GOLD CARD -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td align="center" style="
                        background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, rgba(10, 10, 10, 0) 70%);
                        border: 1px solid rgba(212, 175, 55, 0.3); /* Gold Stroke */
                        border-radius: 4px;
                        padding: 30px 0;
                      ">
                        <span style="
                          font-family: 'Playfair Display', serif;
                          font-size: 48px;
                          font-weight: 600;
                          color: #D4AF37; /* Metallic Gold */
                          letter-spacing: 12px;
                          text-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
                          display: block;
                        ">${otp}</span>
                      </td>
                    </tr>
                  </table>

                  <p style="margin: 40px 0 0 0; color: #64748b; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">
                    Use this code to unlock your personalized vault.
                  </p>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td align="center" style="padding: 30px; background-color: #080808; border-top: 1px solid #1a1a1a;">
                  <p style="margin: 0; font-family: 'Playfair Display', serif; color: #475569; font-size: 12px;">
                    AWIK SPECTRUM &bull; Authentic Luxury Sarees
                  </p>
                </td>
              </tr>

            </table>
            <!-- END CARD -->

          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
};
