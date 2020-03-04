import Joi from 'joi';

export default {
  createManager: {
    body: {
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
  updateManager: {
    body: {
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
