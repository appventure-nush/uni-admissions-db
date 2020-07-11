const verify = require("../utils/auth");
const config = require("../config");

module.exports = (adminOnly) => async (req, res, next) => {
  const { token } = req.cookies;
  const decodedToken = await verify(token)
    .then((decoded) => decoded).catch(
      (error) => {
        console.log(error);
        res.status(401).end("Invalid token");
        return null;
      },
    );
  if (decodedToken == null) return;
  if (adminOnly) {
    if (config.ADMIN_EMAILS.includes(decodedToken.unique_name)) {
      next();
      return;
    }
    res.status(403).end("Insufficient permission to perform action");
    return;
  }
  next();
};
