require("dotenv").config();
const app = require("./src/app");
const { sequelize } = require("./src/models");
const logger = require("./src/utils/logger");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    //Test database connection
    await sequelize.authenticate();
    logger.info("Database connection established successfully");

    // Sync models with database (set force: false in production)
    await sequelize.sync({ force: false });

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed tp start server: ", error);
    process.exit(1);
  }
}

startServer();
