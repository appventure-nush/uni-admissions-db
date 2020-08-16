import University from "../models/University";

export default {
  async getUniversities() {
    return University.findAll();
  },
  async getUniversityById(id: number) {
    return University.findOne({
      where: {
        uniId: id,
      },
    });
  },
};
