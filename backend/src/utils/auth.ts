import jwksClient = require("jwks-rsa");

const verify = require("jsonwebtoken/verify");
const {MS_CLIENT_ID: clientId} = require("../../config");

// https://login.microsoftonline.com/d72a7172-d5f8-4889-9a85-d7424751592a/oauth2/authorize?client_id=ad4c43c7-eaff-45f7-b7b4-fedc6bcb85ca&redirect_uri=http://localhost:3000&response_type=id_token&nonce=iwanttodie
export default async function verifyToken(token: string) {
  // Node has no atob
  const atob = (base64: string) => Buffer.from(base64, "base64").toString("ascii");
  const {kid} = JSON.parse(atob(token.split(".")[0]));
  const client = jwksClient({
    cache: true,
    jwksUri: "https://login.microsoftonline.com/common/discovery/keys",
  });
  return new Promise(((resolve, reject) => {
    client.getSigningKey(kid, async (err, key) => {
      if (err) return reject(err);
      try {
        const signingKey = key.getPublicKey()
        const options = {
          algorithms: ["RS256"],
          ignoreExpiration: true,
          maxAge: "1 year",
          audience: clientId,
        };
        const result = verify(token, signingKey, options);
        if (result.iss !== "https://sts.windows.net/d72a7172-d5f8-4889-9a85-d7424751592a/") {
          return reject(new Error("Token issuer invalid"));
        }
        return resolve(result);
      } catch (e) {
        return reject(e);
      }
    });
  }));
};
