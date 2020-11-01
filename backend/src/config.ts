import * as NodeVault from "node-vault";
import deasync = require( "deasync");

class Config {
  public DB_USER!: string;
  public DB_PASSWORD!: string | undefined;
  public DB_NAME!: string;
  public DB_HOST!: string | undefined;
  public MS_CLIENT_ID!: string | undefined;
  public ADMIN_EMAILS: string[] = [];
}

function deasyncPromise<T>(promise: Promise<T>): T | null {
  let result: T | null = null;
  let error = null;
  let done = false;
  promise.then(res => {
    result = res;
    done = true;
  })
    .catch(err => {
      error = err;
      done = true;
    });
  while (!done) {
    deasync.runLoopOnce();
  }
  if (error) {
    throw error;
  }
  return result;
}

let config: Config | null;
try {
  config = require("../config.json");
} catch (e) {
  const vaultClient = NodeVault({
    endpoint: "https://vault.nush.app",
  });
  const token = deasyncPromise(vaultClient.userpassLogin({
    username: "uni-db",
    password: process.env.VAULT_PASSWORD
  })).auth.client_token;
  const secretsClient = NodeVault({
    endpoint: "https://vault.nush.app",
    token
  });
  config = deasyncPromise(secretsClient.read("apps/data/uni-db")).data.data;
}

if (config == null) {
  throw "Config cannot be null";
}

export default config as Config;
