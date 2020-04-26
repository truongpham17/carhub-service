import Joi from 'joi';

export default {
  createCar: {
    body: {
      carModel: Joi.string().required(),
      customer: Joi.string(),
      hub: Joi.string(),
      currentHub: Joi.string(),
      odometer: Joi.number(),
      usingYear: Joi.number(),
      images: Joi.array(),
      description: Joi.string(),
      price: Joi.number().min(0),
      feature: Joi.string(),
      vin: Joi.string(),
      registrationCertificate: Joi.string(),
      inspectionCertificate: Joi.string(),
      carInsurance: Joi.string(),
      licensePlates: Joi.string(),
    },
    options: {
      allowUnknownBody: true,
    },
  },
  updateCar: {
    body: {
      carModel: Joi.string(),
      customer: Joi.string(),
      hub: Joi.string(),
      currentHub: Joi.string(),
      usingYear: Joi.number(),
      odometer: Joi.number(),
      images: Joi.array(),
      description: Joi.string(),
      price: Joi.number().min(0),
      feature: Joi.string(),
      vin: Joi.string(),
      licensePlates: Joi.string(),
      registrationCertificate: Joi.string(),
      inspectionCertificate: Joi.string(),
      carInsurance: Joi.string(),
      isActive: Joi.boolean(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
