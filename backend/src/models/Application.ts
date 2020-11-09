import University from "./University";

import Student from "./Student";

import Major from "./Major";

import sequelize from "./index";

import Sequelize = require("sequelize");

export interface ApplicationAttributes {
  studentId: string;
  majorId: number;
  uniId: number;
  status: string;
  informant: string;
  dateInformed: Date | null;
  comment: string;
}

class Application extends Sequelize.Model implements ApplicationAttributes {
  comment!: string;
  dateInformed!: Date | null;
  informant!: string;
  majorId!: number;
  status!: string;
  studentId!: string;
  uniId!: number;
}

Application.init({
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  studentId: {
    type: Sequelize.CHAR(8),
    references: {
      model: "students",
      key: "studentId",
    },
    allowNull: false,
  },
  majorId: {
    type: Sequelize.INTEGER,
    references: {
      model: "majors",
      key: "majorId",
    },
    allowNull: false,
  },
  uniId: {
    type: Sequelize.INTEGER,
    references: {
      model: "universities",
      key: "uniId",
    },
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  informant: {
    type: Sequelize.STRING,
  },
  dateInformed: {
    type: Sequelize.TIME,
  },
  comment: {
    type: Sequelize.TEXT,
  },
}, {
  tableName: "applications",
  sequelize
});


Application.belongsTo(University, {foreignKey: "uniId"});
Application.belongsTo(Major, {foreignKey: "majorId"});
Application.belongsTo(Student, {foreignKey: "studentId"});

export default Application;
