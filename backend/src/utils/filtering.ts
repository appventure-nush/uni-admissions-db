export default {
  // @ts-ignore
  parseParams(req) {
    const { uni, country } = req.query;
    if (uni && parseInt(uni)) {
      return {
        uniId: uni,
      };
    }
    if (country) {
      return {
        country,
      };
    }
    return undefined;
  },
};
