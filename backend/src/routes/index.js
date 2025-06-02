const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const reportRoutes = require("./report.routes");
// const serviceRoutes = require("./services.routes");
const serviceScheduleRoutes = require("./serviceSchedules.routes");

//Mount routes
router.use("/auth", authRoutes);
router.use("/reports", reportRoutes);
router.use("/schedules", serviceScheduleRoutes);

// API documentation route
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to Bien Unido Citizen App API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
    },
  });
});

module.exports = router;
