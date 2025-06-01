const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const {
  validateRegistration,
  validateLogin,
  validateVerificationCode,
  validateEmail,
  validateResetPassword,
  validateProfileUpdate,
  validateChangePassword,
  validateDeviceRegistration,
} = require("../middleware/validation.middleware");

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", validateRegistration, authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
router.post("/login", validateLogin, authController.login);

/**
 * @route POST /api/auth/verify-account
 * @desc Verify user account with code
 * @access Public
 */
router.post(
  "/verify-account",
  validateVerificationCode,
  authController.verifyAccount
);

/**
 * @route POST /api/auth/resend-verification
 * @desc Resend verification code
 * @access Public
 */
router.post(
  "/resend-verification",
  validateEmail,
  authController.resendVerification
);

/**
 * @route POST /api/auth/forgot-password
 * @desc Request password reset
 * @access Public
 */
router.post("/forgot-password", validateEmail, authController.forgotPassword);

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post(
  "/reset-password",
  validateResetPassword,
  authController.resetPassword,
  authController.getCurrentUser
);

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */

router.get("/me", authMiddleware.authenticate, authController.getCurrentUser);

/**
 * @route PUT /api/auth/me
 * @desc Update user profile
 * @access Private
 */
router.put(
  "/me",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  validateProfileUpdate,
  authController.updateProfile
);

/**
 * @route PUT /api/auth/change-password
 * @desc Change user password
 * @access Private
 */
router.put(
  "/change-password",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  validateChangePassword,
  authController.changePassword
);

/**
 * @route POST /api/auth/register-device
 * @desc Register device for push notifications
 * @access Private
 */

router.post(
  "/register-device",
  authMiddleware.authenticate,
  validateDeviceRegistration,
  authController.registerDevice
);
module.exports = router;
