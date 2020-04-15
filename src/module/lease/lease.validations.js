import Joi from 'joi';

export default {
  addLease: {
    body: {
      car: Joi.string().required(),
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
      data: {
        car: Joi.string(),
        hub: Joi.string(),
        startDate: Joi.date(),
        endDate: Joi.date(),
        price: Joi.number(),
        totalEarn: Joi.number(),
        status: Joi.string(),
        message: Joi.string(),
      },
      log: {
        title: Joi.string().required,
        type: Joi.string().required,
        note: Joi.string(),
      },
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
