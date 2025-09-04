const express = require('express');
const router = express.Router();
const User = require('../models/User');
const PasswordResetToken = require('../models/PasswordResetToken');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configure email transporter
// In a production environment, you would use a real email service
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // For development, enable debugging
  debug: process.env.NODE_ENV === 'development',
  logger: process.env.NODE_ENV === 'development',
  // TLS configuration
  secure: false,
  requireTLS: true,
  tls: {
    rejectUnauthorized: false // Allow self-signed certificates in development
  }
});

// Password reset tokens are now stored in the database using PasswordResetToken model

/**
 * @route   POST /request-password-reset
 * @desc    Request a password reset link
 * @access  Public
 */
router.post('/request-password-reset', [
  check('email', 'Please include a valid email').isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and return early if not
    if (!user) {
      return res.status(200).json({ message: 'If your email is registered, you will receive password reset instructions shortly' });
    }

    // Clean up any existing tokens for this user
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Store the token in the database
    const passwordResetToken = new PasswordResetToken({
      userId: user._id,
      token: resetToken,
    });
    await passwordResetToken.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Password Reset Instructions',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
              }
              .header {
                text-align: center;
                padding: 20px 0;
                border-bottom: 1px solid #eaeaea;
              }
              .logo {
                max-width: 150px;
                height: auto;
              }
              .content {
                padding: 30px 20px;
              }
              .button {
                display: inline-block;
                background-color: #4F46E5;
                color: white !important;
                text-decoration: none;
                padding: 12px 30px;
                margin: 20px 0;
                border-radius: 4px;
                font-weight: bold;
                text-align: center;
                transition: background-color 0.3s;
              }
              .button:hover {
                background-color: #4338CA;
              }
              .footer {
                text-align: center;
                padding-top: 20px;
                color: #718096;
                font-size: 0.9em;
                border-top: 1px solid #eaeaea;
              }
              .highlight {
                color: #4F46E5;
                font-weight: bold;
              }
              .warning {
                background-color: #FEF3C7;
                border-left: 4px solid #F59E0B;
                padding: 10px 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="color: #4F46E5;">Com Financial Services</h2>
              </div>
              <div class="content">
                <h2>Password Reset Request</h2>
                <p>Hello,</p>
                <p>We received a request to reset the password for your <span class="highlight">Com Financial Services</span> account. To complete the process, please click the button below:</p>
                
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset My Password</a>
                </div>
                
                <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
                <p style="word-break: break-all; font-size: 0.9em; background-color: #f1f5f9; padding: 10px; border-radius: 4px;">${resetUrl}</p>
                
                <div class="warning">
                  <p style="margin: 0;"><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
                </div>
                
                <p>If you didn't request a password reset, please ignore this email or contact our support team if you have concerns about your account security.</p>
                
                <p>Thank you,<br>The Com Financial Services Team</p>
              </div>
              <div class="footer">
                <p>&copy; 2023 Com Financial Services. All rights reserved.</p>
                <p>This is an automated message, please do not reply to this email.</p>
              </div>
            </div>
          </body>
          </html>
        `
      });
      console.log('Password reset email sent to:', user.email);
    } catch (emailError) {
      // Log the error but don't fail the request
      console.error('Failed to send password reset email:', emailError);
      // In development, log the reset URL for testing
      console.log('Development reset URL:', resetUrl);
    }

    res.status(200).json({ message: 'If your email is registered, you will receive password reset instructions shortly' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', [
  check('token', 'Reset token is required').not().isEmpty(),
  check('password', 'Password is required with 6 or more characters').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { token, password } = req.body;

    // Find and validate the reset token
    const resetTokenDoc = await PasswordResetToken.findOne({ token }).populate('userId');
    if (!resetTokenDoc || !resetTokenDoc.isValid()) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Get the user from the token
    const user = resetTokenDoc.userId;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set the new password (will be hashed by the pre-save middleware)
    user.password = password;

    // Save user with new password
    await user.save();

    // Mark token as used and remove it
    await PasswordResetToken.findByIdAndDelete(resetTokenDoc._id);

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;