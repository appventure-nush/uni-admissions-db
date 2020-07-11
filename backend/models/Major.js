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
  uniId: {
    type: Sequelize.INTEGER,
    references: {
      model: "universities",
      key: "uniId",
    },
  },
});
Major.University = Major.belongsTo(University, { foreignKey: "uniId", allowNull: false });

module.exports = Major;
