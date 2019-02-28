import Joi from 'joi';

export default {
  register: {
    body: {
      password: Joi.string()
        .min(6)
        .max(120),
      name: Joi.string()
        .min(3)
        .max(80)
        .required(),
      email: Joi.string()
        .max(120)
        .required(),
      avatar: Joi.string(),
      role: Joi.number(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  createUser: {
    body: {
      password: Joi.string()
        .min(6)
        .max(120),
      name: Joi.string()
        .min(3)
        .max(80)
        .required(),
      email: Joi.string()
        .max(120)
        .required(),
      avatar: Joi.string(),
    },
  },
  login: {
    body: {
      email: Joi.string()
        .max(120)
        .required(),
      password: Joi.string().required(),
    },
  },
  editProfile: {
    body: {
      password: Joi.string()
        .min(6)
        .max(120),
      name: Joi.string()
        .min(3)
        .max(80),
      email: Joi.string().max(120),
      avatar: Joi.string(),
      role: Joi.number(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};