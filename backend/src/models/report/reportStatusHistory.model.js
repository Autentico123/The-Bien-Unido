const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * ReportStatusHistory model for tracking status changes of reports
 */

const ReportStatusHistory = sequelize.define(
  "ReportStatusHistory",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    report_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "reports",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    old_status: {
      type: DataTypes.ENUM(
        "pending",
        "assigned",
        "in_progress",
        "resolved",
        "closed",
        "rejected"
      ),
      allowNull: true, // Can be null for initial status
    },
    new_status: {
      type: DataTypes.ENUM(
        "pending",
        "assigned",
        "in_progress",
        "resolved",
        "closed",
        "rejected"
      ),
      allowNull: false,
      validate: {
        notEmpty: { msg: "New status cannot be empty" },
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "report_status_history",
    timestamps: false, //Only created_at needed
    underscored: true,
  }
);

module.exports = ReportStatusHistory;
