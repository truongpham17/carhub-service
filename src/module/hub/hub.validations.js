import Joi from 'joi';

export default {
  createHub: {
    body: {
      name: Joi.string().required(),
      address: Joi.string().required(),
      geoLocation: Joi.string().required(),
      description: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updateHub: {
    body: {
      name: Joi.string(),
      address: Joi.string(),
      geoLocation: Joi.string(),
      description: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
