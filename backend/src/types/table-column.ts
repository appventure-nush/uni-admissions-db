import {Association} from "sequelize";

export default class TableColumn {
  constructor(public name: string,
              public table: Association | null,
              public adminOnly: boolean
  ) {
  }
}
