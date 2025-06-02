const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const reportRoutes = require("./report.routes");
// const serviceRoutes = require("./services.routes");
const alertRoutes = require("./alerts.routes");
const serviceScheduleRoutes = require("./serviceSchedules.routes");

//Mount routes
router.use("/auth", authRoutes);
router.use("/reports", reportRoutes);
router.use("/alerts", alertRoutes);
router.use("/schedules", serviceScheduleRoutes);

// API documentation route
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to Bien Unido Citizen App API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      reports: "/api/reports",
      alerts: "/api/alerts",
      schedules: "/api/schedules",
    },
  });
});

module.exports = router;
