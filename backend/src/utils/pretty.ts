import {Request, Response} from "express";

export default (req: Request, res: Response, json: any) => {
  if (Object.keys(req.query).includes("pretty")) req.app.set("json spaces", 2);
  res.json(json);
  req.app.set("json spaces", 0);
};
