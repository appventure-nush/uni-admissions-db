const express = require("express");
const testController = require("../controllers/TestController");

const router = express.Router();

router.get("/", (req, res) => {
  res.end("Hello, world");
});

router.post("/create", async (req, res) => {
  const { name } = req.body;
  await testController.createUser(name);
  res.end("User created");
});

router.get("/users", async (req, res) => {
  const users = await testController.getUsers();
  res.json(users);
});

module.exports = router;
