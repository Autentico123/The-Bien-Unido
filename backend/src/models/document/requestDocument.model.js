const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * RequestDocument model for storing documents uploaded by users for service requests
 */

const RequestDocument = sequelize.define(
  "RequestDocument",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    service_request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "service_requests",
        key: "id",
      },
    },
    document_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Document URL cannot be empty" },
        isUrl: { msg: "Invalid document URL format" },
      },
    },
    document_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Document type cannot be empty" },
      },
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    verification_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "request_documents",
    timestamps: false, // Only created_at needed
    underscored: true,
  }
);

module.exports = RequestDocument;
