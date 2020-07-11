const Sequelize = require("sequelize");

const sequelize = require("./index");

const University = sequelize.define("university", {
  uniId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  uniName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  country: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = University;
