const Sequelize = require("sequelize");

const sequelize = require("./index");
const University = require("./University");
const Student = require("./Student");
const Major = require("./Major");

const Application = sequelize.define("application", {
  studentId: {
    type: Sequelize.CHAR(8),
    references: {
      model: "students",
      key: "studentId",
    },
    allowNull: false,
  },
  majorId: {
    type: Sequelize.INTEGER,
    references: {
      model: "majors",
      key: "majorId",
    },
    allowNull: false,
  },
  uniName: {
    type: Sequelize.STRING,
    references: {
      model: "universities",
      key: "uniName",
    },
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  informant: {
    type: Sequelize.STRING,
  },
  dateInformed: {
    type: Sequelize.TIME,
  },
  comment: {
    type: Sequelize.TEXT,
  },
});
Application.University = Application.belongsTo(University, { foreignKey: "uniName", allowNull: false });
Application.Major = Application.belongsTo(Major, { foreignKey: "majorId", allowNull: false });
Application.Student = Application.belongsTo(Student, { foreignKey: "studentId", allowNull: false });

module.exports = Application;
