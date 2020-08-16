import Student from "../models/Student";

export default {
  async getStudentById(id: string) {
    return Student.findOne({
      where: {
        studentId: id,
      },
    });
  },

  async addStudent(student: Student) {
    return Student.create(student);
  },
};
