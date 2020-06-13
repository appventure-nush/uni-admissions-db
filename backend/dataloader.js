const universities = [{
  name: "NUS",
  country: "Singapore",
}, {
  name: "NTU",
  country: "Singapore",
}, {
  name: "MIT",
  country: "United States",
}, {
  name: "CMU",
  country: "United States",
}];

const majors = [{
  uniName: "NUS",
  majorName: "Data Science and Analytics",
  category: "Computing",
}, {
  uniName: "CMU",
  majorName: "Computer Science",
  category: "Computing",
}];

const students = [{
  studentId: "a1",
  gradCap: 5.0,
}];

const applications = [{
  uniName: "CMU",
  majorName: "Computer Science",
  status: "Offered - Accepted",
  studentId: "a1",
  informant: "allan",
  dateInformed: null,
  comment: null,
}];

require("debug").log(`Tables will be dropped before loading data.
All existing data will be lost.
You have 10 seconds to kill this process before tables are dropped.
`);

setTimeout(async () => {
  // eslint-disable-next-line global-require
  const UniversityTable = require("./models/University");
  // eslint-disable-next-line global-require
  const Student = require("./models/Student");
  // eslint-disable-next-line global-require
  const sequelize = require("./models/index");

  await UniversityTable.sync({ force: true });
  await Student.sync({ force: true });

  // eslint-disable-next-line global-require
  const Major = require("./models/Major");

  await Major.sync({ force: true });

  // eslint-disable-next-line global-require
  const Application = require("./models/Application");

  await Application.sync({ force: true });

  await Promise.all(universities.map(async (university) => UniversityTable.create({
    uniName: university.name,
    country: university.country,
  })));

  await Promise.all(students.map(async (student) => Student.create({
    studentId: student.studentId,
    gradCap: student.gradCap,
  })));

  await Promise.all(majors.map(async (major) => Major.create({
    majorName: major.majorName,
    category: major.category,
    uniName: major.uniName,
  })));

  await Promise.all(applications.map(async (application) => {
    Application.create({
      studentId: application.studentId,
      majorName: application.majorName,
      uniName: application.uniName,
      status: application.status,
      informant: application.informant,
      dateInformed: application.dateInformed,
      comment: application.comment,
    });
  }));

  setTimeout(() => {
    sequelize.close();
  }, 1000);
}, 10000);
