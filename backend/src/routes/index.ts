import express = require("express");

import ApplicationsController from "../controllers/Application";

import pagination from "../utils/pagination";

import filtering from "../utils/filtering";

import pretty from "../utils/pretty";
import sorting from "../utils/sorting";
import {AuthenticatedRequest} from "../types/express";
import UniversitiesController from "../controllers/University";
import MajorsController from "../controllers/Major";

const router = express.Router();
router.get("/", (req, res) => {
  res.end("Hello, world");
});


router.get("/api/applications", (req, res, next) => {
  (async () => {
    const admin = (req as AuthenticatedRequest).admin;
    const applications = await ApplicationsController.getApplications(
      pagination.parseParams(req),
      filtering.parseParams(req, admin),
      sorting.parseParams(req, admin),
      admin ? ["id", "comment", "informant", "dateInformed", "status"] : ["id", "status"]
    );
    pretty(req, res, applications);
  })()
    .catch(e => {
      next(e)
    })
});
router.get("/api/summary", (req, res, next) => {
  (async () => {
    const admin = (req as AuthenticatedRequest).admin;
    const data: any = await ApplicationsController.summarize(filtering.parseParams(req, admin));
    const validKeys = Object.keys(data);
    if(req.query.include && req.query.exclude){
      throw "Cannot use both include and exclude";
    }
    if(req.query.include){
      const include = req.query.include as string[];
      for(const key of validKeys){
        if(!include.includes(key)){
          delete data[key];
        }
      }
    }
    if(req.query.exclude){
      const exclude = req.query.exclude as string[];
      for(const key of validKeys){
        if(exclude.includes(key)){
          delete data[key];
        }
      }
    }
    pretty(req, res, data);
  })()
    .catch(e => {
      next(e);
    })
})
router.get("/api/universities", async (req, res) => {
  const universities = await UniversitiesController.getUniversities();
  pretty(req, res, universities);
});

router.get("/api/majors", async (req, res) => {
  const uniId = req.query.uniId == undefined ? undefined : parseInt(req.query.uniId.toString())
  const majors = await MajorsController.getMajors(uniId);
  pretty(req, res, majors);
});


export default router;

