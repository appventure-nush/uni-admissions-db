import express = require("express");

import ApplicationsController from "../controllers/Application";
import MajorsController from "../controllers/Major";
import UniversitiesController from "../controllers/University";

import pagination from "../utils/pagination";

import filtering from "../utils/filtering";

import pretty from "../utils/pretty";
import sorting from "../utils/sorting";

const router = express.Router();
router.get("/", (req, res) => {
  res.end("Hello, world");
});

router.get("/api/admin/applications/full", async (req, res) => {
  const applications = await ApplicationsController
    .getApplicationsAllData(
      pagination.parseParams(req),
      filtering.parseParams(req),
      sorting.parseParams(req));
  pretty(req, res, applications);
});

router.get("/api/applications", async (req, res) => {
  const applications = await ApplicationsController.getApplications(
    pagination.parseParams(req),
    filtering.parseParams(req),
    sorting.parseParams(req)
  );
  pretty(req, res, applications);
});

router.get("/api/applications/basic", async (req, res) => {
  const applications = await ApplicationsController
    .getApplicationsBasic(
      pagination.parseParams(req),
      filtering.parseParams(req),
      sorting.parseParams(req));
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
export default router;
