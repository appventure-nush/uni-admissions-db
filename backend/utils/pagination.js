module.exports = {
  parseParams(req) {
    let { offset, limit } = req.query;
    if (!offset) offset = 0;
    if (!limit) limit = 10;
    if (limit > 30) limit = 30;
    return { offset, limit };
  },
};
