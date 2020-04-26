import Joi from 'joi';

export default {
  createCustomer: {
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
  updateCustomer: {
    body: {
      fullName: Joi.string(),
      avatar: Joi.string(),
      dateOfBirth: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      fcmToken: Joi.string(),
      paypalCard: Joi.array().items(
        Joi.object({
          email: Joi.string(),
        })
      ),
    },
    options: {
      allowUnknownBody: true,
    },
  },
};
