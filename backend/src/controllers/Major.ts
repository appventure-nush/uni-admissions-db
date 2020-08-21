import Major from "../models/Major";

export default {
  async getMajors() {
    return Major.findAll();
  },

  async getMajorById(id: number) {
    return Major.findOne({
      where: {
        majorId: id,
      },
    });
  },
};
