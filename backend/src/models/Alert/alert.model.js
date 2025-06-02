const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * Alert model for emergency notifications and announcements
 */

const Alert = sequelize.define(
  "Alert",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Alert title cannot be empty" },
        len: {
          args: [3, 100],
          msg: "Title must be between 3 and 100 characters",
        },
      },
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Alert body cannot be empty" },
      },
    },
    category: {
      type: DataTypes.ENUM(
        "emergency",
        "weather",
        "event",
        "announcement",
        "health",
        "traffic"
      ),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Alert category cannot be empty" },
      },
    },
    importance: {
      type: DataTypes.ENUM("low", "medium", "high", "critical"),
      defaultValue: "medium",
      allowNull: false,
    },
    barangay: {
      type: DataTypes.STRING(50),
      defaultValue: "ALL",
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    start_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
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
    tableName: "alerts",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: (alert) => {
        // Set end date to 7 days from start if not provided
        if (!alert.end_date) {
          const endDate = new Date(alert.start_date);
          endDate.setDate(endDate.getDate() + 7);
          alert.end_date = endDate;
        }
      },
    },
  }
);

module.exports = Alert;
