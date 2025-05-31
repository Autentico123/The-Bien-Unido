const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const { User, sequelize } = require("../models");
const logger = require("../utils/logger");
const { Op } = require("sequelize");
const { sendSMS } = require("../services/sms.service");
const { sendEmail } = require("../services/email.service");
const { validatePassword } = require("../utils/validators");

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const register = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      mobile,
      address,
      barangay,
      password,
    } = req.body;

    // Check if user already exists with the same email or mobile
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { mobile }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "Email or mobile number already registered",
      });
    }

    //Validate password
    if (!validatePassword(password)) {
      return res.status(400).json({
        status: "error",
        message: "Password does not meet security requirements",
      });
    }

    // Generate verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Create new user
    const user = await User.create({
      first_name,
      last_name,
      email,
      mobile,
      address,
      barangay,
      password_hash: password, // This will be hashed by the model hook
      verification_code: verificationCode,
    });

    // Send verification code via SMS
    try {
      await sendSMS(
        mobile,
        `Your Bien Unido Citizen App verification code is: ${verificationCode}`
      );
    } catch (error) {
      logger.error("Failed to send SMS verification:", error);
      // Continue with registration even if SMS fails
    }

    //Send welcome email
    try {
      await sendEmail(
        email,
        "Welcome to Bien Unido Citizen App",
        `Welcome ${first_name}! Please verify your account using the code: ${verificationCode}`
      );
    } catch (error) {
      logger.error("Failed to send welcome email:", error);
      // Continue with registration even if email fails
    }

    // Return success without sensitive data
    return res.status(201).json({
      status: "success",
      message: "Registration successful. Please verify your account.",
      data: {
        id: user.id,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error) {
    logger.error("Registration error:", error);
    return next(error);
  }
};

module.exports = {
  register,
};
