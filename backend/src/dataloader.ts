import UniversityTable from "./models/University";

import Student from "./models/Student";

import sequelize from "./models";


import Major from "./models/Major";


import Application from "./models/Application";
import constants from "./utils/constants";

class ApplicationsRaw {
  public student!: string;
  public major!: number;
  public comment!: string;
  public status!: {
    mainStatus: string,
    suppStatus: string
  };
  public informant!: string;
  public dateInformed!: string;
  public uniId!: number;
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

const majorsRaw = require("../majors.json") as Map<string, number>;

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

let majors = Array.from(majorsSet).map((a: any) => JSON.parse(a.toString())) as Array<{
  majorNameIndex: number,
  majorName: string,
  category: string,
  uniId: number,
  majorId?: number
}>;

for (const application of applications) {
  application.status = application.status.trim();
  const split = application.status.split(" - ");
  if (split.length == 2) {
    application.status = split[0].trim();
    if (application.comment.length) {
      application.comment = split[1].trim() + "; " + application.comment;
    } else {
      application.comment = split[1].trim();
    }
  }
  if (!constants.statuses.includes(application.status)) {
    const status = application.status.toLowerCase();
    if (application.status == "") {
      application.status = "Unknown";
    } else if (status.startsWith("waitlist")) {
      application.status = "Waitlist";
    } else if (status.startsWith("interview")) {
      application.status = "Applied";
      if (application.comment.length) {
        application.comment = "Interview; " + application.comment;
      } else {
        application.comment = "Interview";
      }
    } else if (status.startsWith("with")) {
      application.status = "Withdrawn";
    } else if (status.startsWith("offer")) {
      application.status = "offered";
    } else {
      console.log("Unknown:", application.status);
    }
  }
  application.majorId = majors.findIndex((major) => major.majorNameIndex === application.majorId
    && major.uniId === application.uniId) + 1;
}
majors = majors.map((major) => {
  delete major.majorNameIndex;
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
