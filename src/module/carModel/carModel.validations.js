import Joi from 'joi';

export default {
  createCarModel: {
    body: {
      name: Joi.string().required(),
      VIN: Joi.string().required(),
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
      name: Joi.string().required(),
      VIN: Joi.string().required(),
      type: Joi.string().required(),
      fuelType: Joi.string().required(),
      numberOfSeat: Joi.number().required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
