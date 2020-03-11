import Joi from 'joi';

export default {
  addCard: {
    body: {
      name: Joi.string(),
      number: Joi.string(),
      expiredDate: Joi.date(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updateCard: {
    body: {
      name: Joi.string(),
      number: Joi.string(),
      expiredDate: Joi.date(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
