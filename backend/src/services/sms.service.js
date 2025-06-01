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

    //Check if we're in development mode
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

    logger.info("SMS sent successfully:", {
      sid: smsMessage.sid,
      to: formattedNumber,
    });
    return smsMessage;
  } catch (error) {
    logger.error("SMS send error:", {
      error: error.message,
      code: error.code,
      to: to,
      twilioError: error.moreInfo || "No additional info",
    });

    // Check for common Twilio errors
    if (error.code === 21608) {
      throw new Error(
        "Unverified recipient number. In trial mode, you can only send to verified numbers."
      );
    } else if (error.code === 21211) {
      throw new Error("Invalid phone number format.");
    } else if (error.code === 21612) {
      throw new Error(
        "Twilio account is not permitted to send SMS to this region."
      );
    } else {
      throw error;
    }
  }
};

module.exports = {
  sendSMS,
};
