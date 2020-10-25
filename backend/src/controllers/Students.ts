import Student, {StudentAttributes} from "../models/Student";

export default {
  async getStudentById(id: string) {
    return Student.findOne({
      where: {
        studentId: id,
      },
    });
  },

  async addStudent(student: StudentAttributes) {
    return Student.create(student);
  },
};
