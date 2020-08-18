import {Order} from "sequelize";

export default {
  // @ts-ignore
  parseParams(req): Order | undefined {
    const {sortBy, sortDesc = "false"}: { sortBy: string | undefined, sortDesc: string } = req.query;
    const order = sortDesc === "false" ? "ASC": "DESC"
    if (sortBy == undefined) {
      return undefined;
    }
    return [
      [sortBy, order],
      ["id", "ASC"]
    ]
  },
};
