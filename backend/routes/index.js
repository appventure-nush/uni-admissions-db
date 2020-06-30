const express = require("express");
const { ApplicationsController, UniversitiesController } = require("../controllers/index");

const router = express.Router();
const pagination = require("../utils/pagination");

router.get("/", (req, res) => {
  res.end("Hello, world");
});

router.get("/api/applications/all", async (req, res) => {
  const applications = await ApplicationsController
    .getApplicationsAllData(pagination.parseParams(req));
  if (Object.keys(req.query).includes("pretty")) req.app.set("json spaces", 2);
  res.json(applications);
  req.app.set("json spaces", 0);
});

router.get("/api/applications", async (req, res) => {
  const applications = await ApplicationsController.getApplications(pagination.parseParams(req));
  if (Object.keys(req.query).includes("pretty")) req.app.set("json spaces", 2);
  res.json(applications);
  req.app.set("json spaces", 0);
});

router.get("/api/applications/avgcap", async (req, res) => {
  const applications = await ApplicationsController.getAverageCap();
  res.json(applications);
});

router.get("/api/admin", async (req, res) => {
  res.end("Ok");
});

router.get("/api/universities", async (req, res) => {
  res.json(await UniversitiesController.getUniversities());
});
module.exports = router;
