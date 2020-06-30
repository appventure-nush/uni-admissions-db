const Sequelize = require("sequelize");

const sequelize = require("./index");
const University = require("./University");

const Major = sequelize.define("major", {
  majorId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  majorName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
  },
  uniName: {
    type: Sequelize.STRING,
    references: {
      model: "universities",
      key: "uniName",
    },
  },
});
Major.University = Major.belongsTo(University, { foreignKey: "uniName", allowNull: false });

module.exports = Major;
