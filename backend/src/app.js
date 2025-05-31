const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const errorMiddleware = require("./middleware/error.middleware");
const routes = require("./routes");
const https = require("https");

// Configure global https defaults to help with SSL issues
https.globalAgent.options.rejectUnauthorized = false;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // Only use in development!

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date() });
});

//Api routes
app.use("/api", routes);

app.use(errorMiddleware);

module.exports = app;
