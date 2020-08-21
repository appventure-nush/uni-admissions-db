import auth from "./middlewares/ms-auth";

import index from "./routes";
import admin from "./routes/admin";
import express = require('express');
import path = require("path");
import cookieParser = require("cookie-parser");
import logger = require("morgan");
const app = express();
require("./models");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api", auth(false));
app.use("/api/admin/", auth(true));
app.use(express.static(path.join(__dirname, "public")));
app.use(index);
app.use(admin);

export default app;
