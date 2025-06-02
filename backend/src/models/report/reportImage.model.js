const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * ReportImage model for storing images related to reports
 */

const ReportImage = sequelize.define(
  "ReportImage",
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
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Image URL cannot be empty" },
        isUrl: { msg: "Invalid image URL format" },
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "report_images",
    timestamps: false, // No updated_at needed
    underscored: true,
  }
);

module.exports = ReportImage;
