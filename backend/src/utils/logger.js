const winston = require("winston");
const path = require("path");
const { Model } = require("sequelize");

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Determine environment
const level = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "development" ? "debug" : "info";
};

//Define colors for each Log level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

// Add colors to winston
winston.addColors(colors);

// Create the format for the logs
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define which transports to use
const transports = [
  //Console logger
  new winston.transports.Console(),

  // Error logs to file
  new winston.transports.File({
    filename: path.join(__dirname, "../../log/error.log"),
    level: "error",
  }),
  // All logs to file
  new winston.transports.File({
    filename: path.join(__dirname, "../../logs/all.log"),
  }),
];

//Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

module.exports = logger;
