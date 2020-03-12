import Joi from 'joi';

export default {
  createCarModel: {
    body: {
      name: Joi.string().required(),
      type: Joi.string().required(),
      fuelType: Joi.string().required(),
      numberOfSeat: Joi.number().required(),
      price: Joi.number(),
      description: Joi.string(),
      images: Joi.array(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updateCarModel: {
    body: {
      name: Joi.string(),
      type: Joi.string(),
      fuelType: Joi.string(),
      numberOfSeat: Joi.number(),
      price: Joi.number(),
      description: Joi.string(),
      images: Joi.array(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
