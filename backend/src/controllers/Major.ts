import Major, {MajorAttributes} from "../models/Major";

export default {
  async getMajors(uniId: number | undefined) {
    if (uniId == undefined || Number.isNaN(uniId)) {
      return Major.findAll();
    }
    return Major.findAll({
      where: {
        uniId
      }
    });
  },

  async getMajorById(id: number) {
    return Major.findOne({
      where: {
        majorId: id,
      },
    });
  },

  async getMajorByName(name: string, uniId: number) {
    return Major.findOne({
      where: {
        majorName: name,
        uniId
      },
    });
  },

  async createMajor(major: MajorAttributes) {
    delete major.majorId;
    console.log(major);
    return Major.create(major);
  }
};
