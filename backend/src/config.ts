import * as NodeVault from "node-vault";

class Config {
  public DB_USER!: string;
  public DB_PASSWORD!: string | undefined;
  public DB_NAME!: string;
  public DB_HOST!: string | undefined;
  public MS_CLIENT_ID!: string | undefined;
  public ADMIN_EMAILS: string[] = [];
}

let config: Config | null = null;

export default async (): Promise<Config> => {
  if (config != null) {
    return config;
  }
  try {
    const conf = require("../config.json");
    config = conf;
    return conf;
  } catch (e) {
    const vaultClient = NodeVault({
      endpoint: "https://vault.nush.app",
    });
    const token = (await vaultClient.userpassLogin({
      username: "uni-db",
      password: process.env.VAULT_PASSWORD
    })).auth.client_token;
    const secretsClient = NodeVault({
      endpoint: "https://vault.nush.app",
      token
    });
    const conf = (await secretsClient.read("apps/data/uni-db")).data;
    config = conf;
    return conf;
  }
};
