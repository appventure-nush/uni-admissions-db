module.exports = {
  parseParams(req) {
    const { uni, country } = req.query;
    if (uni) {
      return {
        uniName: uni,
      };
    }
    if (country) {
      return {
        country,
      };
    }
    return null;
  },
};
