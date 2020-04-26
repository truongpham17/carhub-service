import Joi from 'joi';

export default {
  addRental: {
    body: {
      carModel: Joi.string().required(),
      customer: Joi.string().required(),
      type: Joi.string().required(),
      leaser: Joi.string(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      pickupHub: Joi.string().required(),
      pickoffHub: Joi.string().required(),
      price: Joi.number().min(0),
      totalCost: Joi.number().min(0),
      description: Joi.string(),
      payment: Joi.string(),
      nonce: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updateRental: {
    body: {
      data: {
        car: Joi.string(),
        customer: Joi.string(),
        type: Joi.string(),
        leaser: Joi.string(),
        startDate: Joi.date(),
        endDate: Joi.date(),
        pickupHub: Joi.string(),
        pickoffHub: Joi.string(),
        price: Joi.number().min(0),
        totalCost: Joi.number().min(0),
        description: Joi.string(),
        payment: Joi.string(),
        status: Joi.string(),
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
