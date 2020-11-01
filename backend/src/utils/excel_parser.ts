import xlsx = require("xlsx");
import Application, {ApplicationAttributes} from "../models/Application";
import Student, {StudentAttributes} from "../models/Student";
import Students from "../controllers/Students";
import University from "../controllers/University";
import Major from "../controllers/Major";
import constants from "./constants";

export default async function (file: Buffer): Promise<{ error: boolean, message: string }> {
  const wb = xlsx.read(file, {
    type: "buffer",
    cellDates: true,
  });
  const {Sheet1: sheet1} = wb.Sheets;
  const columns: string[] = [];
  let curr = 65;
  const ref = sheet1["!ref"];
  if (ref == undefined) {
    return {
      error: true,
      message: "Invalid sheet"
    };
  }
  const end = ref.split(":")[1][0];
  while (String.fromCharCode(curr) != end) {
    columns.push(String.fromCharCode(curr));
    curr++;
  }
  columns.push(String.fromCharCode(curr));
  const endRow = parseInt(ref.split(":")[1].substring(1)) + 1;
  const schema = [
    "Student ID",
    "Graduation CAP",
    "University",
    "Status",
    "Major",
    "Informant",
    "Date Informed",
    "Comment"
  ];
  if (columns.length != schema.length) {
    return {
      error: true,
      message: "Worksheet headers does not match [" + schema.join(", ") + "]. Ensure there are no additional columns."
    };
  }
  let counter = 0;
  // Check headers against schema
  for (const column of columns) {
    const cellNo = column + 1;
    const cellValue = sheet1[cellNo] == undefined ? undefined : sheet1[cellNo].v;
    if (cellValue != schema[counter]) {
      return {
        error: true,
        message: "Worksheet headers does not match [" + schema.join(", ") + "]"
      };
    }
    counter++;
  }
  const applications: ApplicationAttributes[] = [];
  const students: StudentAttributes[] = [];
  for (let i = 2; i < endRow; i++) {
    const application = new Application();
    const student = new Student();
    let studentExists = false;
    for (let columnNo = 0; columnNo < columns.length; columnNo++) {
      const column = columns[columnNo];
      const cellNo = column + i;
      const cellValue = sheet1[cellNo] == undefined ? "" : sheet1[cellNo].v;
      switch (columnNo) {
        // Student ID
        case 0 : {
          if (!cellValue.match(/20[0-9]{2}a[0-9]{3}/)) {
            return {
              error: true,
              message: `Student ID on row ${i} (${cellValue}) does not match 20[00-99]a[000-999].`
            };
          }
          const studentId = cellValue as string;
          const existingStudent = await Students.getStudentById(studentId);
          const lastStudentId = students[students.length - 1]?.studentId;
          if (existingStudent == null && lastStudentId != studentId) {
            if (!(lastStudentId && lastStudentId.substring(0, 4) == studentId.substring(0, 4) && parseInt(lastStudentId.substring(5, 8)) + 1 == parseInt(studentId.substring(5, 8)))) {
              if (!await Students.checkStudentId(studentId)) {
                return {
                  error: true,
                  message: `Student ID on row ${i} (${cellValue}) is invalid.`
                };
              }
            }
            student.studentId = studentId;
          } else {
            studentExists = true;
          }
          application.studentId = cellValue as string;
          break;
        }
        case 1: {
          // Skip existing students
          if (studentExists) {
            continue;
          }
          if (!Number.isFinite(cellValue)) {
            return {
              error: true,
              message: `Graduation CAP on row ${i} (${cellValue}) must be a number.`
            };
          }
          if (cellValue < 0 || cellValue > 5) {
            return {
              error: true,
              message: `Graduation CAP on row ${i} (${cellValue}) must be between 0.0 and 5.0`
            };
          }
          student.gradCap = cellValue as number;
          students.push(student.toJSON() as StudentAttributes);
          break;
        }
        case 2: {
          const uniName = cellValue as string;
          const university = await University.getUniversityByName(uniName, false);
          if (!university) {
            return {
              error: true,
              message: `Invalid university name on row ${i} (${cellValue})`
            };
          }
          application.uniId = university.uniId;
          break;
        }
        case 3: {
          const status = cellValue as string;
          if (!constants.statuses.includes(status)) {
            return {
              error: true,
              message: `Invalid status on row ${i} (${cellValue})`
            };
          }
          application.status = status;
          break;
        }
        case 4: {
          const majorName = cellValue as string;
          const major = await Major.getMajorByName(majorName, application.uniId);
          if (!major) {
            return {
              error: true,
              message: `Invalid major name on row ${i} (${cellValue})`
            };
          }
          application.majorId = major.majorId;
          break;
        }
        case 5: {
          application.informant = cellValue as string;
          break;
        }
        case 6: {
          if (cellValue instanceof Date) {
            application.dateInformed = cellValue;
          }
          break;
        }
        case 7: {
          application.comment = cellValue as string;
          break;
        }
      }
    }
    applications.push(application.toJSON() as ApplicationAttributes);
  }
  await Student.bulkCreate(students);
  await Application.bulkCreate(applications);
  return {
    error: false,
    message: "ok",
  };
}
