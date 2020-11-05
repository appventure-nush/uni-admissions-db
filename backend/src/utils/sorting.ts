import {Order} from "sequelize";
import {Request} from "express";
import SortParams from "../types/sort-params";
import columns from "./columns";


export default {
  parseParams(req: Request, admin: boolean): Order | undefined {
    if (req.query.sortBy == undefined) {
      return [["id", "desc"]];
    }
    const sortBy = req.query.sortBy as unknown as Array<SortParams>;
    const results= sortBy.map(sort => {
      const column = columns.find(col => col.name == sort.param);
      if (column == undefined) {
        return [sort.param, sort.order];
      }
      if (column.adminOnly && !admin) {
        throw "Unauthorized";
      }
      if (column.table == null) {
        return [sort.param, sort.order];
      }
      return [column.table, sort.param, sort.order];
    });
    if (results.find(result => result[0] != "id") == undefined) {
      results.push(["id", "desc"]);
    }
    return results as Order;
  },
};
