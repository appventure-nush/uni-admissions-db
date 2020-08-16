import verify from "../utils/auth";

import config from "../config";

export default (adminOnly: boolean) => async (req: any, res: any, next: ()=>any) => {
  const { token } = req.cookies;
  const decodedToken = (await verify(token)
    .then((decoded) => decoded).catch(
      (error) => {
        console.log(error);
        res.status(401).end("Invalid token");
        return null;
      },
    )) as {
    unique_name: string
  } | null;
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
