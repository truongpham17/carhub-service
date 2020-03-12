import Joi from 'joi';

export default {
  addLease: {
    body: {
      customer: Joi.string(),
      car: Joi.string(),
      hub: Joi.string(),
      startDate: Joi.date(),
      endDate: Joi.date(),
      price: Joi.number(),
      totalEarn: Joi.number(),
      cardNumber: Joi.string(),
    },
    options: {
      // allowUnknownBody: false,
    },
  },
  updateLease: {
    body: {
      customer: Joi.string(),
      car: Joi.string(),
      hub: Joi.string(),
      startDate: Joi.date(),
      endDate: Joi.date(),
      price: Joi.number(),
      totalEarn: Joi.number(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
