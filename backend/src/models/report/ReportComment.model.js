const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * ReportComment model for storing comments on reports
 */

const ReportComment = sequelize.define(
  "ReportComment",
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
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Comment cannot be empty" },
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "report_comments",
    timestamps: false,
    underscored: true,
  }
);

module.exports = ReportComment;
