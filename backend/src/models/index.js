const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model");
const UserDevice = require("./userDevice.model");

//Define model associations
User.hasMany(UserDevice, { foreignKey: "user_id", as: "devices" });
UserDevice.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Define Sequelize operator aliases
const Op = Sequelize.Op;

module.exports = {
  sequelize,
  User,
  UserDevice,
  Op,
};
