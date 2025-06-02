const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const authMiddleware = require("../middleware/auth.middleware");
const reportValidation = require("../middleware/reportValidation.middleware");
const uploadMiddleware = require("../middleware/upload.middleware");

/**
 * @route GET /api/reports
 * @desc Get all reports with optional filtering
 * @access Private
 */
router.get(
  "/",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  reportValidation.validateReportQueries,
  reportController.getAllReports
);

/**
 * @route GET /api/reports/stats
 * @desc Get report statistics
 * @access Private - Admin/Official only
 */
router.get(
  "/stats",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  reportController.getReportStats
);

/**
 * @route GET /api/reports/:id
 * @desc Get a single report by ID
 * @access Private
 */
router.get(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  reportController.getReportById
);

/**
 * @route POST /api/reports
 * @desc Create a new report
 * @access Private
 */
router.post(
  "/",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  uploadMiddleware.handleUploadErrors,
  reportValidation.validateCreateReport,
  reportController.createReport
);

/**
 * @route PUT /api/reports/:id/status
 * @desc Update report status (admin/officials only)
 * @access Private - Admin/Official only
 */
router.put(
  "/:id/status",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  reportValidation.validateUpdateStatus,
  reportController.updateReportStatus
);

/**
 * @route PUT /api/reports/:id
 * @desc Update report details
 * @access Private
 */

router.put(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  reportValidation.validateUpdateReport,
  reportController.updateReport
);

/**
 * @route DELETE /api/reports/:id
 * @desc Delete a report
 * @access Private
 */
router.delete(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  reportController.deleteReport
);

/**
 * @route POST /api/reports/:id/comments
 * @desc Add a comment to a report
 * @access Private
 */
router.post(
  "/:id/comments",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  reportValidation.validateAddComment,
  reportController.addReportComment
);
module.exports = router;
