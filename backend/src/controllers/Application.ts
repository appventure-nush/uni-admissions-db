import Major from "../models/Major";

import Student from "../models/Student";

import University from "../models/University";

import ApplicationTable from "../models/Application";
import Application, {ApplicationAttributes} from "../models/Application";
import {Order, WhereOptions} from "sequelize/types/lib/model";

Student.sync()
  .then(() => University.sync())
  .then(() => Major.sync())
  .then(() => ApplicationTable.sync());
export default {
  async getApplicationsAllData({offset, limit}: { offset: number, limit: number },
                               conditions: WhereOptions<Application> | undefined,
                               sortParams: Order | undefined) {
    const {count, rows} = await ApplicationTable.findAndCountAll({
      order: sortParams,
      include: [{
        model: Major,
        attributes: {exclude: ["majorId", "uniId"]},
      }, {
        model: Student,
      }, {
        model: University,
        attributes: {exclude: ["uniId"]},
      }],
      offset,
      limit,
      attributes: {exclude: ["studentId", "uniId", "majorId"]},
      where: conditions,
    });
    return {
      data: rows,
      offset,
      count,
    };
  },

  async getApplications({offset, limit}: { offset: number, limit: number },
                        conditions: WhereOptions<Application> | undefined,
                        sortParams: Order | undefined) {
    const {count, rows} = await ApplicationTable.findAndCountAll({
      order: sortParams,
      offset,
      limit,
      where: conditions,
    });
    return {
      data: rows,
      offset,
      count,
    };
  },
  async getApplicationsBasic({offset, limit}: { offset: number, limit: number },
                             conditions: WhereOptions<Application> | undefined,
                             sortParams: Order | undefined) {
    const {count, rows} = await ApplicationTable.findAndCountAll({
      order: sortParams,
      offset,
      limit,
      attributes: {exclude: ["informant", "dateInformed", "comment"]},
      where: conditions,
    });
    return {
      data: rows,
      offset,
      count,
    };
  },

  async getAverageCap() {
    const students = new Map();
    const data = await ApplicationTable.findAll({
      where: {
        uniName: "NUS",
      },
      include: [{
        model: Student,
        attributes: ["gradCap"],
      }],
    }) as Array<Application & {
      student: {
        gradCap: number
      }
    }>;
    data.forEach((d) => {
      students.set(d.studentId, d.student.gradCap);
    });
    const sum = Array.from(students.values()).reduce((a, b) => a + parseFloat(b), 0);
    return sum / students.size;
  },
  async createApplication(application: ApplicationAttributes) {
    return ApplicationTable.create(application);
  },
};
