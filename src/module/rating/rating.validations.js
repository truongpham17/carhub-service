import Joi from 'joi';

export default {
  createRating: {
    body: {
      customer: Joi.string().required(),
      content: Joi.string(),
      ratingValue: Joi.number(),
      car: Joi.string().required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updateRating: {
    body: {
      customer: Joi.string(),
      content: Joi.string(),
      ratingValue: Joi.number(),
      car: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
