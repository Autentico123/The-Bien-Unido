const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { validateRegistration } = require("../middleware/validation.middleware");

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", validateRegistration, authController.register);

module.exports = router;
