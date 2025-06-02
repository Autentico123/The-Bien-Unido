const { where } = require("sequelize");
const { Alert, AlertRead, User, sequelize, Op } = require("../models");
const { uploadImage } = require("../services/cloudinary.service");

/**
 * Create a new alert
 * @param {Object} req - Express request object
 * @param {Object} res - Expr,ess response object
 * @param {Function} next - Express next middleware function
 */
const createAlert = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      title,
      body,
      category,
      importance,
      barangay,
      start_date,
      end_date,
      is_active = true,
    } = req.body;

    // Only admin and officials can create alerts
    if (req.user.role === "citizen") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only officials can create alerts.",
      });
    }

    // Handle image upload if present
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file.path);
    }

    // Create new alert
    const alert = await Alert.create(
      {
        title,
        body,
        category,
        importance,
        barangay: barangay || "ALL",
        image_url: imageUrl,
        start_date: start_date || new Date(),
        end_date,
        is_active,
        created_by: req.user.id,
      },
      { transaction }
    );

    await transaction.commit();

    // Fetch the created alert with creator info
    const createdAlert = await Alert.findByPk(alert.id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "first_name", "last_name", "role"],
        },
      ],
    });

    return res.status(201).json({
      status: "success",
      message: "Alert created successfully",
      data: {
        alert: createdAlert,
      },
    });
  } catch (error) {
    await transaction.rollback();
    logger.error("Create alert error:", error);
    return next(error);
  }
};

