import Joi from 'joi';

export default {
  addRental: {
    body: {
      carMapping: Joi.string().required(),
      user: Joi.string().required(),
      type: Joi.string().required(),
      leaser: Joi.string().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      pickupHub: Joi.string().required(),
      pickoffHub: Joi.string().required(),
      price: Joi.number().min(0),
      totalCost: Joi.number().min(0),
      description: Joi.string(),
      payment: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updateRental: {
    body: {
      carMapping: Joi.string().required(),
      user: Joi.string().required(),
      type: Joi.string().required(),
      leaser: Joi.string().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      pickupHub: Joi.string().required(),
      pickoffHub: Joi.string().required(),
      price: Joi.number().min(0),
      totalCost: Joi.number().min(0),
      description: Joi.string(),
      payment: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
