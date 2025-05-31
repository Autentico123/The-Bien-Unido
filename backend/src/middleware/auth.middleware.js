const jwt = require("jsonwebtoken");
const { User } = require("../models");
const logger = require("../utils/logger");

/**
 * Authenticate JWT token middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. No to token provided",
      });
    }

    //Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. Invalid token format",
      });
    }

    try {
      //Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Find User
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Invalid token. User not found.",
        });
      }

      // Attach user to request object
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        verification_status: user.verification_status,
      };

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "error",
          message: "Token expired.",
        });
      }

      return res.status(401).json({
        status: "error",
        message: "Invalid token.",
      });
    }
  } catch (error) {
    logger.error("Authentication middleware error:", error);
    return next(error);
  }
};

/**
 * Check if user is verified
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isVerified = (req, res, next) => {
  if (!req.user.verification_status) {
    return res.status(403).json({
      status: "error",
      message: "Access denied. Account not verified",
    });
  }
  next();
};

/**
 * Check if user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Access denied. Admin privileges required.",
    });
  }
};

/**
 * Check if user has official role or admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const isOfficial = (req, res, next) => {
  if (!req.user.role !== "official" && req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "Access denied. Official privileges required.",
    });
  }
  next();
};

module.exports = {
  authenticate,
  isVerified,
  isAdmin,
  isOfficial,
};
