import express = require("express");
import multer = require("multer");
import ApplicationsController from "../controllers/Application";
import MajorsController from "../controllers/Major";
import StudentsController from "../controllers/Students";
import UniversitiesController from "../controllers/University";
import excel_parser from "../utils/excel_parser";
import validation from "../utils/validation";
import {promises as fs} from "fs";
import {ApplicationAttributes} from "../models/Application";

const router = express.Router();


const upload = multer({dest: "uploads/"});

router.post("/api/admin/applications/bulkCreate", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.json({
      error: true,
      message: "No file attached",
    });
    return;
  }
  const file = await fs.readFile(req.file.path);
  const result = await excel_parser(file);
  await fs.unlink(req.file.path);
  if (result.error) {
    return res.json(result);
  }
  res.json({
    error: false,
    message: "ok"
  });
  return;
});
router.post("/api/admin/applications/create", async (req, res) => {
  const {body} = req;
  const application = await validation.validateApplication(body);
  if (application.error) {
    return res.json(application);
  }
  await ApplicationsController.createApplication(application as ApplicationAttributes);
  res.json({
    error: false,
    message: `Application created`,
  });
});

router.post("/api/admin/applications/edit", async (req, res) => {
  const {body} = req;
  if (!body.id || !(body.id instanceof Number)) {
    return res.json({
      error: true,
      message: "Please specify application number."
    });
  }
  const existingApplication = await ApplicationsController.getApplicationById(body.name);
  if(existingApplication == null){
    return res.json({
      error: true,
      message: "Application does not exist"
    });
  }
  const application = await validation.validateApplication(body);
  if (application.error) {
    return res.json(application);
  }
  await ApplicationsController.editApplication(body.id, application as ApplicationAttributes);
  return res.json({
    error: false,
    message: "Application edited successfully"
  });
});

router.post("/api/admin/students/create", async (req, res) => {
  const {body} = req;
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
  await StudentsController.addStudent({
    studentId,
    gradCap
  });
  res.json({
    error: false,
    message: `Student created`,
  });
});

router.post("/api/admin/majors/create", async (req, res) => {
  const {body} = req;
  const {
    majorName, category, uniId
  } = body;
  if (!majorName || !category) {
    res.json({
      error: true,
      message: "Please fill in all fields",
    });
    return;
  }
  const university = await UniversitiesController.getUniversityById(uniId);
  if (!university) {
    return res.json({
      error: true,
      message: "Invalid university",
    });
  }
  await MajorsController.createMajor({
    uniId,
    majorName,
    category,
    majorId: 0
  });
  res.json({
    error: false,
    message: `Major created`,
  });
});

export default router;
