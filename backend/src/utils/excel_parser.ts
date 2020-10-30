import xlsx = require("xlsx");
import Application, {ApplicationAttributes} from "../models/Application";
import Student, {StudentAttributes} from "../models/Student";
import Students from "../controllers/Students";

export default async function (file: Buffer) {
  const wb = xlsx.read(file, {
    type: "buffer"
  });
  const {Sheet1: sheet1} = wb.Sheets;
  const columns: string[] = [];
  let curr = 65;
  const ref = sheet1["!ref"];
  if (ref == undefined) {
    return;
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
          if (existingStudent == null) {
            if (!await Students.checkStudentId(studentId)) {
              return {
                error: true,
                message: `Student ID on row ${i} (${cellValue}) is invalid.`
              };
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
          if (studentExists){
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
          students.push(student);
        }
      }
    }
    applications.push(application);
  }
  console.log(applications);
}
