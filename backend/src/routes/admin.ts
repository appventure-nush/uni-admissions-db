import express = require("express");

import ApplicationsController from "../controllers/Application";
import MajorsController from "../controllers/Major";
import StudentsController from "../controllers/Students";
import UniversitiesController from "../controllers/University";

const router = express.Router();

router.post("/api/admin/applications/create", async (req, res) => {
  const { body } = req;
  const {
    studentId, universityId, majorId, status, informant = "", dateInformed = null,
    comment = "",
  } = body;
  if (!studentId || !studentId.match(/20[0-9]{2}a[0-9]{3}/)) {
    res.json({
      error: true,
      message: "Invalid student ID",
    });
    return;
  }
  if (!await StudentsController.getStudentById(studentId)) {
    res.json({
      error: true,
      message: "Student doesn't exist",
    });
    return;
  }
  const university = await UniversitiesController.getUniversityById(universityId);
  if (!university) {
    res.json({
      error: true,
      message: "Invalid university",
    });
    return;
  }
  const major = await MajorsController.getMajorById(majorId);
  if (!major) {
    res.json({
      error: true,
      message: "Invalid major",
    });
    return;
  }
  if (major.uniId !== universityId) {
    res.json({
      error: true,
      message: "Major and university do not match",
    });
    return;
  }
  if (!status) {
    res.json({
      error: true,
      message: "Status cannot be empty",
    });
    return;
  }
  const application = {
    studentId,
    majorId,
    uniId: universityId,
    status,
    informant,
    dateInformed,
    comment,
  };
  await ApplicationsController.createApplication(application);
  res.json({
    error: false,
    message: `Application created`,
  });
});

router.post("/api/admin/students/create", async (req, res) => {
  const { body } = req;
  const {
    studentId, gradCap,
  } = body;
  if (!studentId || !studentId.match(/20[0-9]{2}a[0-9]{3}/)) {
    res.json({
      error: true,
      message: "Invalid student ID",
    });
    return;
  }
  if (!gradCap || gradCap < 0 || gradCap > 5) {
    res.json({
      error: true,
      message: "Invalid cap",
    });
  }
});

export default router;
