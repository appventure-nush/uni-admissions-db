import express = require("express");

import ApplicationsController from "../controllers/Application";

import pagination from "../utils/pagination";

import filtering from "../utils/filtering";

import pretty from "../utils/pretty";
import sorting from "../utils/sorting";
import {AuthenticatedRequest} from "../types/express";

const router = express.Router();
router.get("/", (req, res) => {
  res.end("Hello, world");
});


router.get("/api/applications", (req, res, next) => {
  (async () => {
    const admin = (req as AuthenticatedRequest).admin
    const applications = await ApplicationsController.getApplications(
      pagination.parseParams(req),
      filtering.parseParams(req),
      sorting.parseParams(req, admin),
      admin ? ["id", "comment", "informant", "dateInformed", "status"] : ["id", "status"]
    );
    pretty(req, res, applications);
  })()
    .catch(e => {
      next(e)
    })
});

router.get("/api/applications/avgcap", async (req, res) => {
  const applications = await ApplicationsController.getAverageCap();
  res.json(applications);
});

export default router;

