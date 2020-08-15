const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const auth = require("./middlewares/ms-auth");

const app = express();

const index = require("./routes/index");
const admin = require("./routes/admin");

// eslint-disable-next-line no-unused-vars
const sequelize = require("./models/index");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api", auth(false));
app.use("/api/admin/", auth(true));
app.use(express.static(path.join(__dirname, "public")));
app.use(index);
app.use(admin);

module.exports = app;
