const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * ServiceSchedule model for scheduling government services
 */

const ServiceSchedule = sequelize.define(
  "ServiceSchedule",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    service_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Service type cannot be empty" },
      },
    },
    day_of_week: {
      type: DataTypes.ENUM(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Day of week cannot be empty" },
      },
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Start time cannot be empty" },
      },
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: { msg: "End time cannot be empty" },
      },
    },
    barangay: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Barangay cannot be empty" },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    next_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "service_schedules",
    timestamps: true,
    underscored: true,
  }
);

module.exports = ServiceSchedule;
