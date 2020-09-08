// const universities = [{
//   name: "NUS",
//   country: "Singapore",
// }, {
//   name: "NTU",
//   country: "Singapore",
// }, {
//   name: "MIT",
//   country: "United States",
// }, {
//   name: "CMU",
//   country: "United States",
// }];
//
// const majors = [{
//   uniName: "NUS",
//   majorName: "Data Science and Analytics",
//   category: "Computing",
// }, {
//   uniName: "CMU",
//   majorName: "Computer Science",
//   category: "Computing",
// }];
//
// const students = [...Array(2000).keys()].map((i) => ({
//   studentId: `a${i}`,
//   gradCap: parseFloat((Math.random() * (5 - 2) + 2).toFixed(1)),
// }));
//
// const applications = [...Array(1440 * 10).keys()].map(() => {
//   const major = majors[(Math.random() > 0.5) + 0];
//   return {
//     studentId: `a${Math.floor(Math.random() * 2000)}`,
//     majorName: major.majorName,
//     uniName: major.uniName,
//     status: "Offered - Accepted",
//     comment: null,
//     informant: "allan",
//     dateInformed: null,
//   };
// });

import UniversityTable from "./models/University";

import Student from "./models/Student";

import sequelize from "./models";


// eslint-disable-next-line global-require
import Major from "./models/Major";


// eslint-disable-next-line global-require
import Application from "./models/Application";

class ApplicationsRaw {
  public student!: string;
  public major!: number;
  public comment!: string;
  public status!: {
    mainStatus: string,
    suppStatus: string
  }
  public informant!: string;
  public dateInformed!: string;
  public uniId!: number
}

const applicationsRaw = require("../applications.json") as Array<ApplicationsRaw>;

const universitiesList =
  require("../universities.json") as Array<{
    id: number,
    displayName: string
    country: string
  }>;

const universities = universitiesList.map((uni) => ({
  id: uni.id,
  name: uni.displayName,
  country: uni.country
}));
const students = Object.entries(require("../students.json") as Map<string, {
  cap: number
}>).map((a) => ({
  studentId: a[0],
  gradCap: a[1].cap,
}));

const majorsRaw = require("../majors.json") as Map<String, number>;

const majorsSet = new Set();

const majorEntries = Object.entries(majorsRaw);

const applications = applicationsRaw.map((a) => {
  const majorNameIndex = majorEntries.findIndex((major) => major[1] === a.major);
  const majorName = majorEntries[majorNameIndex][0];
  majorsSet.add(JSON.stringify({
    majorNameIndex: a.major,
    majorName,
    category: "Unknown",
    uniId: a.uniId,
  }));
  return {
    studentId: a.student,
    uniId: a.uniId,
    comment: a.comment,
    status: a.status.mainStatus + a.status.suppStatus,
    majorId: a.major,
    informant: a.informant,
    dateInformed: null, // a.dateInformed.length === 0 ? null : a.dateInformed,
  };
});

// @ts-ignore
let majors = Array.from(majorsSet).map((a: string) => JSON.parse(a)) as Array<{
  majorNameIndex: number,
  majorName: String,
  category: String,
  uniId: number,
  majorId?: number
}>;

for (const application of applications) {
  application.majorId = majors.findIndex((major) => major.majorNameIndex === application.majorId
    && major.uniId === application.uniId) + 1;
}
let i = 1;
majors = majors.map((major) => {
  major.majorId = i;
  delete major.majorNameIndex;
  i += 1;
  return major;
});

require("debug").log(`Tables will be dropped before loading data.
All existing data will be lost.
You have 10 seconds to kill this process before tables are dropped.
`);
setTimeout(async () => {

  await UniversityTable.sync({force: true});
  await Student.sync({force: true});
  await Major.sync({force: true});
  await Application.sync({force: true});

  await UniversityTable.bulkCreate(universities.map((university) => ({
    id: university.id,
    uniName: university.name,
    country: university.country,
  })));

  await Student.bulkCreate(students);

  await Major.bulkCreate(majors);

  await Application.bulkCreate(applications);

  setTimeout(() => {
    sequelize.close();
  }, 1000);
}, 10000);
