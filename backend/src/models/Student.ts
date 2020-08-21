import sequelize from "./index";

import Sequelize = require("sequelize");

export interface StudentAttributes {
  studentId: string;
  gradCap: number;
}
class Student extends Sequelize.Model implements StudentAttributes{
  public studentId!: string;
  public gradCap!: number;
}

Student.init( {
  studentId: {
    type: Sequelize.CHAR(8),
    allowNull: false,
    primaryKey: true,
  },
  gradCap: {
    allowNull: false,
    type: Sequelize.DECIMAL(2, 1),
  },
},{
  tableName: "students",
  sequelize
})

export default Student;
