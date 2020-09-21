import {Request} from 'express';
import {Op, WhereOptions} from "sequelize";
import FilterParams from "../types/filter-params";
import columns from "./columns";

export default {
  parseParams(req: Request, admin: boolean): WhereOptions | undefined {
    if (req.query.filter == undefined) {
      return undefined;
    }
    const where: WhereOptions = {};
    const filter = req.query.filter as unknown as FilterParams
    for (const [key, value] of Object.entries(filter)) {
      const columnKey = key.toString()
      const column = columns.find(col => col.name == columnKey);
      if (column == undefined) {
        where[columnKey] = {[Op.in]: value};
        continue;
      }
      if (column.adminOnly && !admin) {
        throw "Unauthorized";
      }
      if (column.table == null) {
        where[columnKey] = {[Op.in]: value};
        continue;
      }
      where[`$${column.table.as}.${columnKey}$`] = {[Op.in]: value}
    }
    return where;
  }
  ,
};
