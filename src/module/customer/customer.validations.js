import Joi from "joi";

export default {
  addDebt: {
    body: {
      username: Joi.string().min(2).max(40),
      phone: Joi.string(),
      address: Joi.string(),
      debt: Joi.number().required(),
    }
  }
};
