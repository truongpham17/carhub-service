import Joi from 'joi';

export default {
  addLicense: {
    body: {
      number: Joi.string(),
      fullname: Joi.string(),
      dateOfBirth: Joi.date(),
      nationality: Joi.string(),
      address: Joi.string(),
      rank: Joi.string(),
      expires: Joi.date(),
      image: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  updateLicense: {
    body: {
      number: Joi.string(),
      fullname: Joi.string(),
      dateOfBirth: Joi.date(),
      nationality: Joi.string(),
      address: Joi.string(),
      rank: Joi.string(),
      expires: Joi.date(),
      image: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