/**
 * Get all alerts with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const getAllAlerts = async (req, res, next) => {
  try {
    const {
      category,
      importance,
      barangay,
      is_active,
      page = 1,
      limit = 10,
      sort_by = "created_at",
      sort_dir = "DESC",
      search,
    } = req.query;

    // Build filter conditions
    const whereConditions = {};

    if (category) {
      whereConditions.category = category;
    }

    if (importance) {
      whereConditions.importance = importance;
    }

    if (barangay) {
      whereConditions.barangay = barangay;
    }

    // Filter by active status if specified
    if (is_active !== undefined) {
      whereConditions.is_active = is_active === "true";
    }

    // Show only active alerts by default for citizens
    if (req.user.role === "citizen" && is_active === undefined) {
      whereConditions.is_active = true;
    }

    // Filter by relevance to user's barangay for citizens
    if (req.user.role === "citizen" && !barangay) {
      whereConditions[Op.or] = [
        { barangay: req.user.barangay },
        { barangay: "ALL" },
      ];
    }

    // Search implementation
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { body: { [Op.like]: `%${search}%` } },
      ];
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Validate sort_by field to prevent SQL injection
    const validSortFields = [
      "created_at",
      "start_date",
      "end_date",
      "importance",
      "title",
    ];
    const sortField = validSortFields.includes(sort_by)
      ? sort_by
      : "created_at";

    // Validate sort direction
    const sortDirection = sort_dir === "ASC" ? "ASC" : "DESC";

    // Fetch alerts with pagination
    const { count, rows: alerts } = await Alert.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "first_name", "last_name", "role"],
        },
      ],
      order: [[sortField, sortDirection]],
      limit,
      offset,
      distinct: true,
    });

    // Get read status for each alert if user is a citizen
    if (req.user.role === "citizen") {
      const userId = req.user.id;

      const alertIds = alerts.map((alert) => alert.id);

      // Get read status for all alerts in one query
      const readAlerts = await AlertRead.findAll({
        where: {
          alert_id: { [Op.in]: alertIds },
          user_id: userId,
        },
        attributes: ["alert_id", "read_at"],
      });

      // Create a map for quick lookups
      const readAlertsMap = {};
      readAlerts.forEach((read) => {
        readAlertsMap[read.alert_id] = read.read_at;
      });

      // Add the read status to each alert
      alerts.forEach((alert) => {
        const plainAlert = alert.get({ plain: true });
        plainAlert.is_read = readAlertsMap[alert.id] ? true : false;
        plainAlert.read_at = readAlertsMap[alert.id] || null;
        return plainAlert;
      });
    }

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      status: "success",
      message: "Alerts retrieved successfully",
      data: {
        alerts,
        pagination: {
          total: count,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total_pages: totalPages,
        },
      },
    });
  } catch (error) {
    logger.error("Get all alerts error:", error);
    return next(error);
  }
};

/**
 * Get a single alert by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const getAlertById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find alert with creator info
    const alert = await Alert.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "first_name", "last_name", "role"],
        },
      ],
    });

    if (!alert) {
      return res.status(404).json({
        status: "error",
        message: "Alert not found",
      });
    }

    // For citizens, only return active alerts
    if (req.user.role === "citizen" && !alert.is_active) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. This alert is no longer active.",
      });
    }

    // Mark alert as read if user is a citizen
    if (req.user.role === "citizen") {
      // Check if already read
      const existing = await AlertRead.findOne({
        where: {
          alert_id: id,
          user_id: req.user.id,
        },
      });

      // If not already read, mark as read
      if (!existing) {
        await AlertRead.create({
          alert_id: id,
          user_id: req.user.id,
          read_at: new Date(),
        });
      }

      // Add read status to response
      alert.dataValues.is_read = true;
      alert.dataValues.read_at = existing ? existing.read_at : new Date();
    }

    // Get read count statistics (admin/official only)
    if (req.user.role !== "citizen") {
      const readCount = await AlertRead.count({
        where: { alert_id: id },
      });

      alert.dataValues.read_count = readCount;
    }

    return res.status(200).json({
      status: "success",
      message: "Alert retrieved successfully",
      data: {
        alert,
      },
    });
  } catch (error) {
    logger.error(`Get alert by ID error: ${error.message}`, {
      id: req.params.id,
    });
    return next(error);
  }
};

/**
 * Update an alert
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const updateAlert = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const {
      title,
      body,
      category,
      importance,
      barangay,
      start_date,
      end_date,
      is_active,
    } = req.body;

    // Check if alert exists
    const alert = await Alert.findByPk(id);
    if (!alert) {
      return res.status(404).json({
        status: "error",
        message: "Alert not found",
      });
    }

    // Only admin and officials can update alerts
    if (req.user.role === "citizen") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only officials can update alerts.",
      });
    }

    // Handle image upload if present
    let imageUrl = alert.image_url;
    if (req.file) {
      imageUrl = await uploadImage(req.file.path);
    }

    // Update alert
    await alert.update(
      {
        title: title || alert.title,
        body: body || alert.body,
        category: category || alert.category,
        importance: importance || alert.importance,
        barangay: barangay || alert.barangay,
        image_url: imageUrl,
        start_date: start_date || alert.start_date,
        end_date: end_date !== undefined ? end_date : alert.end_date,
        is_active: is_active !== undefined ? is_active : alert.is_active,
      },
      { transaction }
    );

    await transaction.commit();

    // Fetch updated alert with creator info
    const updatedAlert = await Alert.findByPk(id, {
      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "first_name", "last_name", "role"],
        },
      ],
    });

    return res.status(200).json({
      status: "success",
      message: "Alert updated successfully",
      data: {
        alert: updatedAlert,
      },
    });
  } catch (error) {
    await transaction.rollback();
    logger.error("Update alert error:", error);
    return next(error);
  }
};

/**
 * Delete an alert
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteAlert = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    // Check if alert exists
    const alert = await Alert.findByPk(id);
    if (!alert) {
      return res.status(404).json({
        status: "error",
        message: "Alert not found",
      });
    }

    // Only admin and officials can delete alerts
    if (req.user.role === "citizen") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only officials can delete alerts.",
      });
    }

    // Delete the alert
    await alert.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({
      status: "success",
      message: "Alert deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    logger.error("Delete alert error:", error);
    return next(error);
  }
};

/**
 * Mark an alert as read for the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const markAlertAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if alert exists
    const alert = await Alert.findByPk(id);
    if (!alert) {
      return res.status(404).json({
        status: "error",
        message: "Alert not found",
      });
    }

    // Check if already read
    const [read, created] = await AlertRead.findOrCreate({
      where: {
        alert_id: id,
        user_id: req.user.id,
      },
      defaults: {
        read_at: new Date(),
      },
    });

    if (!created) {
      // Already marked as read
      return res.status(200).json({
        status: "success",
        message: "Alert was already marked as read",
        data: {
          read_at: read.read_at,
        },
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Alert marked as read successfully",
      data: {
        read_at: read.read_at,
      },
    });
  } catch (error) {
    logger.error("Mark alert as read error:", error);
    return next(error);
  }
};

/**
 * Get read status statistics for an alert
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getAlertReadStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if alert exists
    const alert = await Alert.findByPk(id);
    if (!alert) {
      return res.status(404).json({
        status: "error",
        message: "Alert not found",
      });
    }

    // Only admin and officials can view read statistics
    if (req.user.role === "citizen") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only officials can view read statistics.",
      });
    }

    // Get read count
    const readCount = await AlertRead.count({
      where: { alert_id: id },
    });

    // Get total user count (excluding admin/official users)
    const userCount = await User.count({
      where: {
        role: "citizen",
        verification_status: true,
      },
    });

    // Get list of users who have read the alert
    const readUsers = await AlertRead.findAll({
      where: { alert_id: id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "first_name", "last_name", "barangay"],
        },
      ],
      order: [["read_at", "DESC"]],
      limit: 100, // Limit to recent 100 reads
    });

    return res.status(200).json({
      status: "success",
      message: "Alert read statistics retrieved successfully",
      data: {
        total_users: userCount,
        read_count: readCount,
        read_percentage: userCount > 0 ? (readCount / userCount) * 100 : 0,
        reads: readUsers,
      },
    });
  } catch (error) {
    logger.error("Get alert read stats error:", error);
    return next(error);
  }
};

/**
 * Get unread alert count for the current user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getUnreadCount = async (req, res, next) => {
  try {
    // Get active alerts relevant to the user
    const whereConditions = {
      is_active: true,
    };

    // Filter by relevance to user's barangay for citizens
    if (req.user.role === "citizen") {
      whereConditions[Op.or] = [
        { barangay: req.user.barangay },
        { barangay: "ALL" },
      ];
    }

    // Get all relevant alert IDs
    const alerts = await Alert.findAll({
      where: whereConditions,
      attributes: ["id"],
    });

    const alertIds = alerts.map((alert) => alert.id);

    if (alertIds.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "No alerts found",
        data: {
          unread_count: 0,
        },
      });
    }

    // Find alerts that the user has already read
    const readAlerts = await AlertRead.findAll({
      where: {
        alert_id: { [Op.in]: alertIds },
        user_id: req.user.id,
      },
      attributes: ["alert_id"],
    });

    const readAlertIds = readAlerts.map((read) => read.alert_id);

    // Calculate unread count
    const unreadCount = alertIds.length - readAlertIds.length;

    return res.status(200).json({
      status: "success",
      message: "Unread alert count retrieved successfully",
      data: {
        unread_count: unreadCount,
      },
    });
  } catch (error) {
    logger.error("Get unread count error:", error);
    return next(error);
  }
};

module.exports = {
  createAlert,
  getAllAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
  markAlertAsRead,
  getAlertReadStats,
  getUnreadCount,
};
