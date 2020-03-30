import Joi from 'joi';

export default {
  addSharing: {
    body: {
      rental: Joi.string().required(),
      geometry: {
        lat: Joi.number(),
        lng: Joi.number(),
      },
      fromDate: Joi.date(),
      toDate: Joi.date(),
      address: Joi.string(),
      price: Joi.number()
        .min(0)
        .required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updateSharing: {
    body: {
      address: Joi.string(),
      geometry: {
        lat: Joi.number().min(0),
        lng: Joi.number().min(0),
      },
      fromDate: Joi.date(),
      toDate: Joi.date(),
      price: Joi.number().min(0),
      isActive: Joi.boolean(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
