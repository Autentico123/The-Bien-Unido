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
 * Validation rules for creating a report
 */
const validateCreateReport = [
  body("type")
    .trim()
    .notEmpty()
    .withMessage("Report type is required")
    .isIn([
      "garbage",
      "road_damage",
      "flooding",
      "electricity",
      "water_supply",
      "public_safety",
      "others",
    ])
    .withMessage("Invalid report type"),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Report title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Report description is required"),

  body("location_address")
    .trim()
    .notEmpty()
    .withMessage("Location address is required"),

  body("location_lat")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  body("location_lng")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),

  body("barangay").trim().notEmpty().withMessage("Barangay is required"),

  validate,
];

/**
 * Validation rules for updating a report status
 */
const validateUpdateStatus = [
  param("id").isInt().withMessage("Invalid report ID"),
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      "pending",
      "assigned",
      "in_progress",
      "resolved",
      "closed",
      "rejected",
    ])
    .withMessage("Invalid status value"),

  body("assigned_to")
    .optional()
    .isInt()
    .withMessage("Invalid user ID for assignment")
    .toInt(),

  body("notes").optional().trim(),

  validate,
];

/**
 * Validation rules for report filtering and pagination
 */
const validateReportQueries = [
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

  query("status")
    .optional()
    .isIn([
      "pending",
      "assigned",
      "in_progress",
      "resolved",
      "closed",
      "rejected",
    ])
    .withMessage("Invalid status filter"),

  query("type")
    .optional()
    .isIn([
      "garbage",
      "road_damage",
      "flooding",
      "electricity",
      "water_supply",
      "public_safety",
      "others",
    ])
    .withMessage("Invalid type filter"),

  query("priority")
    .optional()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Invalid priority filter"),

  query("sort_by")
    .optional()
    .isIn(["created_at", "updated_at", "title", "status", "priority"])
    .withMessage("Invalid sort field"),

  query("sort_dir")
    .optional()
    .isIn(["ASC", "DESC"])
    .withMessage("Sort direction must be ASC or DESC"),

  validate,
];

/**
 * Validation rules for updating report details
 */

const validateUpdateReport = [
  param("id").isInt().withMessage("Invalid report ID"),

  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),

  body("description").optional().trim(),

  body("type")
    .optional()
    .trim()
    .isIn([
      "garbage",
      "road_damage",
      "flooding",
      "electricity",
      "water_supply",
      "public_safety",
      "others",
    ])
    .withMessage("Invalid report type"),

  body("priority")
    .optional()
    .trim()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Invalid priority value"),

  body("location_address").optional().trim(),

  body("location_lat")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),

  body("location_lng")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),

  body("barangay").optional().trim(),

  validate,
];

/**
 * Validation rules for adding a comment to a report
 */
const validateAddComment = [
  param("id").isInt().withMessage("Invalid report ID"),
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment text is required")
    .isLength({ max: 1000 })
    .withMessage("Comment must be less than 1000 characters"),

  validate,
];

module.exports = {
  validateCreateReport,
  validateReportQueries,
  validateUpdateStatus,
  validateUpdateReport,
  validateAddComment,
};
