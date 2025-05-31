const sequelize = require("../config/database");
const User = require("./user.model");

// Import any other models here
// const Report = require('./report.model');
// ...etc

// Define model associations here (will be expanded later)
// User.hasMany(Report, { foreignKey: 'user_id', as: 'reports' });
// ...etc

module.exports = {
  sequelize,
  User,
};
