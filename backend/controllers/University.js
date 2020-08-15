const University = require("../models/University");

module.exports = {
  async getUniversities() {
    return University.findAll();
  },
  async getUniversityById(id) {
    return University.findOne({
      where: {
        uniId: id,
      },
    });
  },
};
