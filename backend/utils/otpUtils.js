const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/User");

/**
 * Generate a 6-digit OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Create a nodemailer transporter for Google Workspace
 * @returns {object} Nodemailer transporter
 */
const createTransporter = () => {
  const config = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // App password, not regular Gmail password
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true, // Enable debug output
  };
  
  console.log("Creating email transporter with config:", {
    ...config,
    auth: {
      user: config.auth.user,
      passProvided: !!config.auth.pass,
      passLength: config.auth.pass ? config.auth.pass.length : 0
    }
  });
  
  return nodemailer.createTransport(config);
};

/**
 * Send OTP via email using Google Workspace
 * @param {string} email - Recipient email
 * @param {string} otp - OTP to send
 * @returns {Promise} Email sending result
 */
const sendOTPByEmail = async (email, otp) => {
  try {
    console.log("Attempting to send OTP email to:", email);
    console.log("OTP value being sent:", otp);
    const transporter = createTransporter();

    // Verify SMTP connection configuration
    try {
      console.log("Verifying SMTP connection...");
      const verifyResult = await transporter.verify();
      console.log("SMTP connection verified:", verifyResult);
    } catch (verifyError) {
      console.error("SMTP connection verification failed:", verifyError);
      console.error("Error details:", JSON.stringify(verifyError, null, 2));
      // Continue anyway to see the specific sending error
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Your OTP for Com Financial Services Authentication",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your One-Time Password</h2>
          <p>Use the following OTP to complete your authentication:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
        </div>
      `,
    };

    console.log("Sending email with options:", {
      to: email,
      from: process.env.GMAIL_USER,
      subject: mailOptions.subject,
      htmlLength: mailOptions.html.length,
      contentPreview: mailOptions.html.substring(0, 50) + '...'
    });

    console.log("Sending email now...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    console.log("Email response:", info.response);
    console.log("Message ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error).reduce((acc, key) => {
      acc[key] = error[key];
      return acc;
    }, {}), 2));
    console.error("Email configuration:", {
      user: process.env.GMAIL_USER,
      passProvided: !!process.env.GMAIL_APP_PASSWORD,
      passLength: process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.length : 0
    });
    if (error.code === "EAUTH") {
      console.error(
        "Authentication error - likely need an App Password for Gmail"
      );
      console.error(
        "See: https://support.google.com/mail/?p=InvalidSecondFactor"
      );
    }
    throw new Error("Failed to send OTP email");
  }
};

/**
 * Generate and save OTP for a user
 * @param {string} email - User email
 * @returns {Promise<string>} Generated OTP
 */
const generateAndSaveOTP = async (email) => {
  try {
    // Generate OTP
    const otp = generateOTP();

    // Set expiry time (10 minutes from now)
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    // Save OTP to user record
    await User.findOneAndUpdate({ email }, { otp, otpExpiry }, { new: true });

    // Send OTP via email
    try {
      await sendOTPByEmail(email, otp);
      console.log(`OTP sent successfully to ${email}`);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // Continue execution even if email fails
      // This allows the OTP to be saved in the database even if email sending fails
    }

    return otp;
  } catch (error) {
    console.error("Error generating OTP:", error);
    throw new Error("Failed to generate OTP");
  }
};

/**
 * Verify OTP for a user
 * @param {string} email - User email
 * @param {string} otp - OTP to verify
 * @returns {Promise<boolean>} Verification result
 */
const verifyOTP = async (email, otp) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return false;
    }

    // Check if OTP matches and is not expired
    if (user.otp === otp && user.otpExpiry > new Date()) {
      // Clear OTP after successful verification
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      return true;
    }

    return false;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw new Error("Failed to verify OTP");
  }
};

module.exports = {
  generateOTP,
  sendOTPByEmail,
  generateAndSaveOTP,
  verifyOTP,
};
