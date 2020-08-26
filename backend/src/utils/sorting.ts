import {Order} from "sequelize";
import {Request} from 'express';

export default {
  parseParams(req: Request): Order | undefined {
    const sortDesc = req.query.sortDesc === undefined ? "false" : req.query.sortDesc;
    const order = sortDesc === "false" ? "ASC": "DESC"
    if (req.query.sortBy == undefined) {
      return undefined;
    }
    return [
      [String(req.query.sortBy), order],
      ["id", "ASC"]
    ]
  },
};
