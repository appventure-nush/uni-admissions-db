const Sequelize = require("sequelize");

const sequelize = require("./index");

const Student = sequelize.define("student", {
  studentId: {
    type: Sequelize.CHAR(8),
    allowNull: false,
    primaryKey: true,
  },
  gradCap: {
    allowNull: false,
    type: Sequelize.DECIMAL(2, 1),
  },
});

module.exports = Student;
