const Major = require("../models/Major");

module.exports = {
  async getMajors() {
    return Major.findAll();
  },

  async getMajorById(id) {
    return Major.findOne({
      where: {
        majorId: id,
      },
    });
  },
};
