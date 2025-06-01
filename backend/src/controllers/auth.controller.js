const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const { User, sequelize, UserDevice } = require("../models");
const logger = require("../utils/logger");
const { Op } = require("sequelize");
const { sendSMS } = require("../services/sms.service");
const {
  sendEmail,
  sendVerificationEmail,
} = require("../services/email.service");
const { validatePassword } = require("../utils/validators");
const { passwordResetEmail } = require("../templates/emails");

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
      await sendVerificationEmail(email, first_name, verificationCode);
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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    //Check if user is verified
    if (!user.verification_status) {
      return res.status(401).json({
        status: "error",
        message: "Account not verified. Please verify your account.",
        data: {
          requiresVerification: true,
          email: user.email,
        },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "24h" }
    );

    // Register device token if provided
    const { device_token, device_type } = req.body;
    if (device_token && device_type) {
      await UserDevice.findOrCreate({
        where: { device_token, user_id: user.id },
        defaults: { device_type },
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          profile_photo_url: user.profile_photo_url,
        },
      },
    });
  } catch (error) {
    logger.error("Login error:", error);
    return next(error);
  }
};

/**
 * Verify user account with verification code
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyAccount = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    //Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Check if already verified
    if (user.verification_status) {
      return res.status(400).json({
        status: "error",
        message: "Account already verified",
      });
    }

    // Validate verification code
    if (user.verification_code !== code) {
      return res.status(400).json({
        status: "error",
        message: "Invalid verification code",
      });
    }

    // Update user verification status
    await user.update({
      verification_status: true,
      verification_code: null,
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "24h" }
    );

    return res.status(200).json({
      status: "success",
      message: "Account verified successfully",
      data: {
        token,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    logger.error("Verification error:", error);
    return next(error);
  }
};

/**
 * Resend verification code
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Check if already verified
    if (user.verification_status) {
      return res.status(400).json({
        status: "error",
        message: "Account already verified",
      });
    }

    // Generate new verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Update user with new verification code
    await user.update({
      verification_code: verificationCode,
    });

    // Send verification code via SMS
    try {
      await sendSMS(
        user.mobile,
        `Your Bien Unido Citizen App verification code is: ${verificationCode}`
      );
    } catch (error) {
      logger.error("Failed to send SMS verification:", error);
    }

    // Send verification email
    try {
      await sendVerificationEmail(email, user.first_name, verificationCode);
    } catch (error) {
      logger.error("Failed to send verification email:", error);
    }

    return res.status(200).json({
      status: "success",
      message: "Verification code sent successfully",
    });
  } catch (error) {
    logger.error("Resend verification error:", error);
    return next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    //Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // For security reasons, don't reveal whether the email exists
      return res.status(200).json({
        status: "success",
        message:
          "If your email is registered, you will receive password reset instructions",
      });
    }

    //Generate reset token
    const resetToken = nanoid(32);
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    await user.update({
      reset_token: resetToken,
      reset_token_expires: resetTokenExpires,
    });

    // Send reset instructions via email
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;

      const emailSubject = "Reset Your Password - Bien Unido Citizen App";
      const plainTextContent = `Hello ${user.first_name},\n\nWe received a request to reset your password for your Bien Unido Citizen App account. Please visit the following link to reset your password:\n\n${resetUrl}\n\nIf you didn't request a password reset, you can safely ignore this email. Your password will not be changed.\n\nThis password reset link will expire in 1 hour.\n\nBest regards,\nThe Bien Unido Citizen App Team`;

      const htmlContent = passwordResetEmail({
        name: user.first_name,
        resetUrl: resetUrl,
      });
      await sendEmail(email, emailSubject, plainTextContent, htmlContent);

      logger.info(`Password reset email sent to ${email}`);
    } catch (error) {
      logger.error("Failed to send password reset email:", error);
      // Continue despite email sending failure
    }

    return res.status(200).json({
      status: "success",
      message:
        "If your email is registered, you will receive password reset instructions",
    });
  } catch (error) {
    logger.error("Forgot password error:", error);
    return next(error);
  }
};

/**
 * Reset user password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const resetPassword = async (req, res, next) => {
  try {
    const { email, token, password } = req.body;

    //Validate password
    if (!validatePassword(password)) {
      return res.status(400).json({
        status: "error",
        message: "Password does not meet security requirements",
      });
    }

    // Find user
    const user = await User.findOne({
      where: {
        email,
        reset_token: token,
        reset_token_expires: { [Op.gt]: new Date() }, // Token not expired
      },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired reset token",
      });
    }

    //Update password and clear reset token
    await user.update({
      password_hash: password, // Will be hashed by model hook
      reset_token: null,
      reset_token_expires: null,
    });

    return res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (error) {
    logger.error("Reset password error:", error);
    return next(error);
  }
};

/**
 * Get current user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const getCurrentUser = async (req, res, next) => {
  try {
    // Get user from auth middleware

    const { id } = req.user;

    // Fetch fresh user data from database
    const user = await User.findByPk(id, {
      attributes: {
        exclude: [
          "password_hash",
          "verification_code",
          "reset_token",
          "reset_token_expires",
        ],
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    logger.error("Get current user error:", error);
    return next(error);
  }
};

/**
 * Update user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { first_name, last_name, address, barangay } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    // Update user profile
    await user.update({
      first_name: first_name || user.first_name,
      last_name: last_name || user.last_name,
      address: address || user.address,
      barangay: barangay || user.barangay,
    });

    // Return updated user without sensitive data
    const updatedUser = await User.findByPk(id, {
      attributes: {
        exclude: [
          "password_hash",
          "verification_code",
          "reset_token",
          "reset_token_expires",
        ],
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    logger.error("Update profile error:", error);
    return next(error);
  }
};

/**
 * Change user password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const changePassword = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { current_password, new_password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Validate current password
    const isPasswordValid = await user.validatePassword(current_password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Current password is incorrect",
      });
    }

    // Validate new password
    if (!validatePassword(new_password)) {
      return res.status(400).json({
        status: "error",
        message: "Password does not meet security requirements",
      });
    }

    //Update password
    await user.update({
      password_hash: new_password, // Will be hashed by model hook
    });

    return res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    logger.error("Change password error:", error);
    return next(error);
  }
};

/**
 * Register device for push notifications
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const registerDevice = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { device_token, device_type } = req.body;

    //Validate input
    if (!device_token || !device_type) {
      return res.status(400).json({
        status: "error",
        message: "Device token and type are required",
      });
    }

    // Register device
    await UserDevice.findOrCreate({
      where: { device_token, user_id: id },
      defaults: { device_type },
    });

    return res.status(200).json({
      status: "success",
      message: "Device registered successfully",
    });
  } catch (error) {
    logger.error("Register device error:", error);
    return next(error);
  }
};

module.exports = {
  register,
  login,
  verifyAccount,
  resendVerification,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  updateProfile,
  changePassword,
  registerDevice,
};
