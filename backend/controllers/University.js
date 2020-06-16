const University = require("../models/University");

module.exports = {
  async getUniversities() {
    return University.findAll();
  },
};
