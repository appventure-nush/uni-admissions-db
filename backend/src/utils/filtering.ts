import {Request} from "express";
import {Op, WhereOptions} from "sequelize";
import FilterParams from "../types/filter-params";
import columns from "./columns";

export default {
  parseParams(req: Request, admin: boolean): WhereOptions | undefined {
    if (req.query.filter == undefined) {
      return undefined;
    }
    const where: WhereOptions = {};
    const filter = req.query.filter as unknown as FilterParams;
    for (const [key, value] of Object.entries(filter)) {
      if (key == "year") {
        const conditions = [];
        if (value.length == 3 && value[1] == "..") {
          const start = parseInt(value[0]);
          const end = parseInt(value[2]);
          // Prevent possible range unrolling DoS
          if(end-start > 500){
            throw "Too many years";
          }
          for (let i = start; i <= end; i++) {
            conditions.push({[Op.startsWith]: i.toString()});
          }
        } else {
          for (const val of value) {
            if (val.toString().length != 4 || parseInt(val).toString() != val) {
              throw "Year must be 4 digits";
            }
            conditions.push({[Op.startsWith]: val.toString()});
          }
        }
        where[`$Student.studentId$`] = {[Op.or]: conditions};
        continue;
      }
      if (key == "gradCap" && value.length == 3 && value[1] == "..") {
        const start = parseFloat(value[0]);
        const end = parseFloat(value[2]);
        // SQL between is inclusive
        where[`$Student.gradCap$`] = {[Op.between]: [start, end]};
        continue;
      }
      const columnKey = key.toString();
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
      where[`$${column.table.as}.${columnKey}$`] = {[Op.in]: value};
    }
    return where;
  }
  ,
};
