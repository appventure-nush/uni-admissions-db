const express = require("express");
const { ApplicationsController, UniversitiesController } = require("../controllers/index");

const router = express.Router();

router.get("/", (req, res) => {
  res.end("Hello, world");
});

router.get("/api/applications", async (req, res) => {
  const applications = await ApplicationsController.getApplicationsAllData();
  res.json(applications);
});

router.get("/api/admin", async (req, res) => {
  res.end("Ok");
});

router.get("/api/universities", async (req, res) => {
  res.json(await UniversitiesController.getUniversities());
});
module.exports = router;
