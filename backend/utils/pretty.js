module.exports = (req, res, json) => {
  if (Object.keys(req.query).includes("pretty")) req.app.set("json spaces", 2);
  res.json(json);
  req.app.set("json spaces", 0);
};
