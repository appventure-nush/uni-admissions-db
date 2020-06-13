const Sequelize = require("sequelize");
const logger = require("debug");
const config = require("../config.json");

const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
  host: "localhost",
  dialect: "postgres",
  define: {
    timestamps: false,
  },
});

sequelize.authenticate()
  .then(() => {
    logger.log("Connected to database.");
  }).catch((err) => {
    logger.log("Connection failed: ", err);
  });

module.exports = sequelize;
