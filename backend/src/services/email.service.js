const nodemailer = require("nodemailer");
const logger = require("../utils/logger");
const emailTemplates = require("../templates/emails");

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === "465", // true if port is 465, false otherwise
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text email body
 * @param {string} html - Optional HTML email body
 * @returns {Promise} - Resolves with info object on success
 */
const sendEmail = async (to, subject, text, html = null) => {
  try {
    // Skip sending emails in test environment
    if (process.env.NODE_ENV === "test") {
      logger.info("Skipping email in test environment: ", { to, subject });
      return true;
    }

    const mailOptions = {
      from: {
        name: "Bien Unido Citizen App",
        address: process.env.SMTP_USER,
      },
      to,
      subject,
      text,
      html: html || undefined,
      headers: {
        "X-Priority": "1", // Highest priority
        "X-MSMail-Priority": "High",
        Importance: "High",
      },
    };

    // Verify connection configuration
    try {
      await transporter.verify();
    } catch (verifyError) {
      logger.error("SMTP connection verification failed:", verifyError);
      throw new Error("Failed to connect to email server");
    }

    const info = await transporter.sendMail(mailOptions);
    logger.info("Email sent", info.messageId);
    return info;
  } catch (error) {
    logger.error("Email send error: ", error);
    throw error;
  }
};

/**
 * Send verification email
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} verificationCode - Verification code
 * @returns {Promise} - Resolves with info object on success
 */
const sendVerificationEmail = async (to, name, verificationCode) => {
  const subject = "Verify Your Email - Bien Unido Citizen App";
  const text = `Hello ${name || "there"},\n\nThank you for registering with the Bien Unido Citizen App. To complete your registration, please use this verification code: ${verificationCode}\n\nThis code will expire in 15 minutes. If you did not request this verification, please ignore this email.\n\nBest regards,\nThe Bien Unido Citizen App Team`;
  const html = emailTemplates.verificationEmail({ name, verificationCode });

  return sendEmail(to, subject, text, html);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
};
