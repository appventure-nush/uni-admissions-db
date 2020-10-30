import Major from "../models/Major";

import Student from "../models/Student";

import University from "../models/University";

import ApplicationTable from "../models/Application";
import Application, {ApplicationAttributes} from "../models/Application";
import {Order, WhereOptions} from "sequelize/types/lib/model";
import combine_range from "../utils/combine_range";
import Students from "./Students";
import Majors from "./Major";
import Sequelize = require( "sequelize");

Student.sync()
  .then(() => University.sync())
  .then(() => Major.sync())
  .then(() => ApplicationTable.sync());

async function queryDistinct(tableName: string, columnName: string, conditions: WhereOptions<Application> | undefined): Promise<any[]> {
  return (await ApplicationTable.findAll({
    // https://github.com/sequelize/sequelize/issues/5475
    attributes: [
      [Sequelize.literal(`DISTINCT ON("${tableName}"."${columnName}") "${tableName}"."${columnName}"`), columnName],
    ],
    include: [{
      model: Major,
      attributes: {exclude: ["majorId", "majorName", "uniId"],},
    }, {
      model: Student,
      attributes: {exclude: ["studentId"]},
    }, {
      model: University,
      attributes: {exclude: ["uniId", "uniName"]},
    }],
    where: conditions,
    raw: true
  })).map((it: any) => it[columnName]);
}

export default {
  async getApplications({offset, limit}: { offset: number, limit: number },
                        conditions: WhereOptions<Application> | undefined,
                        sortParams: Order | undefined,
                        attributes: string[]
  ) {
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
      attributes,
      where: conditions,
    });
    return {
      data: rows,
      offset,
      count,
    };
  },
  async createApplication(application: ApplicationAttributes) {
    return ApplicationTable.create(application);
  },
  async getApplicationById(id: number) {
    return ApplicationTable.findOne({
      where: {
        id
      }
    });
  },
  async editApplication(id: number, application: ApplicationAttributes) {
    return ApplicationTable.update(application, {
      where: {
        id
      }
    });
  },
  async summarize(conditions: WhereOptions<Application> | undefined, full = false) {
    const years: number[] = [];
    const studentIdsObject: any = {};
    const gradCaps: string[] = full ? await Students.getGradCaps() : await queryDistinct("Student", "gradCap", conditions);
    const studentIds: string[] = full ? (await Students.getStudents()).map(it => it.studentId) : await queryDistinct("Student", "studentId", conditions);
    const uniIds: number[] = await queryDistinct("Application", "uniId", conditions);
    const majorIds: number[] = full ? (await Majors.getMajors(undefined)).map(it => it.majorId) : await queryDistinct("Application", "majorId", conditions);
    const countries: string[] = await queryDistinct("University", "country", conditions);
    const statuses: string[] = await queryDistinct("Application", "status", conditions);
    const categories: string[] = await queryDistinct("Major", "category", conditions);
    for (const id of studentIds) {
      const year = parseInt(id.substring(0, 4));
      if (years.includes(year)) {
        studentIdsObject[year].push(parseInt(id.substring(5, 8)));
      } else {
        years.push(year);
        studentIdsObject[year] = [parseInt(id.substring(5, 8))];
      }
    }
    const studentIdsOut = Object.entries(studentIdsObject).map(entry => {
      return {
        year: parseInt(entry[0].toString()),
        ids: combine_range(entry[1] as number[])
      };
    });
    const caps = combine_range(gradCaps.map(it => parseFloat(it) * 10));
    return {
      caps,
      studentIds: studentIdsOut,
      universities: combine_range(uniIds),
      majors: combine_range(majorIds),
      years: combine_range(years),
      countries,
      statuses,
      categories,
    };
  }
};
