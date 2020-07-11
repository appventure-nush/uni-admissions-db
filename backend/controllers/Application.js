const ApplicationTable = require("../models/Application");
const Major = require("../models/Major");
const Student = require("../models/Student");
const University = require("../models/University");

Student.sync()
  .then(() => University.sync())
  .then(() => Major.sync())
  .then(() => ApplicationTable.sync());
module.exports = {
  async getApplicationsAllData({ offset, limit }, conditions) {
    const { count, rows } = await ApplicationTable.findAndCountAll({
      order: ["id"],
      include: [{
        model: Major,
        attributes: { exclude: ["majorId", "uniId"] },
      }, {
        model: Student,
      }, {
        model: University,
        attributes: { exclude: ["uniId"] },
      }],
      offset,
      limit,
      attributes: { exclude: ["studentId", "uniId", "majorId"] },
      where: conditions,
    });
    return {
      data: rows,
      offset,
      count,
    };
  },

  async getApplications({ offset, limit }, conditions) {
    const { count, rows } = await ApplicationTable.findAndCountAll({
      order: ["id"],
      offset,
      limit,
      where: conditions,
    });
    return {
      data: rows,
      offset,
      count,
    };
  },
  async getApplicationsBasic({ offset, limit }, conditions) {
    const { count, rows } = await ApplicationTable.findAndCountAll({
      order: ["id"],
      offset,
      limit,
      attributes: { exclude: ["informant", "dateInformed", "comment"] },
      where: conditions,
    });
    return {
      data: rows,
      offset,
      count,
    };
  },

  async getAverageCap() {
    const students = new Map();
    const data = await ApplicationTable.findAll({
      where: {
        uniName: "NUS",
      },
      include: [{
        model: Student,
        attributes: ["gradCap"],
      }],
    });
    data.forEach((d) => {
      students.set(d.studentId, d.student.gradCap);
    });
    const sum = Array.from(students.values()).reduce((a, b) => a + parseFloat(b), 0);
    return sum / students.size;
  },
};
