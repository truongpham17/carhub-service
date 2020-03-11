import Joi from 'joi';

export default {
  addPayment: {
    body: {
      type: Joi.string().required(),
      amount: Joi.number()
        .min(0)
        .required(),
      note: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updatePayment: {
    body: {
      type: Joi.string(),
      amount: Joi.number().min(0),
      note: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
