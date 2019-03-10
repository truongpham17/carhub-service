import Joi from 'joi';

export default {
  createStore: {
    body: {
      name: Joi.string().required(),
      totalImportProduct: Joi.number().min(0),
      productQuantity: Joi.number().min(0),
    },
  },
  editStore: {
    body: {
      name: Joi.string(),
      totalImportProduct: Joi.number().min(0),
      productQuantity: Joi.number().min(0),
    },
  },
};
