import Joi from 'joi';

export default {
  createBill: {
    body: {
      productList: Joi.array().items(Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().required(),
        discount: Joi.number(),
        isReturned: Joi.boolean(),
      })).min(1).required(),
      customer: Joi.object().keys({
        name: Joi.string(),
        phone: Joi.string(),
        address: Joi.string(),
      }),
      note: Joi.string(),
      totalQuantity: Joi.number().required(),
      totalPrice: Joi.number().required(),
      otherCost: Joi.number(),
      totalPaid: Joi.number().required(),
    },
  },
  editBill: {
    body: {
      productList: Joi.array().items(Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().required(),
        discount: Joi.number(),
        isReturned: Joi.boolean(),
      })).min(1),
      customer: Joi.object().keys({
        name: Joi.string(),
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
