const express = require("express");
const { ApplicationsController, UniversitiesController } = require("../controllers/index");

const router = express.Router();

router.get("/", (req, res) => {
  res.end("Hello, world");
});

router.get("/applications", async (req, res) => {
  const applications = await ApplicationsController.getApplicationsAllData();
  res.json(applications);
});

router.get("/universities", async (req, res) => {
  res.json(await UniversitiesController.getUniversities());
});
module.exports = router;
