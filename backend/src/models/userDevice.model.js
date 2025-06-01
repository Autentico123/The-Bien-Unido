const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

/**
 * UserDevice model for managing push notification tokens
 */

const UserDevice = sequelize.define(
  "UserDevice",
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
    device_token: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    device_type: {
      type: DataTypes.ENUM("android", "ios", "web"),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "user_devices",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["device_token", "user_id"],
      },
    ],
  }
);

module.exports = UserDevice;
