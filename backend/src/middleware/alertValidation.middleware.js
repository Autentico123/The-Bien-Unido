const { body, param, query, validationResult } = require("express-validator");
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
 * Validation rules for creating an alert
 */
const validateCreateAlert = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Alert title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("body").trim().notEmpty().withMessage("Alert body is required"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Alert category is required")
    .isIn([
      "emergency",
      "weather",
      "event",
      "announcement",
      "health",
      "traffic",
    ])
    .withMessage("Invalid alert category"),

  body("importance")
    .optional()
    .trim()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Invalid importance value"),

  body("barangay")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Barangay must be less than 50 characters"),

  body("start_date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Start date must be a valid date"),

  body("end_date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      if (
        value &&
        req.body.start_date &&
        new Date(value) < new Date(req.body.start_date)
      ) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("Is active must be a boolean value")
    .toBoolean(),

  validate,
];

/**
 * Validation rules for updating an alert
 */
const validateUpdateAlert = [
  param("id").isInt().withMessage("Invalid alert ID"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("body").optional().trim(),

  body("category")
    .optional()
    .trim()
    .isIn([
      "emergency",
      "weather",
      "event",
      "announcement",
      "health",
      "traffic",
    ])
    .withMessage("Invalid alert category"),

  body("importance")
    .optional()
    .trim()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Invalid importance value"),

  body("barangay")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Barangay must be less than 50 characters"),

  body("start_date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Start date must be a valid date"),

  body("end_date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      if (
        value &&
        req.body.start_date &&
        new Date(value) < new Date(req.body.start_date)
      ) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("Is active must be a boolean value")
    .toBoolean(),

  validate,
];

/**
 * Validation rules for alert filtering and pagination
 */
const validateAlertQueries = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),

  query("category")
    .optional()
    .isIn([
      "emergency",
      "weather",
      "event",
      "announcement",
      "health",
      "traffic",
    ])
    .withMessage("Invalid category filter"),

  query("importance")
    .optional()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Invalid importance filter"),

  query("is_active")
    .optional()
    .isBoolean()
    .withMessage("Is active must be a boolean value")
    .toBoolean(),

  query("sort_by")
    .optional()
    .isIn(["created_at", "start_date", "end_date", "importance", "title"])
    .withMessage("Invalid sort field"),

  query("sort_dir")
    .optional()
    .isIn(["ASC", "DESC"])
    .withMessage("Sort direction must be ASC or DESC"),

  validate,
];

module.exports = {
  validateCreateAlert,
  validateAlertQueries,
  validateUpdateAlert,
};
