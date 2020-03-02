import Joi from 'joi';

export default {
  addLease: {
    body: {
      startDate: Joi.date(),
      endDate: Joi.date(),
      price: Joi.number(),
      totalEarn: Joi.number(),
      status: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updateLease: {
    body: {
      startDate: Joi.date(),
      endDate: Joi.date(),
      price: Joi.number(),
      totalEarn: Joi.number(),
      status: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
