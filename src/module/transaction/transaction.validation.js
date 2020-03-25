import Joi from 'joi';

export default {
  addTransaction: {
    body: {
      sender: Joi.string(),
      receiver: Joi.string(),
      type: Joi.string(),
      amount: Joi.number(),
      note: Joi.string(),
    },
    options: {
      allowUnknownBody: true,
    },
  },
  updateTransaction: {
    body: {
      sender: Joi.string(),
      receiver: Joi.string(),
      type: Joi.string(),
      amount: Joi.number(),
      note: Joi.string(),
    },
    options: {
      allowUnknownBody: true,
    },
  },
};
