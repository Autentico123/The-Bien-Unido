const { body, validationResult } = require("express-validator");
const logger = require("../utils/logger");

/**
 * Validation result handler middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  next();
};

/**
 * Validation rules for user registration
 */

const validateRegistration = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(/^(\+?63|0)?[0-9]{10}$/)
    .withMessage("Please provide a valid Philippine mobile number"),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 5, max: 255 })
    .withMessage("Address must be between 5 and 255 characters"),
  body("barangay").trim().notEmpty().withMessage("Barangay is required"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  validate,
];

module.exports = {
  validateRegistration,
};
