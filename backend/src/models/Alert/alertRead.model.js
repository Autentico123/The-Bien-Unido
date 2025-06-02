const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

/**
 * AlertRead model for tracking which users have read which alerts
 */
const AlertRead = sequelize.define(
  "AlertRead",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    alert_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "alerts",
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
    read_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "alert_reads",
    timestamps: false, // Only read_at needed
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["alert_id", "user_id"],
      },
    ],
  }
);

module.exports = AlertRead;
