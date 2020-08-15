const Student = require("../models/Student");

module.exports = {
  async getStudentById(id) {
    return Student.findOne({
      where: {
        studentId: id,
      },
    });
  },

  async addStudent(student) {
    return Student.create(student);
  },
};
