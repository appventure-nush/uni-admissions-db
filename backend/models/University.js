const Sequelize = require("sequelize");

const sequelize = require("./index");

const University = sequelize.define("university", {
  uniName: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  country: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = University;
