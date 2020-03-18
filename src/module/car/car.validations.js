import Joi from 'joi';

export default {
  createCar: {
    body: {
      carModel: Joi.string().required(),
      customer: Joi.string().required(),
      hub: Joi.string().required(),
      currentHub: Joi.string(),
      odometer: Joi.number(),
      usingYear: Joi.number(),
      images: Joi.array(),
      description: Joi.string(),
      price: Joi.number().min(0),
      feature: Joi.string(),
      VIN: Joi.string(),
    },
    options: {
      allowUnknownBody: true,
    },
  },
  updateCar: {
    body: {
      carModel: Joi.string(),
      customer: Joi.string(),
      hub: Joi.string(),
      currentHub: Joi.string(),
      odometer: Joi.number(),
      images: Joi.array(),
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
