import {Request} from "express";

export default {
  parseParams(req: Request) {
    const {offset, limit} = req.query;
    let offsetVal = parseInt(String(offset), 10);
    let limitVal = parseInt(String(limit), 10);
    if (!offset) offsetVal = 0;
    if (!limit) limitVal = 10;
    if (limitVal > 50) limitVal = 50;
    return {offset: offsetVal, limit: limitVal};
  },
};
