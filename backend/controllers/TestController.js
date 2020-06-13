const Test = require("../models/Test");

Test.sync();
module.exports = {
  async createUser(name) {
    return Test.create({
      name,
    });
  },
  async getUsers() {
    return Test.findAll();
  },
};
