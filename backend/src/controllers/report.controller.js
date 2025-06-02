const {
  Report,
  ReportImage,
  ReportComment,
  ReportStatusHistory,
  User,
  sequelize,
  Op,
} = require("../models");
const { uploadImage } = require("../services/cloudinary.service");
const logger = require("../utils/logger");

/**
 * Get all reports with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const getAllReports = async (req, res, next) => {
  try {
    const {
      status,
      type,
      barangay,
      priority,
      page = 1,
      limit = 10,
      sort_by = "created_at",
      sort_dir = "DESC",
      search,
    } = req.query;

    //Build filter conditions
    const whereConditions = {};

    if (status) {
      whereConditions.status = status;
    }

    if (type) {
      whereConditions.type = type;
    }

    if (barangay) {
      whereConditions.barangay = barangay;
    }

    if (priority) {
      whereConditions.priority = priority;
    }

    // For admins and officials, show all reports
    // For citizens, only show their own reports
    if (req.user.role === "citizen") {
      whereConditions.user_id = req.user.id;
    }

    // Search implementation
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location_address: { [Op.like]: `%${search}%` } },
      ];
    }

    // Calculate pagination
    const offset = (page - 1) * limit;

    // Validate sort_by field to prevent SQL injection
    const validSortFields = [
      "created_at",
      "updated_at",
      "title",
      "status",
      "priority",
    ];
    const sortField = validSortFields.includes(sort_by)
      ? sort_by
      : "created_at";

    // Validate sort direction
    const sortDirection = sort_dir === "ASC" ? "ASC" : "DESC";

    // Fetch reports with pagination
    const { count, rows: reports } = await Report.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: "reporter",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: ReportImage,
          as: "images",
          attributes: ["id", "image_url"],
        },
        {
          model: User,
          as: "assignedTo",
          attributes: ["id", "first_name", "last_name", "email"],
          required: false,
        },
      ],
      order: [[sortField, sortDirection]],
      limit,
      offset,
      distinct: true,
    });

    //Calculate total pages
    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      status: "success",
      message: "Reports retrieved successfully",
      data: {
        reports,
        pagination: {
          total: count,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total_pages: totalPages,
        },
      },
    });
  } catch (error) {
    logger.error("Get all reports error:", error);
    return next(error);
  }
};

/**
 * Get a single report by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;

    //Find report with associated data
    const report = await Report.findByPk(id, {
      include: [
        {
          model: User,
          as: "reporter",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: ReportImage,
          as: "images",
          attributes: ["id", "image_url"],
        },
        {
          model: User,
          as: "assignedTo",
          attributes: ["id", "first_name", "last_name", "email"],
          required: false,
        },
        {
          model: ReportComment,
          as: "comments",
          include: {
            model: User,
            as: "user",
            attributes: ["id", "first_name", "last_name", "role"],
          },
        },
        {
          model: ReportStatusHistory,
          as: "statusHistory",
          include: {
            model: User,
            as: "user",
            attributes: ["id", "first_name", "last_name", "role"],
          },
        },
      ],
    });

    if (!report) {
      return res.status(404).json({
        status: "error",
        message: "Report not found",
      });
    }

    // For citizens, ensure they can only access their own reports
    if (req.user.role === "citizen" && report.user_id !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. You can only view your own reports.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Report retrieved successfully",
      data: {
        report,
      },
    });
  } catch (error) {
    logger.error(`Get report by ID error: ${error.message}`, {
      id: req.params.id,
    });
    return next(error);
  }
};

/**
 * Create a new report
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createReport = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      type,
      title,
      description,
      location_address,
      location_lat,
      location_lng,
      barangay,
    } = req.body;

    // Create new report
    const report = await Report.create(
      {
        user_id: req.user.id,
        type,
        title,
        description,
        location_address,
        location_lat,
        location_lng,
        barangay,
        status: "pending",
        priority: "medium", // Default priority, can be changed by admin/official
      },
      { transaction }
    );

    // Handle image uploads if present
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(async (file) => {
        // Upload to Cloudinary
        const imageUrl = await uploadImage(file.path);

        // Create image record in database
        return ReportImage.create(
          {
            report_id: report.id,
            imageUrl: imageUrl,
          },
          { transaction }
        );
      });

      await Promise.all(imagePromises);
    }

    // Create initial status history
    await ReportStatusHistory.create(
      {
        report_id: report.id,
        user_id: req.user.id,
        old_status: null, // Initial status has no "old" status
        new_status: "pending",
        notes: "Report created",
      },
      { transaction }
    );

    await transaction.commit();

    // Fetch the created report with images
    const createdReport = await Report.findByPk(report.id, {
      include: [
        {
          model: ReportImage,
          as: "images",
          attributes: ["id", "image_url"],
        },
      ],
    });

    return res.status(201).json({
      status: "success",
      message: "Report created successfully",
      data: {
        report: createdReport,
      },
    });
  } catch (error) {
    await transaction.rollback();
    logger.error("Create report error:", error);
    return next(error);
  }
};

/**
 * Update report status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateReportStatus = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { status, notes, assigned_to } = req.body;

    // Check if report exists
    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({
        status: "error",
        message: "Report not found",
      });
    }

    // Only admin and officials can update the status
    if (req.user.role === "citizen") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only officials can update report status.",
      });
    }

    //Save old status for history
    const oldStatus = report.status;
    const updateData = { status };

    // If assigned_to is provided, update it
    if (assigned_to !== undefined) {
      // Verify that the assigned user exists and is an official
      if (assigned_to) {
        const assignedUser = await User.findOne({
          where: {
            id: assigned_to,
            role: {
              [Op.in]: ["admin", "official"],
            },
          },
        });

        if (!assignedUser) {
          return res.status(400).json({
            status: "error",
            message: "Invalid assignment. User must be an admin or official.",
          });
        }
      }

      updateData.assigned_to = assigned_to;
    }

    // Add resolution notes if provided and status is 'resolved'
    if (status === "resolved" && notes) {
      updateData.resolution_notes = notes;
      updateData.resolved_at = new Date();
    }

    //Update report
    await report.update(updateData, { transaction });

    //Create status history entry
    await ReportStatusHistory.create(
      {
        report_id: id,
        user_id: req.user.id,
        old_status: oldStatus,
        new_status: status,
        notes: notes || `Status updated from ${oldStatus} to ${status}`,
      },
      { transaction }
    );

    await transaction.commit();

    // Fetch updated report with latest status history
    const updatedReport = await Report.findByPk(id, {
      include: [
        {
          model: User,
          as: "assignedTo",
          attributes: ["id", "first_name", "last_name", "email"],
          required: false,
        },
        {
          model: ReportStatusHistory,
          as: "statusHistory",
          limit: 5,
          order: [["created_at", "DESC"]],
          include: {
            model: User,
            as: "user",
            attributes: ["id", "first_name", "last_name", "role"],
          },
        },
      ],
    });

    return res.status(200).json({
      status: "success",
      message: "Report status updated successfully",
      data: {
        report: updatedReport,
      },
    });
  } catch (error) {
    logger.error("Update report status error:", error);
    return next(error);
  }
};

/**
 * Update report details (only by admin/officials)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const updateReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      type,
      priority,
      location_address,
      location_lat,
      location_lng,
      barangay,
    } = req.body;

    //Check if report exists
    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({
        status: "error",
        message: "Report not found",
      });
    }

    // Only admin and officials can update most report details
    // Citizens can only update their own reports and only certain fields
    if (req.user.role === "citizen") {
      // Citizens can only edit their own reports
      if (report.user_id !== req.user.id) {
        return res.status(403).json({
          status: "error",
          message: "Access denied. You can only update your own reports.",
        });
      }

      // Citizens can only edit title and description, and only if the report is still pending
      if (report.status !== "pending") {
        return res.status(403).json({
          status: "error",
          message: "You can only edit pending reports.",
        });
      }

      //Update allowed fields
      await report.update({
        title: title || report.title,
        description: description || report.description,
      });
    } else {
      // Admins and officials can update all fields
      await report.update({
        title: title || report.title,
        description: description || report.description,
        type: type || report.type,
        priority: priority || report.priority,
        location_address: location_address || report.location_address,
        location_lat: location_lat || report.location_lat,
        location_lng: location_lng || report.location_lng,
        barangay: barangay || report.barangay,
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Report updated successfully",
      data: {
        report,
      },
    });
  } catch (error) {
    logger.error("Update report error:", error);
    return next(error);
  }
};

/**
 * Delete a report
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const deleteReport = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    //Check if report exists
    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({
        status: "error",
        message: "Report not found",
      });
    }

    // Only allow admins or the report creator to delete the report
    // Also, only allow deletion of pending reports
    if (req.user.role === "citizen" && report.user_id !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. You can only delete your own reports.",
      });
    }

    if (req.user.role === "citizen" && report.status !== "pending") {
      return res.status(403).json({
        status: "error",
        message: "You can only delete pending reports.",
      });
    }

    // Delete the report and all associated data (will cascade due to foreign key constraints)
    await report.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({
      status: "success",
      message: "Report deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    logger.error("Delete report error:", error);
    return next(error);
  }
};

/**
 * Add a comment to a report
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const addReportComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    //Check if report exists
    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({
        status: "error",
        message: "Report not found",
      });
    }

    // For citizens, ensure they can only comment on their own reports
    if (req.user.role === "citizen" && report.user_id !== req.user.id) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. You can only comment on your own reports.",
      });
    }

    //Create comment
    const newComment = await ReportComment.create({
      report_id: id,
      user_id: req.user.id,
      comment,
    });

    // Fetch the comment with user info
    const commentWithUser = await ReportComment.findByPk(newComment.id, {
      include: {
        model: User,
        as: "user",
        attributes: ["id", "first_name", "last_name", "role"],
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Comment added successfully",
      data: {
        comment: commentWithUser,
      },
    });
  } catch (error) {
    logger.error("Add report comment error:", error);
    return next(error);
  }
};

/**
 * Get report statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getReportStats = async (req, res, next) => {
  try {
    // Only admins and officials can access statistics
    if (req.user.role === "citizen") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only officials can view report statistics.",
      });
    }

    // Get total reports by status
    const statusCounts = await Report.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["status"],
    });

    // Get total reports by type
    const typeCounts = await Report.findAll({
      attributes: [
        "type",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["type"],
    });

    // Get reports by barangay
    const barangayCounts = await Report.findAll({
      attributes: [
        "barangay",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["barangay"],
    });

    // Get reports by priority
    const priorityCounts = await Report.findAll({
      attributes: [
        "priority",
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["priority"],
    });

    // Calculate resolution times (in hours) for resolved reports
    const resolvedReports = await Report.findAll({
      where: {
        status: "resolved",
        resolved_at: { [Op.ne]: null },
      },
      attributes: ["id", "created_at", "resolved_at"],
    });

    const resolutionTimes = resolvedReports.map((report) => {
      const created = new Date(report.created_at);
      const resolved = new Date(report.resolved_at);
      const diffHours = (resolved - created) / (1000 * 60 * 60);
      return diffHours;
    });

    // Calculate average resolution time
    const avgResolutionTime =
      resolutionTimes.length > 0
        ? resolutionTimes.reduce((sum, time) => sum + time, 0) /
          resolutionTimes.length
        : 0;

    return res.status(200).json({
      status: "success",
      message: "Report statistics retrieved successfully",
      data: {
        statusCounts,
        typeCounts,
        barangayCounts,
        priorityCounts,
        resolutionStats: {
          resolvedCount: resolvedReports.length,
          avgResolutionTimeHours: avgResolutionTime,
          minResolutionTimeHours: Math.min(...resolutionTimes) || 0,
          maxResolutionTimeHours: Math.max(...resolutionTimes) || 0,
        },
      },
    });
  } catch (error) {
    logger.error("Get report stats error:", error);
    return next(error);
  }
};

module.exports = {
  createReport,
  getAllReports,
  getReportById,
  updateReportStatus,
  updateReport,
  deleteReport,
  addReportComment,
  getReportStats,
};
