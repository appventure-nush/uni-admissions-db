import University from "./University";

import sequelize from "./index";
import Sequelize = require("sequelize");

export interface MajorAttributes {
  majorId: number;
  majorName: string;
  category: string;
  uniId: number;
}

class Major extends Sequelize.Model implements MajorAttributes {
  public majorId!: number;
  public majorName!: string;
  public category!: string;
  public uniId!: number;
}

sequelize().then(sequelize => {
  Major.init({
    majorId: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    majorName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING,
    },
    uniId: {
      type: Sequelize.INTEGER,
      references: {
        model: "universities",
        key: "uniId",
      },
    },
  }, {
    tableName: "majors",
    sequelize
  });
});

Major.belongsTo(University, {foreignKey: "uniId"});

export default Major;
