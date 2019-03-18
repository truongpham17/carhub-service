import Joi from 'joi';

export default {
  createBill: {
    body: {
      productList: Joi.array().items(Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().required(),
        discount: Joi.number(),
      })).min(1).required(),
      customer: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.string(),
        address: Joi.string(),
      }).required(),
      note: Joi.string(),
      totalQuantity: Joi.number().required(),
      totalPrice: Joi.number().required(),
      otherCost: Joi.number().required(),
      totalPaid: Joi.number().required(),
    },
  },
  editBill: {
    body: {
      productList: Joi.array().items(Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().required(),
        discount: Joi.number(),
      })).min(1),
      customer: Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.string(),
        address: Joi.string(),
      }),
      note: Joi.string(),
      totalQuantity: Joi.number(),
      totalPrice: Joi.number(),
      otherCost: Joi.number(),
      totalPaid: Joi.number(),
    },
  },
};
