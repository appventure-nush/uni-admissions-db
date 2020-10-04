const Major = require("../models/Major");

module.exports = {
  async getMajors() {
    return Major.findAll();
  },
};
