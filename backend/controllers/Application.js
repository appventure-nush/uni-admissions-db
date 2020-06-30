const ApplicationTable = require("../models/Application");
const Major = require("../models/Major");
const Student = require("../models/Student");
const University = require("../models/University");

Student.sync()
  .then(() => University.sync())
  .then(() => Major.sync())
  .then(() => ApplicationTable.sync());
module.exports = {
  async getApplicationsAllData({ offset, limit }) {
    return ApplicationTable.findAll({
      include: [{
        model: Major,
      }, {
        model: Student,
      }, {
        model: University,
      }],
      offset,
      limit,
    });
  },

  async getApplications({ offset, limit }) {
    return ApplicationTable.findAll({
      offset,
      limit,
    });
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
