import Joi from 'joi';

export default {
  createEmployee: {
    body: {
      hub: Joi.string().required(),
      fullName: Joi.string().required(),
      avatar: Joi.string().required(),
      dateOfBirth: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      account: Joi.string().required(),
    },

    options: {
      allowUnknownBody: false,
    },
  },
  updateEmployee: {
    body: {
      hub: Joi.string(),
      fullName: Joi.string(),
      avatar: Joi.string(),
      dateOfBirth: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
