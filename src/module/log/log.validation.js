import Joi from 'joi';

export default {
  createLog: {
    body: {
      type: Joi.string(),
      detail: Joi.string(),
      note: Joi.string(),
      isActive: Joi.boolean(),
    },
    options: {
      allowUnknownBody: true,
    },
  },
  updateLod: {
    body: {
      type: Joi.string(),
      detail: Joi.string(),
      note: Joi.string(),
      isActive: Joi.boolean(),
    },
    options: {
      allowUnknownBody: true,
    },
  },
};
