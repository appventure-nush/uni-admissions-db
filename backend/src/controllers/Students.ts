import Student, {StudentAttributes} from "../models/Student";
import Sequelize = require("sequelize");
import {Op} from "sequelize";

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
  async getStudents() {
    return Student.findAll();
  },
  async getGradCaps() {
    return (await Student.findAll({
      // https://github.com/sequelize/sequelize/issues/5475
      attributes: [
        [Sequelize.literal(`DISTINCT ON("gradCap") "gradCap"`), "gradCap"],
      ],
      raw: true
    })).map((it: StudentAttributes) => it.gradCap);
  },
  async checkStudentId(id: string) {
    const year = id.substring(0,4);
    const studentIds = (await Student.findAll({
      attributes: ["studentId"],
      where:{
        studentId: {[Op.startsWith]:year}
      }
    })).map(it => it.studentId);
    if(studentIds.length == 0){
      return parseInt(id.substring(5,8)) == 1;
    }
    const lastId = parseInt(studentIds[studentIds.length-1].substring(5,8));
    return parseInt(id.substring(5,8)) + 1 == lastId;
  }
};
