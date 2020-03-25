import Joi from 'joi';

export default {
  addSharingRequest: {
    body: {
      customer: Joi.string(),
      sharing: Joi.string(),
      message: Joi.string().default(''),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updateSharingRequest: {
    body: {
      status: Joi.string(),
      isActive: Joi.boolean(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
