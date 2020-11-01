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
  // If strict is false, allows acronyms
  async getUniversityByName(name: string, strict = true) {
    if (strict) {
      return University.findOne({
        where: {
          uniName: name
        },
      });
    } else {
      const university = await University.findOne({
        where: {
          uniName: name
        },
      });
      if (university) {
        return university;
      }
      const results = (await University.findAll()).filter(uni => {
        const acronym = Array.from(uni.uniName)
          .filter(it => it === it.toUpperCase() && it !== it.toLowerCase())
          .join("");
        if (acronym == name.toUpperCase()) {
          return true;
        }
      });
      if (results.length != 1) {
        return null;
      }
      return results[0];
    }
  },
};
