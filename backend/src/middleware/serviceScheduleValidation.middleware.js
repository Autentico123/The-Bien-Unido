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
 * Validation rules for creating a service schedule
 */
const validateCreateServiceSchedule = [
  body("service_type")
    .trim()
    .notEmpty()
    .withMessage("Service type is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Service type must be between 2 and 100 characters"),

  body("day_of_week")
    .trim()
    .notEmpty()
    .withMessage("Day of week is required")
    .isIn([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
    .withMessage("Invalid day of week"),

  body("start_time")
    .trim()
    .notEmpty()
    .withMessage("Start time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .withMessage("Start time must be in the format HH:MM:SS"),

  body("end_time")
    .trim()
    .notEmpty()
    .withMessage("End time is required")
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .withMessage("End time must be in the format HH:MM:SS"),

  body("barangay")
    .trim()
    .notEmpty()
    .withMessage("Barangay is required")
    .isLength({ max: 50 })
    .withMessage("Barangay must be less than 50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),

  body("recurring")
    .optional()
    .isBoolean()
    .withMessage("Recurring must be a boolean value")
    .toBoolean(),

  body("next_date")
    .optional()
    .isDate()
    .withMessage("Next date must be a valid date")
    .custom((value, { req }) => {
      if (req.body.recurring === false && !value) {
        throw new Error("Next date is required for non-recurring schedules");
      }
      if (value) {
        const nextDate = new Date(value);
        const today = new Date();
        if (nextDate < today) {
          throw new Error("Next date must be in the future");
        }
      }
      return true;
    }),

  validate,
];

/**
 * Validation rules for filtering service schedules
 */
const validateScheduleQueries = [
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

  query("sort_by")
    .optional()
    .isIn([
      "day_of_week",
      "service_type",
      "barangay",
      "start_time",
      "next_date",
    ])
    .withMessage("Invalid sort field"),

  query("sort_dir")
    .optional()
    .isIn(["ASC", "DESC"])
    .withMessage("Sort direction must be ASC or DESC"),

  query("days")
    .optional()
    .isInt({ min: 1, max: 31 })
    .withMessage("Days must be between 1 and 31")
    .toInt(),

  validate,
];

/**
 * Validation rules for updating a service schedule
 */
const validateUpdateServiceSchedule = [
  param("id").isInt().withMessage("Invalid service schedule ID").toInt(),

  body("service_type")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Service type must be between 2 and 100 characters"),

  body("day_of_week")
    .optional()
    .trim()
    .isIn([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
    .withMessage("Invalid day of week"),

  body("start_time")
    .optional()
    .trim()
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .withMessage("Start time must be in the format HH:MM:SS"),

  body("end_time")
    .optional()
    .trim()
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .withMessage("End time must be in the format HH:MM:SS"),

  body("barangay")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Barangay must be less than 50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),

  body("recurring")
    .optional()
    .isBoolean()
    .withMessage("Recurring must be a boolean value")
    .toBoolean(),

  body("next_date")
    .optional()
    .isDate()
    .withMessage("Next date must be a valid date")
    .custom((value, { req }) => {
      if (req.body.recurring === false && value) {
        const nextDate = new Date(value);
        const today = new Date();
        if (nextDate < today) {
          throw new Error("Next date must be in the future");
        }
      }
      return true;
    }),

  validate,
];

module.exports = {
  validateCreateServiceSchedule,
  validateScheduleQueries,
  validateUpdateServiceSchedule,
};
