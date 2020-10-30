import auth from "./middlewares/ms-auth";

import index from "./routes";
import admin from "./routes/admin";
import adminMiddleware from "./middlewares/admin";
import express = require("express");
import path = require("path");
import cookieParser = require("cookie-parser");
import logger = require("morgan");
import {Application} from "express";
const app = express();
require("./models");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use("/api", auth() as Application);
app.use("/api/admin", adminMiddleware as Application);
app.use(express.static(path.join(__dirname, "public")));
app.use(index);
app.use(admin);

export default app;
