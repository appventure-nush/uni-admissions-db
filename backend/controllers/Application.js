const ApplicationTable = require("../models/Application");
const Major = require("../models/Major");
const Student = require("../models/Student");
const University = require("../models/University");

module.exports = {
  async getApplicationsAllData() {
    return ApplicationTable.findAll({
      include: [{
        model: Major,
      }, {
        model: Student,
      }, {
        model: University,
      }],
    });
  },
};
