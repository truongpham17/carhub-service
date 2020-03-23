import Joi from 'joi';

export default {
  addSharing: {
    body: {
      rental: Joi.string().required(),
      geometry: {
        lat: Joi.number(),
        lng: Joi.number(),
      },
      location: Joi.string(),
      totalCost: Joi.number()
        .min(0)
        .required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updateSharing: {
    body: {
      location: Joi.string(),
      geometry: {
        lat: Joi.number().min(0),
        lng: Joi.number().min(0),
      },
      totalCost: Joi.number().min(0),
      isActive: Joi.boolean(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
