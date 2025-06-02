const { DataTypes } = require("sequelize");
const { nanoid } = require("nanoid");
const sequelize = require("../../config/database");

/**
 * ServiceRequest model for handling citizen requests for services
 */

const ServiceRequest = sequelize.define(
  "ServiceRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "services",
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
    reference_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM(
        "submitted",
        "processing",
        "approved",
        "rejected",
        "completed",
        "cancelled"
      ),
      defaultValue: "submitted",
      allowNull: false,
    },
    appointment_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    appointment_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    additional_info: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "service_requests",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: (request) => {
        // Generate unique reference number
        // Format: SR-YYYYMMDD-XXXXX (e.g., SR-20230615-A12B3)

        const now = new Date();
        const dateString = now.toISOString().slice(0, 10).replace(/-/g, "");
        const randomId = nanoid(5).toUpperCase();
        request.reference_number = `SR-${dateString}-${randomId}`;
      },
      beforeUpdate: (request) => {
        // Set completed_at when status changes to completed
        if (
          request.changed("status") &&
          request.status === "completed" &&
          !request.completed_at
        ) {
          request.completed_at = new Date();
        }
      },
    },
  }
);

module.exports = ServiceRequest;
