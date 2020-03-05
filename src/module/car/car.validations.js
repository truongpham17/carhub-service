import Joi from 'joi';

export default {
  createCar: {
    body: {
      carModel: Joi.string().required(),
      customer: Joi.string().required(),
      hub: Joi.string().required(),
      currentHub: Joi.string().required(),
      odometer: Joi.number(),
      images: Joi.string(),
      description: Joi.string(),
      price: Joi.number().min(0),
      feature: Joi.string(),
      VIN: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updateCar: {
    body: {
      carModel: Joi.string(),
      customer: Joi.string(),
      hub: Joi.string(),
      currentHub: Joi.string(),
      odometer: Joi.number(),
      images: Joi.string(),
      description: Joi.string(),
      price: Joi.number().min(0),
      feature: Joi.string(),
      VIN: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
