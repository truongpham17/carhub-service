"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  addRental: {
    body: {
      carModel: _joi.default.string().required(),
      customer: _joi.default.string().required(),
      type: _joi.default.string().required(),
      leaser: _joi.default.string(),
      startDate: _joi.default.date().required(),
      endDate: _joi.default.date().required(),
      pickupHub: _joi.default.string().required(),
      pickoffHub: _joi.default.string().required(),
      price: _joi.default.number().min(0),
      totalCost: _joi.default.number().min(0),
      description: _joi.default.string(),
      payment: _joi.default.string()
    },
    options: {
      allowUnknownBody: false
    }
  },
  updateRental: {
    body: {
      car: _joi.default.string().required(),
      customer: _joi.default.string().required(),
      type: _joi.default.string().required(),
      leaser: _joi.default.string(),
      startDate: _joi.default.date().required(),
      endDate: _joi.default.date().required(),
      pickupHub: _joi.default.string().required(),
      pickoffHub: _joi.default.string().required(),
      price: _joi.default.number().min(0),
      totalCost: _joi.default.number().min(0),
      description: _joi.default.string(),
      payment: _joi.default.string()
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;