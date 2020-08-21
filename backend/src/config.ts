import debug = require("debug");

class Config {
  public DB_USER!: string;
  public DB_PASSWORD!: string | undefined;
  public DB_NAME!: string;
  public DB_HOST!: string | undefined;
  public MS_CLIENT_ID!: string | undefined;
  public ADMIN_EMAILS: string[] = [];
}

const variables = ["DB_USER", "DB_PASSWORD", "DB_NAME", "DB_HOST", "MS_CLIENT_ID", "ADMIN_EMAILS"];
let config = new Config();
try {
  // eslint-disable-next-line global-require
  config = require("../config.json");
} catch (e) {
  debug.log("Config file not found, using environment variables");
}
variables.forEach((variable) => {
  // @ts-ignore
  if (config[variable] === undefined) {
    if (process.env[variable] === undefined) return;
    let value;
    try {
      // @ts-ignore
      value = JSON.parse(process.env[variable]);
    } catch (e) {
      value = process.env[variable];
    }
    // @ts-ignore
    config[variable] = value;
  }
});

export default config as Config;
