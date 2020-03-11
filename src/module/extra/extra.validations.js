import Joi from 'joi';

export default {
  addExtra: {
    body: {
      content: Joi.string(),
      price: Joi.number().min(0),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updateExtra: {
    body: {
      content: Joi.string(),
      price: Joi.number().min(0),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
