const express = require("express");
const router = express.Router();
const alertController = require("../controllers/alert.controller");
const authMiddleware = require("../middleware/auth.middleware");
const alertValidation = require("../middleware/alertValidation.middleware");
const uploadMiddleware = require("../middleware/upload.middleware");

/**
 * @route GET /api/alerts
 * @desc Get all alerts with optional filtering
 * @access Private
 */
router.get(
  "/",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  alertValidation.validateAlertQueries,
  alertController.getAllAlerts
);

/**
 * @route GET /api/alerts/unread-count
 * @desc Get count of unread alerts for the current user
 * @access Private
 */
router.get(
  "/unread-count",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  alertController.getUnreadCount
);

/**
 * @route GET /api/alerts/:id
 * @desc Get a single alert by ID
 * @access Private
 */
router.get(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  alertController.getAlertById
);

/**
 * @route GET /api/alerts/:id/stats
 * @desc Get read statistics for an alert (admin/officials only)
 * @access Private - Admin/Official only
 */
router.get(
  "/:id/stats",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  authMiddleware.isOfficial,
  alertController.getAlertReadStats
);

/**
 * @route POST /api/alerts
 * @desc Create a new alert
 * @access Private - Admin/Official only
 */
router.post(
  "/",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  authMiddleware.isOfficial,
  uploadMiddleware.single("image"),
  alertValidation.validateCreateAlert,
  alertController.createAlert
);

/**
 * @route PUT /api/alerts/:id
 * @desc Update an alert
 * @access Private - Admin/Official only
 */
router.put(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  authMiddleware.isOfficial,
  uploadMiddleware.single("image"),
  alertValidation.validateUpdateAlert,
  alertController.updateAlert
);

/**
 * @route DELETE /api/alerts/:id
 * @desc Delete an alert
 * @access Private - Admin/Official only
 */
router.delete(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  authMiddleware.isOfficial,
  alertController.deleteAlert
);

/**
 * @route POST /api/alerts/:id/read
 * @desc Mark an alert as read for the current user
 * @access Private
 */
router.post(
  "/:id/read",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  alertController.markAlertAsRead
);

module.exports = router;
