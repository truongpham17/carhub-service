import Joi from 'joi';

export default {
  createRating: {
    body: {
      user: Joi.string().required(),
      content: Joi.string(),
      ratingValue: Joi.number(),
      carMapping: Joi.string().required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updateRating: {
    body: {
      user: Joi.string().required(),
      content: Joi.string(),
      ratingValue: Joi.number(),
      carMapping: Joi.string().required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
