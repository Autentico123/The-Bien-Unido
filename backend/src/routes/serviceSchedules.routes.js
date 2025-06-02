const express = require("express");
const router = express.Router();
const serviceScheduleController = require("../controllers/serviceSchedule.controller");
const authMiddleware = require("../middleware/auth.middleware");
const serviceScheduleValidation = require("../middleware/serviceScheduleValidation.middleware");

/**
 * @route GET /api/schedules
 * @desc Get all service schedules with optional filtering
 * @access Private
 */
router.get(
  "/",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  serviceScheduleValidation.validateScheduleQueries,
  serviceScheduleController.getAllServiceSchedules
);

/**
 * @route GET /api/schedules/barangay/:barangay
 * @desc Get service schedules by barangay
 * @access Private
 */
router.get(
  "/barangay/:barangay",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  serviceScheduleController.getSchedulesByBarangay
);

/**
 * @route GET /api/schedules/upcoming
 * @desc Get upcoming service schedules
 * @access Private
 */
router.get(
  "/upcoming",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  serviceScheduleValidation.validateScheduleQueries,
  serviceScheduleController.getUpcomingSchedules
);

/**
 * @route GET /api/schedules/service/:type
 * @desc Get schedules by service type
 * @access Private
 */
router.get(
  "/service/:type",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  serviceScheduleController.getSchedulesByServiceType
);

/**
 * @route POST /api/schedules
 * @desc Create a new service schedule
 * @access Private - Admin/Official only
 */
router.post(
  "/",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  authMiddleware.isOfficial,
  serviceScheduleValidation.validateCreateServiceSchedule,
  serviceScheduleController.createServiceSchedule
);

/**
 * @route PUT /api/schedules/:id
 * @desc Update a service schedule
 * @access Private - Admin/Official only
 */
router.put(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  authMiddleware.isOfficial,
  serviceScheduleValidation.validateUpdateServiceSchedule,
  serviceScheduleController.updateServiceSchedule
);

/**
 * @route DELETE /api/schedules/:id
 * @desc Delete a service schedule
 * @access Private - Admin/Official only
 */
router.delete(
  "/:id",
  authMiddleware.authenticate,
  authMiddleware.isVerified,
  authMiddleware.isOfficial,
  serviceScheduleController.deleteServiceSchedule
);

module.exports = router;
