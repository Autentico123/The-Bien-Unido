const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * Service model for government services offered to citizens
 */

const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Service name cannot be empty" },
        len: {
          args: [3, 100],
          msg: "Service name must be between 3 and 100 characters",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Service description cannot be empty" },
      },
    },
    category: {
      type: DataTypes.ENUM(
        "sanitation",
        "health",
        "permits",
        "certificates",
        "social_welfare",
        "payments"
      ),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Service category cannot be empty" },
      },
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estimated_completion: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Department cannot be empty" },
      },
    },
    is_online_application: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
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
    tableName: "services",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Service;
