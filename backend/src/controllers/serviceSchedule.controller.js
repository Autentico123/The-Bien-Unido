const { ServiceSchedule, Service, User, sequelize, Op } = require("../models");
const logger = require("../utils/logger");

/**
 * Get all service schedules with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const getAllServiceSchedules = async (req, res, next) => {
  try {
    const {
      service_type,
      day_of_week,
      barangay,
      recurring,
      page = 1,
      limit = 10,
      sort_by = "day_of_week",
      sort_dir = "ASC",
      search,
    } = req.query;
    // Build filter conditions
    const whereConditions = {};

    if (service_type) {
      whereConditions.service_type = service_type;
    }

    if (day_of_week) {
      whereConditions.day_of_week = day_of_week;
    }

    if (barangay) {
      whereConditions.barangay = barangay;
    }

    if (recurring !== undefined) {
      whereConditions.recurring = recurring === "true";
    }

    // Search implementation
    if (search) {
      whereConditions[Op.or] = [
        { service_type: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { barangay: { [Op.like]: `%${search}%` } },
      ];
    }

    //Calculate pagination
    const offset = (page - 1) * limit;

    // Validate sort_by field to prevent SQL injection
    const validSortFields = [
      "day_of_week",
      "service_type",
      "barangay",
      "start_time",
      "next_date",
    ];
    const sortField = validSortFields.includes(sort_by)
      ? sort_by
      : "day_of_week";

    // Validate sort direction
    const sortDirection = sort_dir === "ASC" ? "ASC" : "DESC";

    // Fetch service schedules with pagination
    const { count, rows: schedules } = await ServiceSchedule.findAndCountAll({
      where: whereConditions,
      order: [[sortField, sortDirection]],
      limit,
      offset,
      distinct: true,
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    // Get unique barangays and service types for filtering options
    const barangays = await ServiceSchedule.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("barangay")), "barangay"],
      ],
      raw: true,
    });

    const serviceTypes = await ServiceSchedule.findAll({
      attributes: [
        [
          sequelize.fn("DISTINCT", sequelize.col("service_type")),
          "service_type",
        ],
      ],
      raw: true,
    });

    return res.status(200).json({
      status: "success",
      message: "Service schedules retrieved successfully",
      data: {
        schedules,
        filters: {
          barangays: barangays.map((b) => b.barangay),
          serviceTypes: serviceTypes.map((s) => s.service_type),
          daysOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        pagination: {
          total: count,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total_pages: totalPages,
        },
      },
    });
  } catch (error) {
    logger.error("Get all service schedules error:", error);
    return next(error);
  }
};

/**
 * Create a new service schedule
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const createServiceSchedule = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      service_type,
      day_of_week,
      start_time,
      end_time,
      barangay,
      description,
      recurring,
      next_date,
    } = req.body;

    // Only admin and officials can create service schedules
    if (req.user.role === "citizen") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only officials can create service schedules.",
      });
    }

    // Create new service schedule
    const schedule = await ServiceSchedule.create(
      {
        service_type,
        day_of_week,
        start_time,
        end_time,
        barangay,
        description,
        recurring: recurring !== undefined ? recurring : true,
        next_date: recurring === false && next_date ? next_date : null,
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      status: "success",
      message: "Service schedule created successfully",
      data: {
        schedule,
      },
    });
  } catch (error) {
    await transaction.rollback();
    logger.error("Create service schedule error:", error);
    return next(error);
  }
};

/**
 * Get service schedules by barangay
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const getSchedulesByBarangay = async (req, res, next) => {
  try {
    const { barangay } = req.params;
    if (!barangay) {
      return res.status(400).json({
        status: "error",
        message: "Barangay parameter is required",
      });
    }

    //Get current date for filtering
    const currentDate = new Date();
    const formattedDate = currentDate.toDateString().split("T")[0];

    // Find schedules for this barangay
    const schedules = await ServiceSchedule.findAll({
      where: {
        barangay,
        [Op.or]: [
          { recurring: true },
          {
            recurring: false,
            next_date: {
              [Op.gte]: formattedDate,
            },
          },
        ],
      },
      order: [
        ["day_of_week", "ASC"],
        ["start_time", "ASC"],
      ],
    });

    // Group schedules by day of week
    const groupedSchedules = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };

    schedules.forEach((schedule) => {
      groupedSchedules[schedule.day_of_week].push(schedule);
    });

    return res.status(200).json({
      status: "success",
      message: "Service schedules retrieved successfully",
      data: {
        barangay,
        scheduledDays: Object.keys(groupedSchedules).filter(
          (day) => groupedSchedules[day].length > 0
        ),
        schedules: groupedSchedules,
      },
    });
  } catch (error) {
    logger.error("Get schedules by barangay error:", error);
    return next(error);
  }
};

/**
 * Get upcoming service schedules
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const getUpcomingSchedules = async (req, res, next) => {
  try {
    const { days = 7, barangay } = req.query;

    //Calculate date range
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days, 10));

    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];

    // Build where conditions
    const whereConditions = {
      [Op.or]: [
        {
          // Non-recurring schedules with specific dates
          recurring: false,
          next_date: {
            [Op.between]: [formattedStartDate, formattedEndDate],
          },
        },
        {
          // Recurring schedules (we'll filter these by day of week later)
          recurring: true,
        },
      ],
    };

    // Filter by barangay if provided
    if (barangay) {
      whereConditions.barangay = barangay;
    }

    // Get user's barangay if they're a citizen
    if (req.user.role === "citizen" && !barangay) {
      const user = await User.findByPk(req.user.id);
      if (user && user.barangay) {
        whereConditions.barangay = user.barangay;
      }
    }

    // Get all relevant schedules
    const schedules = await ServiceSchedule.findAll({
      where: whereConditions,
      order: [
        ["next_date", "ASC"],
        ["day_of_week", "ASC"],
        ["start_time", "ASC"],
      ],
    });

    // Filter recurring schedules to only include those within the next X days
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    // Map JS day number (0-6) to the day names we use in the database
    const currentDayName = dayNames[dayOfWeek];

    // Find which days in our range occur within the next X days
    const relevantDays = new Set();
    for (let i = 0; i < parseInt(days, 10); i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      relevantDays.add(dayNames[futureDate.getDay()]);
    }

    // Filter and format the schedules
    const upcomingSchedules = schedules
      .filter((schedule) => {
        if (!schedule.recurring) {
          return true; // Already filtered by date in query
        }
        return relevantDays.has(schedule.day_of_week);
      })
      .map((schedule) => {
        // Calculate the next occurrence for recurring schedules
        let nextOccurrence = null;
        if (schedule.recurring) {
          // Find the next occurrence based on day of week
          const daysUntilNext =
            dayNames.findIndex((day) => day === schedule.day_of_week) -
            dayOfWeek;
          const adjustedDays =
            daysUntilNext < 0 ? daysUntilNext + 7 : daysUntilNext;

          nextOccurrence = new Date();
          nextOccurrence.setDate(nextOccurrence.getDate() + adjustedDays);

          // Format the date as YYYY-MM-DD
          nextOccurrence = nextOccurrence.toISOString().split("T")[0];
        } else {
          nextOccurrence = schedule.next_date;
        }

        return {
          ...schedule.get({ plain: true }),
          next_occurrence: nextOccurrence,
        };
      });

    // Sort by the calculated next occurrence
    upcomingSchedules.sort((a, b) => {
      if (a.next_occurrence < b.next_occurrence) return -1;
      if (a.next_occurrence > b.next_occurrence) return 1;
      return 0;
    });

    return res.status(200).json({
      status: "success",
      message: "Upcoming schedules retrieved successfully",
      data: {
        schedules: upcomingSchedules,
        date_range: {
          from: formattedStartDate,
          to: formattedEndDate,
        },
      },
    });
  } catch (error) {
    logger.error("Get upcoming schedules error:", error);
    return next(error);
  }
};

/**
 * Update a service schedule
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const updateServiceSchedule = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const {
      service_type,
      day_of_week,
      start_time,
      end_time,
      barangay,
      description,
      recurring,
      next_date,
    } = req.body;

    // Check if schedule exists
    const schedule = await ServiceSchedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({
        status: "error",
        message: "Service schedule not found",
      });
    }

    // Only admin and officials can update schedules
    if (req.user.role === "citizen") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only officials can update service schedules.",
      });
    }

    // Update schedule fields
    await schedule.update(
      {
        service_type: service_type || schedule.service_type,
        day_of_week: day_of_week || schedule.day_of_week,
        start_time: start_time || schedule.start_time,
        end_time: end_time || schedule.end_time,
        barangay: barangay || schedule.barangay,
        description:
          description !== undefined ? description : schedule.description,
        recurring: recurring !== undefined ? recurring : schedule.recurring,
        next_date:
          recurring === false && next_date ? next_date : schedule.next_date,
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(200).json({
      status: "success",
      message: "Service schedule updated successfully",
      data: {
        schedule,
      },
    });
  } catch (error) {
    logger.error("Update service schedule error:", error);
    return next(error);
  }
};

/**
 * Delete a service schedule
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const deleteServiceSchedule = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    //Check if schedule exists
    const schedule = await ServiceSchedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({
        status: "error",
        message: "Service schedule not found",
      });
    }

    // Only admin and officials can delete schedules
    if (req.user.role !== "admin" && req.user.role !== "official") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Only officials can delete service schedules.",
      });
    }

    // Delete the schedule
    await schedule.destroy({ transaction });

    await transaction.commit();
    return res.status(200).json({
      status: "success",
      message: "Service schedule deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    logger.error("Delete service schedule error:", error);
    return next(error);
  }
};

/**
 * Get schedules by service type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

const getSchedulesByServiceType = async (req, res, next) => {
  try {
    const { type } = req.params;

    if (!type) {
      return res.status(400).json({
        status: "error",
        message: "Service type parameter is required",
      });
    }

    // Find schedules for this service type
    const schedules = await ServiceSchedule.findAll({
      where: {
        service_type: type,
      },
      order: [
        ["day_of_week", "ASC"],
        ["barangay", "ASC"],
        ["start_time", "ASC"],
      ],
    });

    // Group schedules by barangay
    const groupedSchedules = {};

    schedules.forEach((schedule) => {
      if (!groupedSchedules[schedule.barangay]) {
        groupedSchedules[schedule.barangay] = [];
      }
      groupedSchedules[schedule.barangay].push(schedule);
    });

    return res.status(200).json({
      status: "success",
      message: "Service schedules retrieved successfully",
      data: {
        service_type: type,
        total_schedules: schedules.length,
        barangays: Object.keys(groupedSchedules),
        schedules: groupedSchedules,
      },
    });
  } catch (error) {
    logger.error("Get schedules by service type error:", error);
    return next(error);
  }
};

module.exports = {
  createServiceSchedule,
  getAllServiceSchedules,
  getSchedulesByBarangay,
  getUpcomingSchedules,
  updateServiceSchedule,
  deleteServiceSchedule,
  getSchedulesByServiceType,
};
