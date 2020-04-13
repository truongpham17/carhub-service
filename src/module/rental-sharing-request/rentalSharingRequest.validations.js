import Joi from 'joi';

export default {
  addSharingRequest: {
    body: {
      customer: Joi.string(),
      sharing: Joi.string(),
      message: Joi.string(),
      fromDate: Joi.date(),
      toDate: Joi.date(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updateSharingRequest: {
    body: {
      status: Joi.string(),
      isActive: Joi.boolean(),
      fromDate: Joi.date(),
      toDate: Joi.date(),
      totalCost: Joi.number().min(0),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
