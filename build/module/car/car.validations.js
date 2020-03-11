"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  createCar: {
    body: {
      carModel: _joi.default.string().required(),
      customer: _joi.default.string().required(),
      hub: _joi.default.string().required(),
      currentHub: _joi.default.string().required(),
      odometer: _joi.default.number(),
      images: _joi.default.array(),
      description: _joi.default.string(),
      price: _joi.default.number().min(0),
      feature: _joi.default.string(),
      VIN: _joi.default.string()
    },
    options: {
      allowUnknownBody: false
    }
  },
  updateCar: {
    body: {
      carModel: _joi.default.string(),
      customer: _joi.default.string(),
      hub: _joi.default.string(),
      currentHub: _joi.default.string(),
      odometer: _joi.default.number(),
      images: _joi.default.array(),
      description: _joi.default.string(),
      price: _joi.default.number().min(0),
      feature: _joi.default.string(),
      VIN: _joi.default.string()
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;