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
  updateLog: {
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
