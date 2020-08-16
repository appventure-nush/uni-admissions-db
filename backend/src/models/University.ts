import sequelize from "./index";

import Sequelize = require("sequelize");

export interface UniversityAttributes {
  uniId: number;
  uniName: string;
  country: string;
}
class University extends Sequelize.Model implements UniversityAttributes{
  public uniId!: number;
  public uniName!: string;
  public country!: string;
}
University.init({
  uniId: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  uniName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  country: {
    type: Sequelize.STRING,
    allowNull: false,
  },
},{
  tableName:"universities",
  sequelize
});

export default University;
