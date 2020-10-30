import StudentsController from "../controllers/Students";
import UniversitiesController from "../controllers/University";
import MajorsController from "../controllers/Major";

export default {
  async validateApplication(application: any) {
    const {
      studentId, universityId, majorId, status, informant = "", dateInformed = null,
      comment = "",
    } = application;
    if (!studentId || !studentId.match(/20[0-9]{2}a[0-9]{3}/)) {
      return {
        error: true,
        message: "Invalid student ID",
      };
    }
    if (!await StudentsController.getStudentById(studentId)) {
      return {
        error: true,
        message: "Student doesn't exist",
      };
    }
    const university = await UniversitiesController.getUniversityById(universityId);
    if (!university) {
      return {
        error: true,
        message: "Invalid university",
      };
    }
    const major = await MajorsController.getMajorById(majorId);
    if (!major) {
      return {
        error: true,
        message: "Invalid major",
      };
    }
    if (major.uniId !== universityId) {
      return {
        error: true,
        message: "Major and university do not match",
      };
    }
    if (!status) {
      return {
        error: true,
        message: "Status cannot be empty",
      };
    }
    return {
      studentId,
      majorId,
      uniId: universityId,
      status,
      informant,
      dateInformed,
      comment,
    };
  }
};
