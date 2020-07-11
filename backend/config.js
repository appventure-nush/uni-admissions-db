const debug = require("debug");

const variables = ["DB_USER", "DB_PASSWORD", "DB_NAME", "DB_HOST", "MS_CLIENT_ID", "ADMIN_EMAILS"];
let config = {};
try {
  // eslint-disable-next-line global-require
  config = require("./config.json");
} catch (e) {
  debug.log("Config file not found, using environment variables");
}
variables.forEach((variable) => {
  if (config[variable] === undefined) {
    if (process.env[variable] === undefined) return;
    let value;
    try {
      value = JSON.parse(process.env[variable]);
    } catch (e) {
      value = process.env[variable];
    }
    config[variable] = value;
  }
});

module.exports = config;
