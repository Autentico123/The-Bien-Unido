const logger = require("../utils/logger");
const { ValidationError } = require("sequelize");

/**
 * Global error handling middleware
 */
module.exports = (error, req, res, next) => {
  // Log error for debugging
  logger.error(`${error.name}: ${error.message}`, {
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Handle Sequelize validation errors
  if (error instanceof ValidationError) {
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      errors: error.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }

  // Default error response
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    status: "error",
    message: statusCode === 500 ? "Internal server error" : error.message,
  });
};
