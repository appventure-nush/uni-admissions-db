const Sequelize = require("sequelize");

const sequelize = require("./index");

const Test = sequelize.define("test", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Test;
