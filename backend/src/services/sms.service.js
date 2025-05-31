const twilio = require("twilio");
const logger = require("../utils/logger");

// Initialize Twilio client
const client =
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

/**
 * Send SMS message using Twilio
 * @param {string} to - Recipient phone number (format: +639XXXXXXXXX)
 * @param {string} message - SMS content
 * @returns {Promise} - Resolves with message data on success
 */

const sendSMS = async (to, message) => {
  try {
    // Skip sending SMS in test environment
    if (process.env.NODE_ENV === "test") {
      logger.info("Skipping SMS in test environment:", { to, message });
      return true;
    }

    //check if Twilio is configured
    if (!client) {
      logger.warn("Twilio client not configured. SMS not send.");
      throw new Error("SMS service not configured");
    }

    //Format phone number to E.164 if needed
    let formattedNumber = to;
    if (to.startsWith("0")) {
      formattedNumber = `+63${to.substring(1)}`;
    }
    // Handle numbers without any prefix
    else if (!to.startsWith("+")) {
      formattedNumber = `+${to}`;
    }

    // Check if we're in development mode
    if (process.env.NODE_ENV === "development") {
      logger.info("Development mode: Would send SMS to:", {
        to: formattedNumber,
        message,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
      return true; // Skip actual sending in development
    }

    //Send SMS
    const smsMessage = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber,
    });

    logger.info("SMS sent:", smsMessage.sid);
  } catch (error) {
    logger.error("SMS send error", error);
    throw error;
  }
};

module.exports = {
  sendSMS,
};
