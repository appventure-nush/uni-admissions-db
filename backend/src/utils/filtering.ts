import {Request} from 'express';

export default {
  parseParams(req: Request) {
    const { uni, country } = req.query;
    if (uni && parseInt(<string>uni)) {
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
