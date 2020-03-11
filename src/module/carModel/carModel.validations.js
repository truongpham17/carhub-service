import Joi from 'joi';

export default {
  createCarModel: {
    body: {
      name: Joi.string().required(),
      type: Joi.string().required(),
      fuelType: Joi.string().required(),
      numberOfSeat: Joi.number().required(),
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
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
