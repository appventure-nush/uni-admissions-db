const express = require("express");
const { ApplicationsController, UniversitiesController, MajorsController } = require("../controllers/index");

const router = express.Router();
const pagination = require("../utils/pagination");
const pretty = require("../utils/pretty");

router.get("/", (req, res) => {
  res.end("Hello, world");
});

router.get("/api/admin/applications/full", async (req, res) => {
  const applications = await ApplicationsController
    .getApplicationsAllData(pagination.parseParams(req));
  pretty(req, res, applications);
});

router.get("/api/applications", async (req, res) => {
  const applications = await ApplicationsController.getApplications(pagination.parseParams(req));
  pretty(req, res, applications);
});

router.get("/api/applications/basic", async (req, res) => {
  const applications = await ApplicationsController
    .getApplicationsBasic(pagination.parseParams(req));
  pretty(req, res, applications);
});

router.get("/api/applications/avgcap", async (req, res) => {
  const applications = await ApplicationsController.getAverageCap();
  res.json(applications);
});

router.get("/api/universities", async (req, res) => {
  const universities = await UniversitiesController.getUniversities();
  pretty(req, res, universities);
});

router.get("/api/majors", async (req, res) => {
  const majors = await MajorsController.getMajors();
  pretty(req, res, majors);
});
module.exports = router;
