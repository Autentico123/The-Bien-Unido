const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * Document model for storing government documents and forms
 */

const Document = sequelize.define(
  "Document",
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
        notEmpty: { msg: "Document title cannot be empty" },
        len: {
          args: [3, 100],
          msg: "Title must be between 3 and 100 characters",
        },
      },
    },
    category: {
      type: DataTypes.ENUM(
        "form",
        "permit",
        "certificate",
        "brochure",
        "guide"
      ),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Document category cannot be empty" },
      },
    },
    file_url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "File URL cannot be empty" },
        isUrl: { msg: "Invalid file URL format" },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Description cannot be empty" },
      },
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "services",
        key: "id",
      },
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    download_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    tableName: "documents",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Document;
