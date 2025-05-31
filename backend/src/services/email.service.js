const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

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
      from: `Bien Unido App <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: html || undefined,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info("Email sent", info.messageId);
    return info;
  } catch (error) {
    logger.error("Email send error: ", error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};
