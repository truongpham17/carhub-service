import Joi from 'joi';

export default {
  createHub: {
    body: {
      name: Joi.string().required(),
      address: Joi.string().required(),
      description: Joi.string(),
    },
    options: {
      allowUnknownBody: true,
    },
  },
  updateHub: {
    body: {
      name: Joi.string(),
      address: Joi.string(),
      description: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
