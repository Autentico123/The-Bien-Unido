const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * Report model for citizen issue reporting system
 */

const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM(
        "garbage",
        "road_damage",
        "flooding",
        "electricity",
        "water_supply",
        "public_safety",
        "others"
      ),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Report type cannot be empty" },
      },
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Report title cannot be empty" },
        len: {
          args: [5, 100],
          msg: "Title must be between 5 and 100 characters",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Report description cannot be empty" },
      },
    },
    location_address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Location address cannot be empty" },
      },
    },
    location_lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
      validate: {
        min: {
          args: [-90],
          msg: "Latitude must be between -90 and 90",
        },
        max: {
          args: [90],
          msg: "Latitude must be between -90 and 90",
        },
      },
    },
    location_lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
      validate: {
        min: {
          args: [-180],
          msg: "Longitude must be between -180 and 180",
        },
        max: {
          args: [180],
          msg: "Longitude must be between -180 and 180",
        },
      },
    },
    barangay: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Barangay cannot be empty" },
      },
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "assigned",
        "in_progress",
        "resolved",
        "closed",
        "rejected"
      ),
      defaultValue: "pending",
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high", "critical"),
      defaultValue: "medium",
      allowNull: false,
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    resolution_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resolved_at: {
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
    tableName: "reports",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeUpdate: async (report) => {
        // Add resolved timestamp when status changes to resolved
        if (
          report.changed("status") &&
          report.status === "resolved" &&
          !report.resolved_at
        ) {
          report.resolved_at = new Date();
        }
      },
    },
  }
);

module.exports = Report;
