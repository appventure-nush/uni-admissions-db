import {Request} from 'express';

export default {
  parseParams(req: Request) {
    const { offset, limit } = req.query;
    let offsetVal = 0
    let limitVal = 0
    if (!offset) offsetVal = 0;
    if (!limit) limitVal = 10;
    offsetVal = parseInt(String(offsetVal), 10);
    limitVal = parseInt(String(limitVal), 10);
    if (limitVal > 30) limitVal = 30;
    return { offset: offsetVal, limit: limitVal };
  },
};
