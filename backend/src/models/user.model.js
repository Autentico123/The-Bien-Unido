const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../config/database");

/**
 * User model representing citizen, admin, and official users in the system
 */
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "First name cannot be empty" },
      },
    },
    last_name: {
      type: DataTypes.STRING(50),
      validate: {
        notEmpty: { msg: "Last name cannot be empty" },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Please provide a valid email address" },
      },
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Mobile cannot be empty" },
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Address cannot be empty" },
      },
    },
    barangay: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Barangay cannot be empty" },
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password cannot be empty" },
      },
    },
    profile_photo_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("citizen", "admin", "official"),
      defaultValue: "citizen",
      allowNull: false,
    },
    verification_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verification_code: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    reset_token_expires: {
      type: DataTypes.DATE,
      allowNull: true,
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
    tableName: "users",
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password_hash")) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
    },
  }
);

/**
 * Instance method to compare password with stored hash
 *
 * @param {string} password - The password to verify
 * @returns {Promise<boolean>} True if password matches
 */

User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password_hash);
};

module.exports = User;
