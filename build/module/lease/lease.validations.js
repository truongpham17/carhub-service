"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  addLease: {
    body: {
      customer: _joi.default.string(),
      car: _joi.default.string(),
      hub: _joi.default.string(),
      startDate: _joi.default.date(),
      endDate: _joi.default.date(),
      price: _joi.default.number(),
      totalEarn: _joi.default.number(),
      cardNumber: _joi.default.string()
    },
    options: {// allowUnknownBody: false,
    }
  },
  updateLease: {
    body: {
      customer: _joi.default.string(),
      car: _joi.default.string(),
      hub: _joi.default.string(),
      startDate: _joi.default.date(),
      endDate: _joi.default.date(),
      price: _joi.default.number(),
      totalEarn: _joi.default.number()
    },
    options: {
      allowUnknownBody: false
    }
  }
};
exports.default = _default;